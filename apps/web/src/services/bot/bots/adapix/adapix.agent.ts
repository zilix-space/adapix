import { Bot } from '../../bot-manager'
import { telegram } from '../../adapters/telegram.adapter'
import {
  appendResponseMessages,
  generateObject,
  generateText,
  NoSuchToolError,
  tool,
  type Message,
} from 'ai'
import { db } from '@app/db'
import { UserSettings } from '@app/modules/src/domain/entities/User'
import { getAdapixPrompt } from './adapix.prompt'
import { z } from 'zod'
import { modules } from '@app/modules/src'
import { tryCatch } from '@/helpers/try-catch'
import { randomUUID } from 'node:crypto'
import { whatsapp } from '../../adapters/whatsapp/adapter'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { readPixFromQrCodeFile } from '../../helpers/read-pix-from-qrcode'
import { getUrl } from '@/helpers/get-url'

const KEY = process.env.GEMINI_KEY || 'AIzaSyC7jXkCRurNRao6iM2302YJss1jUwP0iBE'

const google = createGoogleGenerativeAI({ apiKey: KEY })
const model = google('gemini-2.0-flash')

export const bot = Bot.create({
  id: 'bot-id',
  name: 'bot-name',
  logger: {
    log: (message, context) => {
      console.log(message, context)
    },
    error: (message, trace, context) => {
      console.error(message, trace, context)
    },
    warn: (message, context) => {
      console.warn(message, context)
    },
    debug: (message, context) => {
      console.debug(message, context)
    },
    verbose: (message, context) => {
      console.log(message, context)
    },
  },
  adapters: {
    telegram: telegram({
      token: '7347060481:AAEtch8mbubnlEb0vKldiZPSVPwvfjrnerg',
      webhook: {
        url: getUrl('/api/bots/telegram'),
      },
    }),
    whatsapp: whatsapp({
      phone: '623194640877023',
      token:
        'EAFWui6aFfsYBO4WszVuRBqtFohHfKdQsSUnB931xPt0TQnZAlZBieqhIG9VVCmyMFDU5I11dlh5WVpnKaH1L0vtQXaNFOkk5L05ZAeFiBOgJpXXwWCWFslMJI66VFDOVebfPzFTTOnku5hoN9PyRCRl055iyfKF5HLpKBfyAX3PtJz9LnkqvzRa7DIRpKqJhwZDZD',
    }),
  },
  on: {
    message: async (ctx) => {
      try {
        if (!ctx.message.content) return
        if (ctx.message.content.type === 'command') return

        const user = await db.user.findFirst({
          where: {
            OR: [
              {
                settings: {
                  path: ['contact', 'phone'],
                  equals: `+${ctx.message.author.id}`,
                },
              },
              {
                settings: {
                  path: ['contact', 'telegram'],
                  equals: ctx.message.author.id,
                },
              },
            ],
          },
          include: {
            transactions: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 10,
            },
          },
        })

        if (!user) {
          await bot.send({
            provider: ctx.provider,
            channel: ctx.channel.id,
            content: {
              type: 'text',
              content: 'User not found',
            },
          })

          return
        }

        const settings = user.settings as unknown as UserSettings
        if (!settings) {
          await bot.send({
            provider: ctx.provider,
            channel: ctx.channel.id,
            content: {
              type: 'text',
              content: 'User settings not found',
            },
          })

          return
        }

        const history = await db.message.findMany({
          where: {
            userId: user.id,
          },
        })

        const messages = history.map((message) => {
          return {
            id: message.id,
            role: message.role,
            content: message.content,
            createdAt: message.createdAt,
            experimental_attachments: message.attachments as any,
            parts: message.parts as any,
          } as Message
        })

        if (ctx.message.content.type === 'text') {
          messages.push({
            id: randomUUID(),
            content: ctx.message.content.content,
            role: 'user',
          })
        }

        let file: string | null = null
        if (ctx.message.content.type !== 'text') {
          file = await modules.provider.storage.upload(ctx.message.content.file)
          let content = ''

          if (ctx.message.content.type === 'audio') {
            content =
              'This is an audio file sent by the user. Please listen to the audio and respond according to its content.'
          } else if (ctx.message.content.type === 'image') {
            content =
              'This is an image sent by the user. If it is a QR Code, try to extract the PIX information. Otherwise, ask the user about the content of the image.'
          } else {
            content =
              'The user has sent a file. Analyze the content and guide the user as needed.'
          }

          console.log({
            name: ctx.message.content.file.name,
            contentType: ctx.message.content.file.type,
            url: file,
          })

          messages.push({
            id: randomUUID(),
            role: 'user',
            content,
            experimental_attachments: [
              {
                name: ctx.message.content.file.name,
                contentType: ctx.message.content.file.type,
                url: file,
              },
            ],
          })
        }

        await db.message.create({
          data: {
            role: 'user',
            content: ctx.message.content.content,
            userId: user.id,
            attachments: ctx.message.content.type !== 'text' &&
              file && [
                {
                  name: ctx.message.content.file.name,
                  contentType: ctx.message.content.file.type,
                  url: file,
                },
              ],
          },
        })

        const { response } = await generateText({
          model,
          messages,
          toolChoice: 'auto',
          temperature: 0.4,
          maxSteps: 10,
          system: getAdapixPrompt({
            platform: ctx.provider,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              settings: {
                kyc: {
                  status: settings.kyc.status,
                  reasons: settings.kyc.reasons,
                },
                contact: {
                  phone: settings.contact.phone,
                  telegram: settings.contact.telegram,
                },
                payment: {
                  wallet: settings.payment.wallet,
                  pix: settings.payment.pix,
                },
              },
            },
          }),
          onStepFinish: async (step) => {
            console.log(step)

            if (step.text) {
              await bot.send({
                provider: ctx.provider,
                channel: ctx.channel.id,
                content: {
                  type: 'text',
                  content: step.text,
                },
              })
            }
          },
          tools: {
            update_profile: tool({
              description:
                'Update the user profile data, such as PIX key or wallet address. Use to change payment information.',
              parameters: z.object({
                pix: z.string().optional(),
                wallet: z.string().optional(),
              }),
              execute: async ({ pix, wallet }) => {
                try {
                  const updatedUser = await tryCatch(
                    modules.usecases.user.updateUser.execute(user.id, {
                      settings: {
                        payment: {
                          ...(pix ? { pix } : {}),
                          ...(wallet ? { wallet } : {}),
                        },
                      },
                    }),
                  )
                  return updatedUser
                } catch (error: any) {
                  return {
                    status: 'error',
                    error: error?.message || 'Erro ao atualizar perfil.',
                  }
                }
              },
            }),
            list_deposits: tool({
              description:
                'List the user deposit transactions (DEPOSIT), optionally filtered by status. Use to show deposit history.',
              parameters: z.object({
                status: z
                  .enum([
                    'PENDING_DEPOSIT',
                    'PENDING_EXCHANGE',
                    'PENDING_PAYMENT',
                    'COMPLETED',
                    'EXPIRED',
                  ])
                  .optional(),
              }),
              execute: async ({ status }) => {
                try {
                  const deposits = await tryCatch(
                    db.transaction.findMany({
                      where: {
                        userId: user.id,
                        type: 'DEPOSIT',
                        ...(status ? { status } : {}),
                      },
                      orderBy: {
                        createdAt: 'desc',
                      },
                      take: 20,
                    }),
                  )
                  return deposits
                } catch (error: any) {
                  return {
                    status: 'error',
                    error: error?.message || 'Erro ao listar depósitos.',
                  }
                }
              },
            }),
            list_withdrawals: tool({
              description:
                'List the user withdrawal transactions (WITHDRAW), optionally filtered by status. Use to show withdrawal history.',
              parameters: z.object({
                status: z
                  .enum([
                    'PENDING_DEPOSIT',
                    'PENDING_EXCHANGE',
                    'PENDING_PAYMENT',
                    'COMPLETED',
                    'EXPIRED',
                  ])
                  .optional(),
              }),
              execute: async ({ status }) => {
                try {
                  const withdrawals = await tryCatch(
                    db.transaction.findMany({
                      where: {
                        userId: user.id,
                        type: 'WITHDRAW',
                        ...(status ? { status } : {}),
                      },
                      orderBy: {
                        createdAt: 'desc',
                      },
                      take: 20,
                    }),
                  )
                  return withdrawals
                } catch (error: any) {
                  return {
                    status: 'error',
                    error: error?.message || 'Erro ao listar saques.',
                  }
                }
              },
            }),
            crate_estimate: tool({
              description:
                'Generate an estimate for buying or selling ADA. Use to show the user the current quote, fees, and validity.',
              parameters: z.object({
                type: z.enum(['DEPOSIT', 'WITHDRAW']),
                in: z.enum(['ada', 'brl']),
                amount: z.number(),
              }),
              execute: async ({ type, amount }) => {
                try {
                  const types = {
                    DEPOSIT: 'buy',
                    WITHDRAW: 'sell',
                  } as const

                  const estimate = await tryCatch(
                    modules.usecases.transaction.estimateTransaction.execute({
                      type: types[type],
                      amount,
                    }),
                  )

                  return estimate
                } catch (error: any) {
                  return {
                    status: 'error',
                    error: error?.message || 'Erro ao gerar estimativa.',
                  }
                }
              },
            }),
            create_transaction: tool({
              description:
                'Create a new transaction for the user (buy or sell). Use to initiate a deposit or withdrawal operation.',
              parameters: z.object({
                type: z.enum(['DEPOSIT', 'WITHDRAW']),
                amount: z
                  .number()
                  .describe(
                    'In WITHDRAW amout is in ADA and in DEPOSIT is BRL',
                  ),
                address: z
                  .string()
                  .optional()
                  .describe(
                    'Withdraw needs a PIX Address. Deposit, a Wallet Address. If user, pass a QR Code, pass here PIX Code for WITHDRAW.',
                  ),
              }),
              execute: async ({ type, amount, address }) => {
                try {
                  const types = {
                    DEPOSIT: 'buy',
                    WITHDRAW: 'sell',
                  } as const

                  const transaction = await tryCatch(
                    modules.usecases.transaction.createTransaction.execute({
                      userId: user.id,
                      type: types[type],
                      amount,
                      address: address || settings.payment.wallet,
                    }),
                  )

                  console.log(transaction)

                  return transaction
                } catch (error: any) {
                  return {
                    status: 'error',
                    error: error?.message || 'Erro ao criar transação.',
                  }
                }
              },
            }),
            get_pix_from_qr_code_image: tool({
              description:
                'Extract PIX information from a QR Code image sent by the user. Use only for images.',
              parameters: z.object({
                url: z.string(),
              }),
              execute: async ({ url }) => {
                try {
                  if (ctx.message.content.type !== 'image') {
                    return {
                      status: 'error',
                      error: 'No image content found.',
                    }
                  }
                  const file = ctx.message.content.file
                  const code = await readPixFromQrCodeFile(file)
                  if (!code) {
                    return {
                      status: 'error',
                      error: 'QR Code não encontrado ou inválido.',
                    }
                  }

                  return {
                    status: 'success',
                    data: {
                      code,
                    },
                  }
                } catch (error: any) {
                  return {
                    status: 'error',
                    error: error?.message || 'Erro ao extrair QR Code.',
                  }
                }
              },
            }),
            get_latest_news: tool({
              description:
                'Fetch the latest news from the Cardano ecosystem. Use to keep the user informed about Cardano updates.',
              parameters: z.object({
                count: z.number().optional(),
              }),
              execute: async ({ count }) => {
                try {
                  const response = await tryCatch(
                    fetch(`https://admin.cardanofeed.com/api/articles`),
                  )

                  if (!response.data) {
                    return {
                      status: 'error',
                      error: 'Request error',
                    }
                  }

                  console.log(response.data)

                  if (!response.data.ok) {
                    return {
                      status: 'error',
                      error: await response.data.text(),
                    }
                  }

                  const { data, error } = await tryCatch(response.data.json())

                  console.log({
                    error,
                    data,
                  })

                  if (error) {
                    return { status: 'error', error }
                  }

                  return {
                    status: 'success',
                    data: data.data?.map((article: any) => ({
                      name: article.name,
                      excerpt: article.excerpt,
                      views: article.views,
                      url: article.url,
                      publishedAt: article.publishedAt,
                    })),
                  }
                } catch (error: any) {
                  return {
                    status: 'error',
                    error: error?.message || 'Erro ao buscar notícias.',
                  }
                }
              },
            }),
            get_user_wallet_info: tool({
              description:
                'Fetch Cardano wallet information (balance, address details) for a given address or the user profile wallet.',
              parameters: z.object({
                address: z
                  .string()
                  .optional()
                  .describe('Default is user account wallet'),
              }),
              execute: async ({ address }) => {
                try {
                  const apiKey =
                    process.env.BLOCKFROST_API_KEY ||
                    'mainnetzOIdFj09kjP6BFYffZbPu81a51nqGOJI'
                  const wallet = address || settings.payment.wallet

                  console.log({
                    walleto: wallet,
                  })

                  const url = `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${wallet}`

                  const response = await tryCatch(
                    fetch(url, {
                      headers: { project_id: apiKey },
                    }),
                  )

                  if (!response.data) {
                    return {
                      status: 'error',
                      error: 'Request error',
                    }
                  }

                  if (!response.data.ok) {
                    return {
                      status: 'error',
                      error: await response.data.text(),
                    }
                  }

                  const { data, error } = await tryCatch(response.data.json())

                  if (error || !data) {
                    return {
                      status: 'error',
                      error: error || 'Could not fetch wallet info',
                    }
                  }

                  return {
                    status: 'success',
                    data,
                  }
                } catch (error: any) {
                  return {
                    status: 'error',
                    error:
                      error?.message || 'Erro ao buscar informações da wallet.',
                  }
                }
              },
            }),
            get_user_wallet_history: tool({
              description:
                'Fetch recent transactions history for a Cardano wallet. You can specify address, count, and order (asc/desc).',
              parameters: z.object({
                address: z
                  .string()
                  .optional()
                  .describe('Default is user account wallet'),
                count: z.number().optional(),
                order: z.enum(['asc', 'desc']).optional(),
              }),
              execute: async ({ address, count = 5, order = 'desc' }) => {
                try {
                  const apiKey =
                    process.env.BLOCKFROST_API_KEY ||
                    'mainnetzOIdFj09kjP6BFYffZbPu81a51nqGOJI'
                  const wallet = address || settings.payment.wallet

                  const url = `https://cardano-mainnet.blockfrost.io/api/v0/addresses/addr1qxdss76sk230ps7rxh0tq3pdfamdklj8v0dj3qtxy2rsytxthv3hfl8cymvl64w06swulgnmvtdrmu79y8fzmf0nu3ds8mxvvj/transactions?order=${order}&count=${count}`

                  const response = await tryCatch(
                    fetch(url, {
                      headers: { project_id: apiKey },
                    }),
                  )

                  console.log(response.data)

                  if (!response.data) {
                    return {
                      status: 'error',
                      error: 'Request error',
                    }
                  }

                  if (!response.data.ok) {
                    return {
                      status: 'error',
                      error: await response.data.text(),
                    }
                  }

                  const { data, error } = await tryCatch(response.data.json())

                  if (error || !data) {
                    return {
                      status: 'error',
                      error: error || 'Could not fetch wallet transactions',
                    }
                  }

                  return {
                    status: 'success',
                    data,
                  }
                } catch (error: any) {
                  return {
                    status: 'error',
                    error:
                      error?.message || 'Erro ao buscar transações da wallet.',
                  }
                }
              },
            }),
          },
          experimental_repairToolCall: async ({
            error, // either NoSuchToolError or InvalidToolArgumentsError
            toolCall, // flawed tool call generated by the LLM
            tools, // available tools
            parameterSchema, // helper to access json schema of tool call
            messages, // messages & system prompt that triggered the step
          }) => {
            // do not attempt to fix invalid tool names:
            if (NoSuchToolError.isInstance(error)) return null

            console.error(error)

            // example: use a model with structured outputs for repair:
            const tool = tools[toolCall.toolName as keyof typeof tools]

            const { object: repairedArgs } = await generateObject({
              model,
              schema: tool.parameters as z.ZodObject<any>,
              system: [
                `The model tried to call the tool "${toolCall.toolName}" ` +
                  `with the following arguments: \n` +
                  JSON.stringify(toolCall.args) +
                  `\nThe tool accepts the following schema: \n` +
                  JSON.stringify(parameterSchema(toolCall)) +
                  `\nPlease fix the arguments.`,
                '\nMessages history:\n' + messages,
              ].join('\n'),
            })

            // return the repaired tool call:
            return {
              toolCallId: toolCall.toolCallId,
              toolCallType: toolCall.toolCallType,
              toolName: toolCall.toolName,
              args: JSON.stringify(repairedArgs),
            }
          },
        })

        const [, assistantMessage] = appendResponseMessages({
          messages: [messages[messages.length - 1]],
          responseMessages: response.messages,
        })

        if (assistantMessage) {
          console.log(assistantMessage)

          await db.message.create({
            data: {
              role: assistantMessage.role,
              content: assistantMessage.content,
              userId: user.id,
              attachments: assistantMessage.experimental_attachments as any,
              parts: assistantMessage.parts as any,
            },
          })
        }
      } catch (error) {
        console.error('Error processing message:', error)

        await bot.send({
          provider: ctx.provider,
          channel: ctx.channel.id,
          content: {
            type: 'text',
            content: 'Error processing message',
          },
        })
      }
    },
    start: async () => {
      console.log(`Bot started`)
    },
  },
})
