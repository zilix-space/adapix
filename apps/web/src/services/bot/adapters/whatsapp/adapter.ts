import type { BotAttachmentContent, BotContent } from "../../bot.types"
import { z } from "zod"
import { Bot } from "../../bot-manager"
import { tryCatch } from "@/helpers/try-catch"
import { parsers } from "./parsers"
import { WhatsAppAdapterParams, type WhatsAppWebhookSchema } from "./schemas"

/**
 * WhatsApp adapter for the Bot framework.
 *
 * This adapter integrates WhatsApp messaging capabilities using the Facebook Graph API.
 * It provides methods for initializing the adapter, sending messages, and handling incoming webhook events.
 *
 * @remarks
 * - The `init` method is a no-op, as webhook setup is handled manually.
 * - The `send` method sends a text message to a WhatsApp recipient using the provided API token and phone number.
 * - The `handle` method processes incoming webhook requests, parses the message, and returns a normalized event object.
 *
 * @example
 * ```typescript
 * // Sending a message
 * await whatsapp.send({
 *   config: { token: 'YOUR_TOKEN', phone: 'PHONE_ID' },
 *   channel: 'RECIPIENT_PHONE',
 *   content: { content: 'Hello, world!' }
 * });
 * ```
 *
 * @property {string} name - The name of the adapter ("whatsapp").
 * @property {typeof WhatsAppAdapterParams} parameters - The parameters schema for adapter configuration.
 * @property {() => Promise<void>} init - Initializes the adapter (no operation).
 * @property {(params: { config: { token: string, phone: string }, channel: string, content: { content: string } }) => Promise<void>} send
 *   Sends a message to a WhatsApp recipient using the Facebook Graph API.
 *   Throws an error if the request fails.
 * @property {(args: { request: Request, config: { token: string } }) => Promise<BotEvent | undefined>} handle
 *   Handles incoming webhook requests from WhatsApp, parses the message, and returns a normalized event object.
 */
export const whatsapp = Bot.adapter({
  name: 'whatsapp',
  parameters: WhatsAppAdapterParams,
  init: async () => {}, // Noop, webhook manual
  send: async (params) => {
    const { token, phone } = params.config
    
    const apiUrl = ` https://graph.facebook.com/v22.0/${phone}/messages`

    const body = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: params.channel,
      type: "text",
      text: { body: params.content.content },
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        console.error("Erro ao enviar mensagem WhatsApp:", result)
        throw new Error(result.error?.message || response.statusText)
      }
      // Sucesso
    } catch (error) {
      console.error("Erro no envio WhatsApp:", error)
      throw error
    }
  },
  handle: async ({ request, config }) => {
    const updateData = await tryCatch(request.json())
    const parsed = updateData.data.entry[0].changes[0] as z.infer<typeof WhatsAppWebhookSchema>
    const value = parsed.value
    const message = value.messages?.[0]
    const attachments: BotAttachmentContent[] = []
    
    if (!message) return

    const authorId = message.from
    const authorName = value.contacts?.[0]?.profile?.name || authorId
    const channelId = parsed.value.contacts[0].wa_id

    let content: BotContent | undefined
    switch (message.type) {
      case 'text':
        content = parsers.text(message)
        break
      case 'image':
      case 'document':
      case 'audio':
        content = await parsers.media(message, config.token, attachments)
        break
      default:
        content = undefined
    }

    return {
      event: 'message',
      provider: 'whatsapp',
      channel: {
        id: channelId,
        name: value.metadata?.display_phone_number || channelId,
      },
      message: {
        content,
        attachments,
        author: {
          id: authorId,
          name: authorName,
          username: authorId,
        },
      },
    }
  },
})
