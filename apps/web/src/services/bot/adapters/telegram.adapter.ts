import { z } from "zod"
import { Bot } from "../bot-manager"
import { tryCatch } from "@/helpers/try-catch"
import type { BotAudioContent, BotCommandContent, BotDocumentContent, BotImageContent, BotTextContent } from "../bot.types"

// Define parameter schema with stricter types where possible
const TelegramAdapterParams = z.object({
  token: z.string().min(1, "Telegram Bot Token is required."),
  webhook: z
    .object({
      url: z.string().url("Webhook URL must be a valid URL.").optional(),
      secret: z.string().min(1).max(100).optional(),
    })
    .optional(), // Make webhook optional for polling or manual setup
})

// Define the structure of a Telegram Update (expandido)
const TelegramUpdateSchema = z.object({
  update_id: z.number(),
  message: z
    .object({
      message_id: z.number(),
      from: z.object({
        id: z.number(),
        is_bot: z.boolean(),
        first_name: z.string(),
        last_name: z.string().optional(),
        username: z.string().optional(),
        language_code: z.string().optional(),
      }),
      chat: z.object({
        id: z.number(),
        first_name: z.string().optional(), // For private chats
        last_name: z.string().optional(), // For private chats
        username: z.string().optional(), // For private chats
        title: z.string().optional(), // For group/channel chats
        type: z.enum(['private', 'group', 'supergroup', 'channel']),
      }),
      date: z.number(),
      text: z.string().optional(),
      photo: z.array(z.object({
        file_id: z.string(),
        file_unique_id: z.string(),
        file_size: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      })).optional(),
      document: z.object({
        file_id: z.string(),
        file_unique_id: z.string(),
        file_name: z.string().optional(),
        mime_type: z.string().optional(),
        file_size: z.number().optional(),
      }).optional(),
      audio: z.object({
        file_id: z.string(),
        file_unique_id: z.string(),
        duration: z.number().optional(),
        mime_type: z.string().optional(),
        file_size: z.number().optional(),
        file_name: z.string().optional(),
      }).optional(),
      voice: z.object({
        file_id: z.string(),
        file_unique_id: z.string(),
        duration: z.number().optional(),
        mime_type: z.string().optional(),
        file_size: z.number().optional(),
      }).optional(),
      caption: z.string().optional(),
    })
    .optional(),
  // Add other update types like callback_query, inline_query etc. if needed
})

const getServiceURL = (token: string, url?: string) => `https://api.telegram.org/bot${token}${url}`;

/**
 * Faz o parse do texto da mensagem do Telegram para o formato BotContent.
 * Se for comando (começa com /), retorna BotCommandContent<any>.
 * Caso contrário, retorna BotTextContent.
 */
function parseTelegramMessageContent(text: string): BotTextContent | BotCommandContent | undefined {
  if (!text) return undefined
  if (text.startsWith('/')) {
    const [commandWithSlash, ...args] = text.trim().split(' ')
    const command = commandWithSlash.slice(1)
    return {
      type: 'command',
      command,
      params: args,
      raw: text,
    }
  }
  return {
    type: 'text',
    content: text,
    raw: text,
  }
}

// Função utilitária para baixar arquivos do Telegram
async function fetchTelegramFile(fileId: string, token: string) {
  // 1. Get file path
  const res = await fetch(getServiceURL(token, `/getFile?file_id=${fileId}`));
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error('Failed to get Telegram file path');
  const filePath = data.result.file_path;
  // 2. Download file
  const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
  const fileRes = await fetch(fileUrl);
  if (!fileRes.ok) throw new Error('Failed to download Telegram file');
  const arrayBuffer = await fileRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  const mimeType = fileRes.headers.get('content-type') || 'application/octet-stream';
  return { base64, mimeType, fileName: filePath.split('/').pop() };
}

// Função para inferir mimeType a partir da extensão
function guessMimeType(fileName: string): string {
  if (!fileName) return 'application/octet-stream';
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'bmp':
      return 'image/bmp';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

// Função utilitária para baixar arquivos do Telegram e criar File
async function fetchTelegramFileAsFile(fileId: string, token: string, fileName?: string, mimeType?: string, forceJpeg = false) {
  const res = await fetch(getServiceURL(token, `/getFile?file_id=${fileId}`));
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error('Failed to get Telegram file path');
  const filePath = data.result.file_path;
  const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
  const fileRes = await fetch(fileUrl);
  if (!fileRes.ok) throw new Error('Failed to download Telegram file');
  const arrayBuffer = await fileRes.arrayBuffer();
  const name = fileName || filePath.split('/').pop() || 'file';
  let type = mimeType || fileRes.headers.get('content-type') || '';
  if (forceJpeg) {
    type = 'image/jpeg';
  } else if (!type || type === 'application/octet-stream') {
    type = guessMimeType(name);
  }
  // @ts-ignore: File constructor exists in Node >= 20 e browsers
  const file = new File([arrayBuffer], name, { type });
  return { file, base64: Buffer.from(arrayBuffer).toString('base64'), mimeType: type, fileName: name };
}

export const telegram = Bot.adapter({
    name: 'telegram',
    parameters: TelegramAdapterParams, // Use the specific schema
    init: async ({ config, commands }) => {
      // Setup webhook if URL is provided
      if (config.webhook?.url) {
        try {
          const body: { url: string; secret_token?: string } = {
            url: config.webhook.url
          };

          if (config.webhook.secret) {
            body.secret_token = config.webhook.secret;
          }

          // Delete existing webhook if needed
          console.log('[TelegramAdapter] Deleting existing webhook...');
          const deleteWebhookRes = await fetch(getServiceURL(config.token, '/deleteWebhook'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          });

          const deleteWebhookJson = await deleteWebhookRes.json();
          console.log('[TelegramAdapter] deleteWebhook response:', deleteWebhookJson);

          // Set bot commands
          const commandsPayload = {
            commands: commands.map(cmd => ({
              command: cmd.name,
              description: cmd.description,
            })),
            scope: {
              type: 'all_group_chats',
            },
          };

          console.log('[TelegramAdapter] Setting bot commands:', JSON.stringify(commandsPayload));
          await fetch(getServiceURL(config.token, '/deleteMyCommands'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          });

          const setCommandsRes = await fetch(getServiceURL(config.token, '/setMyCommands'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commandsPayload),
          });
          const setCommandsJson = await setCommandsRes.json();
          console.log('[TelegramAdapter] setMyCommands response:', setCommandsJson);

          // Set webhook
          console.log('[TelegramAdapter] Setting webhook with body:', JSON.stringify(body));
          const response = await fetch(getServiceURL(config.token, '/setWebhook'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          const result = await response.json();
          console.log('[TelegramAdapter] setWebhook response:', result);

          if (!response.ok || !result.ok) {
            console.error('[TelegramAdapter] Failed to set Telegram webhook:', result);
            throw new Error(`Failed to set Telegram webhook: ${result.description || response.statusText}`);
          }

          console.log('[TelegramAdapter] Telegram webhook set successfully:', result);
        } catch (error) {
          console.error('[TelegramAdapter] Error setting up Telegram webhook:', error);
          throw error; // Re-throw to signal failed initialization
        }
      } else {
        console.log('Telegram adapter initialized without setting webhook (URL not provided).');
        // Optionally delete any existing webhook
        // await fetch(`${telegramApiUrl}/deleteWebhook`);
      }
    },
    send: async (params) => {
      const apiUrl = getServiceURL(params.config.token, '/sendMessage');

      try {
        function escapeMarkdownV2(text: string) {
          // Escapa todos os caracteres especiais do MarkdownV2
          return text.replace(/([_\*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
        }

        // Escapa o texto antes de enviar
        const safeText = escapeMarkdownV2(params.content.content);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: params.channel,
            text: safeText,
            parse_mode: 'MarkdownV2', // Usa MarkdownV2 para máxima compatibilidade
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.ok) {
           console.error("Failed to send Telegram message:", result);
           throw new Error(`Telegram API error: ${result.description || response.statusText}`);
        }

        console.log("Telegram message sent successfully.");
      } catch (error) {
        console.error("Error sending message via Telegram:", error);
        throw error;
      }
    },
    handle: async ({ request, config }) => {
      console.log('Handling Telegram webhook event...');

      // 1. Verify Secret Token (if configured)
      if (config.webhook?.secret) {
          const secretTokenHeader = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
          if (secretTokenHeader !== config.webhook.secret) {
              console.error("Invalid Telegram secret token received.");

              // Throw or return an appropriate error response. For simplicity, throwing.
              throw new Error("Unauthorized: Invalid secret token.");
          }
      }

      // 2. Parse Request Body
      const updateData = await tryCatch(request.json());

      console.log(updateData.data.message)

      // 3. Validate Telegram Update Structure
      const parsedUpdate = TelegramUpdateSchema.safeParse(updateData.data);

      if (!parsedUpdate.success) {
          console.error("Invalid Telegram update structure:", parsedUpdate.error.errors);
          throw new Error(`Invalid Telegram update structure: ${parsedUpdate.error.message}`);
      }

      const update = parsedUpdate.data;
      const attachments = [];
      let content;

      if (update.message) {
        const msg = update.message;
        const author = msg.from;
        const chat = msg.chat;

        // TEXT
        if (msg.text) {
          content = parseTelegramMessageContent(msg.text);
        }
        // PHOTO
        else if (msg.photo && msg.photo.length > 0) {
          const photo = msg.photo[msg.photo.length - 1];
          const { file, base64, mimeType, fileName } = await fetchTelegramFileAsFile(photo.file_id, config.token, undefined, undefined, true);
          attachments.push({ name: fileName, type: mimeType, content: base64 });
          content = {
            type: 'image',
            content: base64,
            file,
            caption: msg.caption,
          } as BotImageContent;
        }
        // DOCUMENT
        else if (msg.document) {
          const { file, base64, mimeType, fileName } = await fetchTelegramFileAsFile(msg.document.file_id, config.token, msg.document.file_name, msg.document.mime_type);
          attachments.push({ name: fileName, type: mimeType, content: base64 });
          content = {
            type: 'document',
            content: base64,
            file,
          } as BotDocumentContent;
        }
        // AUDIO
        else if (msg.audio) {
          const { file, base64, mimeType, fileName } = await fetchTelegramFileAsFile(msg.audio.file_id, config.token, msg.audio.file_name, msg.audio.mime_type);
          attachments.push({ name: fileName, type: mimeType, content: base64 });
          content = {
            type: 'audio',
            content: base64,
            file,
          } as BotAudioContent;
        }
        // VOICE (mensagem de voz)
        else if (msg.voice) {
          const { file, base64, mimeType, fileName } = await fetchTelegramFileAsFile(msg.voice.file_id, config.token, undefined, msg.voice.mime_type);
          attachments.push({ name: fileName, type: mimeType, content: base64 });
          content = {
            type: 'audio',
            content: base64,
            file,
          } as BotAudioContent;
        }

        if (content) {
          return {
            event: 'message',
            provider: 'telegram',
            channel: {
              id: String(chat.id),
              name: chat.title || chat.first_name || String(chat.id)
            },
            message: {
              content,
              attachments,
              author: {
                id: String(author.id),
                name: `${author.first_name}${author.last_name ? ` ${author.last_name}` : ''}`,
                username: author.username || 'unknown',
              },
            },
          };
        }
      }

      // Handle other update types (callback_query, inline_query, etc.) or ignore them
      console.log("Received Telegram update type not handled:", Object.keys(update));
      // You might throw an error or return a specific context indicating an unhandled event
      throw new Error("Unhandled Telegram update type received.");
    },
})
