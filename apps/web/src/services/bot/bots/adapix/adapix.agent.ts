import { Bot } from '../../bot-manager'
import { telegram } from '../../adapters/telegram.adapter'
import { appendResponseMessages, generateText, tool, type Message } from 'ai'
import { db } from '@app/db'
import { UserSettings } from '@app/modules/src/domain/entities/User'
import { getAdapixPrompt } from './adapix.prompt'
import { z } from 'zod'
import { modules } from '@app/modules/src'
import { tryCatch } from '@/helpers/try-catch'
import { randomUUID } from 'node:crypto'
import { whatsapp } from '../../adapters/whatsapp/adapter'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createGroq } from '@ai-sdk/groq'
import { createXai } from '@ai-sdk/xai'
import { readPixFromQrCodeFile } from '../../helpers/read-pix-from-qrcode'
import { getUrl } from '@/helpers/get-url'

function getModel(options?: {
  provider?: string
  modelId?: string
  token?: string
}) {
  const PROVIDER = process.env.GEMINI_PROVIDER || options?.provider
  const MODEL = process.env.GEMINI_MODEL || options?.modelId
  const KEY = process.env.GEMINI_KEY || options.token

  if (!KEY) {
    throw new Error('API key not found')
  }

  if (!MODEL) {
    throw new Error('Model not found')
  }

  if (!PROVIDER) {
    throw new Error('Provider not found')
  }

  switch (PROVIDER) {
    case 'google': {
      const service = createGoogleGenerativeAI({ apiKey: KEY })
      const model = service(MODEL, {
        structuredOutputs: true,
      })

      return model
    }
    case 'xai': {
      const service = createXai({ apiKey: KEY })
      const model = service(MODEL)

      return model
    }
    case 'groq': {
      const service = createGroq({ apiKey: KEY })
      const model = service(MODEL)

      return model
    }

    default:
      throw new Error(`Provider ${PROVIDER} not supported`)
  }
}

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

        const model = getModel({
          provider: 'google',
          token: 'AIzaSyC7jXkCRurNRao6iM2302YJss1jUwP0iBE',
          modelId: 'gemini-2.5-flash-preview-04-17',
        })

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
              content: [
                '👋 Olá! Para utilizar o assistente Adapix, você precisa ter uma conta cadastrada.',
                '',
                'Acesse agora: https://adapix.com.br',
                '',
                'Faça seu cadastro gratuitamente e volte aqui para conversar comigo!',
                '',
                'Se você já tem cadastro, mas ainda não vinculou seu Telegram à sua conta Adapix, siga este passo a passo:',
                '',
                '1️⃣ Acesse https://adapix.com.br e faça login.',
                '2️⃣ Clique na sua foto de perfil no canto superior direito.',
                '3️⃣ Vá em "Configurações".',
                '4️⃣ Procure pela seção "Telegram".',
                '5️⃣ Adicione o seu ID do Telegram e salve.',
                '',
                'Como descobrir seu ID do Telegram:',
                '• Abra o Telegram e procure pelo bot @userinfobot.',
                '• Inicie uma conversa com ele e envie o comando /start.',
                '• O bot irá mostrar seu ID numérico. Copie esse número e cole na sua conta Adapix.',
                '',
                'Depois de cadastrar seu ID do Telegram, volte aqui e envie uma mensagem para começar a usar o assistente!',
              ].join('\n'),
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
              content: [
                '⚠️ Não encontramos as configurações da sua conta.',
                '',
                'Acesse https://adapix.com.br, faça login e complete seu cadastro para usar o assistente.',
              ].join('\n'),
            },
          })

          return
        }

        if (settings.kyc.status !== 'approved') {
          await bot.send({
            provider: ctx.provider,
            channel: ctx.channel.id,
            content: {
              type: 'text',
              content: [
                '⚠️ Seu cadastro não foi aprovado.',
                '',
                'Acesse https://adapix.com.br, faça login e complete seu cadastro para usar o assistente.',
              ].join('\n'),
            },
          })

          return
        }

        const history = await db.message.findMany({
          where: {
            userId: user.id,
            createdAt: {
              // last 24 hours
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
          orderBy: {
            createdAt: 'desc',
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

        const { response, finishReason } = await generateText({
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
            list_transactions: tool({
              description:
                'Lista o histórico de transações do usuário (compras ou vendas de ADA), opcionalmente filtrados por tipo e status. Os resultados são ordenados do mais recente para o mais antigo.',
              parameters: z.object({
                type: z
                  .enum(['DEPOSIT', 'WITHDRAW'])
                  .optional()
                  .describe(
                    'Tipo da transação: "DEPOSIT" para compras/depósitos, "WITHDRAW" para vendas/saques. Se omitido, mostra todos os tipos.',
                  ),
                status: z
                  .enum([
                    'PENDING_DEPOSIT',
                    'PENDING_EXCHANGE',
                    'PENDING_PAYMENT',
                    'COMPLETED',
                    'EXPIRED',
                  ])
                  .optional()
                  .describe(
                    'Status da transação para filtrar os resultados. Se omitido, mostra todas as transações.',
                  ),
              }),
              execute: async ({ type, status }) => {
                try {
                  const transactions = await tryCatch(
                    db.transaction.findMany({
                      where: {
                        userId: user.id,
                        ...(type ? { type } : {}),
                        ...(status ? { status } : {}),
                      },
                      orderBy: {
                        createdAt: 'desc',
                      },
                      take: 20,
                    }),
                  )
                  return transactions
                } catch (error: any) {
                  return {
                    status: 'error',
                    error: error?.message || 'Erro ao listar transações.',
                  }
                }
              },
            }),
            create_transaction: tool({
              description:
                'Cria uma nova transação (compra/depósito ou venda/saque) e envia informações de checkout. Esta ferramenta automaticamente envia a chave PIX ou endereço da carteira para pagamento em uma mensagem separada.',
              parameters: z.object({
                type: z
                  .enum(['buy', 'sell'])
                  .describe(
                    '"buy" para compra de ADA, "sell" para venda de ADA',
                  ),
                amount: z
                  .number()
                  .describe('Valor em BRL (para compra) ou ADA (para venda)'),
                address: z
                  .string()
                  .optional()
                  .describe(
                    'Para compras: Endereço da carteira Cardano para receber ADA. Para vendas: Chave PIX para receber BRL. Se não fornecido, usa o dado registrado do usuário.',
                  ),
              }),
              execute: async ({ type, amount, address }) => {
                try {
                  const transaction = await tryCatch(
                    modules.usecases.transaction.createTransaction.execute({
                      userId: user.id,
                      type,
                      amount,
                      address:
                        address ||
                        (type === 'buy'
                          ? settings.payment.wallet
                          : settings.payment.pix),
                    }),
                  )

                  const isBuy = type === 'buy'

                  // Send checkout info
                  await bot.send({
                    provider: ctx.provider,
                    channel: ctx.channel.id,
                    content: {
                      type: 'text',
                      content: [
                        `🧾 Aqui estão os detalhes para sua ${
                          isBuy ? 'compra' : 'venda'
                        }:`,
                        '',
                        '',
                        `• Tipo: ${isBuy ? 'Compra' : 'Venda'} de ADA`,
                        `• ${isBuy ? 'Valor a pagar' : 'Valor a enviar'}: ${
                          transaction.data.fromAmount
                        } ${transaction.data.fromCurrency}`,
                        `• Você receberá: ${transaction.data.toAmount} ${transaction.data.toCurrency}`,
                        `• Status: ${transaction.data.status}`,
                        transaction.data.expiresAt
                          ? `• Expira em: ${new Date(
                              transaction.data.expiresAt,
                            ).toLocaleString('pt-BR')}`
                          : '',
                        '',
                        'Siga as instruções abaixo para concluir sua transação:',
                        isBuy
                          ? '1️⃣ Realize o pagamento PIX utilizando o código informado na próxima mensagem.'
                          : '1️⃣ Envie o valor em ADA para o endereço Cardano informado na próxima mensagem.',
                        '',
                        '',
                        'Após realizar o pagamento, aguarde a confirmação. Se tiver dúvidas, entre em contato com o suporte.',
                      ]
                        .filter(Boolean)
                        .join('\n'),
                    },
                  })

                  // Send payment address separately
                  await bot.send({
                    provider: ctx.provider,
                    channel: ctx.channel.id,
                    content: {
                      type: 'text',
                      content: isBuy
                        ? transaction.data.paymentAddress
                        : transaction.data.type === 'DEPOSIT'
                        ? transaction.data.paymentAddress
                        : transaction.data.exchangeAddress,
                    },
                  })

                  return {
                    status: 'success',
                    data: {
                      message:
                        'Transaction created successfully and all messages already sent to user with payment data. Only answer if you can help with something.',
                    },
                  }
                } catch (error: any) {
                  return {
                    status: 'error',
                    error:
                      error?.message ||
                      `Erro ao criar transação de ${
                        type === 'buy' ? 'compra' : 'venda'
                      }.`,
                  }
                }
              },
            }),
            get_estimate_transaction: tool({
              description:
                'Gera uma estimativa para compra ou venda de ADA, mostrando o valor aproximado, taxas e validade da cotação. Use esta ferramenta antes de criar qualquer transação.',
              parameters: z.object({
                type: z
                  .enum(['buy', 'sell'])
                  .describe(
                    'Tipo da transação: "buy" para compra, "sell" para venda',
                  ),
                amount: z.number(),
              }),
              execute: async ({ type, amount }) => {
                try {
                  const estimate = await tryCatch(
                    modules.usecases.transaction.estimateTransaction.execute({
                      type: type as 'buy' | 'sell',
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
            // get_address_from_qr_code: tool({
            //   description:
            //     'Extrai informações PIX de uma imagem de QR Code enviada pelo usuário. Esta ferramenta tentará ler o código PIX e retornar os dados contidos nele.',
            //   parameters: z.object({
            //     url: z.string().optional().describe(''),
            //   }),
            //   execute: async () => {
            //     try {
            //       if (ctx.message.content.type !== 'image') {
            //         return {
            //           status: 'error',
            //           error: 'No image content found.',
            //         }
            //       }
            //       const file = ctx.message.content.file
            //       const code = await readPixFromQrCodeFile(file)
            //       if (!code) {
            //         return {
            //           status: 'error',
            //           error: 'QR Code não encontrado ou inválido.',
            //         }
            //       }

            //       return {
            //         status: 'success',
            //         data: {
            //           code,
            //         },
            //       }
            //     } catch (error: any) {
            //       return {
            //         status: 'error',
            //         error: error?.message || 'Erro ao extrair QR Code.',
            //       }
            //     }
            //   },
            // }),
            get_latest_news: tool({
              description:
                'Busca as últimas notícias do ecossistema Cardano. Use para manter o usuário informado sobre atualizações, eventos e desenvolvimentos da rede Cardano.',
              parameters: z.object({
                count: z
                  .number()
                  .optional()
                  .describe('Número de notícias a retornar. Padrão é 5.'),
              }),
              execute: async () => {
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

                  if (!response.data.ok) {
                    return {
                      status: 'error',
                      error: await response.data.text(),
                    }
                  }

                  const { data, error } = await tryCatch(response.data.json())

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
            get_wallet: tool({
              description:
                'Busca informações da carteira Cardano incluindo saldo, detalhes do endereço e histórico de transações. Fornece uma visão completa do status da carteira.',
              parameters: z.object({
                address: z
                  .string()
                  .optional()
                  .describe(
                    'Endereço da carteira Cardano. Se não fornecido, usa a carteira registrada do usuário.',
                  ),
                count: z
                  .number()
                  .default(10)
                  .optional()
                  .describe(
                    'Número de transações a retornar no histórico. Padrão é 10.',
                  ),
              }),
              execute: async ({ address, count = 10 }) => {
                try {
                  const apiKey =
                    process.env.BLOCKFROST_API_KEY ||
                    'mainnetzOIdFj09kjP6BFYffZbPu81a51nqGOJI'
                  const walletAddress = address || settings.payment.wallet

                  if (!walletAddress) {
                    return {
                      status: 'error',
                      error:
                        'Nenhum endereço de carteira fornecido ou cadastrado.',
                    }
                  }

                  console.log({
                    wallet: walletAddress,
                  })

                  let walletDataFromApi: any = {
                    address: walletAddress,
                    amount: [],
                    stake_address: null,
                    type: 'shelley',
                    script: false,
                  }

                  let transactionsData: any[] = []
                  let walletInfoError: string | null = null
                  let txHistoryError: string | null = null
                  let userFriendlyMessage: string | null = null

                  const walletInfoUrl = `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${walletAddress}`
                  const walletInfoResponse = await tryCatch(
                    fetch(walletInfoUrl, {
                      headers: { project_id: apiKey },
                      cache: 'no-store',
                      next: {
                        revalidate: 0,
                      },
                    }),
                  )

                  if (!walletInfoResponse.data) {
                    return {
                      status: 'error',
                      error: 'Request error when fetching wallet info',
                    }
                  }

                  if (!walletInfoResponse.data.ok) {
                    return {
                      status: 'error',
                      error: await walletInfoResponse.data.text(),
                    }
                  }

                  if (walletInfoResponse.data && walletInfoResponse.data.ok) {
                    const { data, error } = await tryCatch(
                      walletInfoResponse.data.json(),
                    )
                    if (data && !error) {
                      walletDataFromApi = data
                    } else {
                      walletInfoError =
                        error?.message || 'Erro ao processar dados da carteira.'
                    }
                  } else if (
                    walletInfoResponse.data &&
                    walletInfoResponse.data.status === 404
                  ) {
                    userFriendlyMessage =
                      'Esta carteira é nova ou ainda não possui transações. O saldo é 0 ADA.'
                    return {
                      status: 'success',
                      data: {
                        wallet: walletDataFromApi,
                        transactions: [],
                        message: userFriendlyMessage,
                      },
                    }
                  } else {
                    walletInfoError =
                      walletInfoResponse.error?.message ||
                      (walletInfoResponse.data
                        ? await walletInfoResponse.data.text()
                        : 'Erro ao buscar informações da carteira.')
                    return {
                      status: 'error',
                      error: walletInfoError,
                    }
                  }

                  // Fetch transaction history
                  const txUrl = `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${walletAddress}/transactions?order=desc&count=${count}`
                  const txResponse = await tryCatch(
                    fetch(txUrl, {
                      headers: { project_id: apiKey },
                      cache: 'no-store',
                      next: {
                        revalidate: 0,
                      },
                    }),
                  )

                  if (!txResponse.data) {
                    return {
                      status: 'success',
                      data: {
                        wallet: walletDataFromApi,
                        transactions: [],
                        error_transactions:
                          'Request error when fetching transactions',
                      },
                    }
                  }

                  if (txResponse.data && txResponse.data.ok) {
                    const { data: txData, error: txJsonError } = await tryCatch(
                      txResponse.data.json(),
                    )
                    if (txData && !txJsonError) {
                      transactionsData = txData
                    } else {
                      txHistoryError =
                        txJsonError?.message ||
                        'Erro ao processar histórico de transações.'
                    }
                  } else if (
                    txResponse.data &&
                    txResponse.data.status === 404
                  ) {
                    txHistoryError =
                      'Histórico de transações não encontrado (404).'
                    transactionsData = []
                  } else {
                    txHistoryError =
                      txResponse.error?.message ||
                      (txResponse.data
                        ? await txResponse.data.text()
                        : 'Erro ao buscar histórico de transações.')
                  }

                  // Return combined data
                  return {
                    status: 'success',
                    data: {
                      wallet: walletDataFromApi,
                      transactions: transactionsData,
                      error_wallet_info: walletInfoError,
                      error_transactions: txHistoryError,
                      message: userFriendlyMessage,
                    },
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
          },
        })

        if (finishReason === 'error') {
          console.error('response', response)
          console.error('response.body', response.body)

          await bot.send({
            provider: ctx.provider,
            channel: ctx.channel.id,
            content: {
              type: 'text',
              content: [
                `⚠️ Ops! ${
                  user.name.split(' ')[0]
                }, ocorreu um erro. Por favor, tente novamente mais tarde, o suporte já foi avisado`,
              ].join('\n'),
            },
          })

          return
        }

        const [, assistantMessage] = appendResponseMessages({
          messages: [messages[messages.length - 1]],
          responseMessages: response.messages,
        })

        if (assistantMessage) {
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
