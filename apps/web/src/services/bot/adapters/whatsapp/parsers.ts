import type { 
  BotAttachmentContent, 
  BotAudioContent, 
  BotCommandContent, 
  BotContent, 
  BotDocumentContent, 
  BotImageContent, 
  BotTextContent 
} from "../../bot.types"

export const parsers = {
  /**
   * Parses a WhatsApp message object and returns either a BotTextContent or BotCommandContent.
   * @param message The WhatsApp message object.
   * @returns The parsed text or command content, or undefined if not applicable.
   */
  text(message: any): BotTextContent | BotCommandContent | undefined {
    /**
     * Parses the text string and determines if it is a command or plain text.
     * @param text The message text.
     * @returns The parsed content object.
     */
    function parseWhatsAppMessageContent(text: string): BotTextContent | BotCommandContent | undefined {
      if (!text) return undefined;
      if (text.startsWith('/')) {
        const [commandWithSlash, ...args] = text.trim().split(' ');
        const command = commandWithSlash.slice(1);
        return {
          type: 'command',
          command,
          params: args,
          raw: text,
        };
      }
      return {
        type: 'text',
        content: text,
        raw: text,
      };
    }

    if (message?.text?.body) {
      return parseWhatsAppMessageContent(message.text.body);
    }
    return undefined;
  },

  /**
   * Parses WhatsApp media messages (image, document, audio) and returns the appropriate BotContent.
   * Also adds the media as an attachment.
   * @param message The WhatsApp message object.
   * @param token The WhatsApp API access token.
   * @param attachments The array to which the attachment will be pushed.
   * @returns The parsed media content or undefined if not applicable.
   */
  async media(
    message: any,
    token: string,
    attachments: BotAttachmentContent[]
  ): Promise<BotImageContent | BotDocumentContent | BotAudioContent | undefined> {
    /**
     * Fetches WhatsApp media file and returns its base64, mime type, and File object.
     * @param mediaId The media ID from WhatsApp.
     * @param token The WhatsApp API access token.
     * @returns An object containing base64, mimeType, and file.
     */
    async function fetchWhatsAppMedia(mediaId: string, token: string): Promise<{ base64: string, mimeType: string, file: File }> {
      const mediaUrlRes = await fetch(
        `https://graph.facebook.com/v17.0/${mediaId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
      const mediaUrlData = await mediaUrlRes.json();
      if (!mediaUrlRes.ok || !mediaUrlData.url) {
        throw new Error("Failed to fetch WhatsApp media URL");
      }
      const mediaRes = await fetch(mediaUrlData.url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!mediaRes.ok) {
        throw new Error("Failed to download WhatsApp media file");
      }

      const arrayBuffer = await mediaRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const mimeType = mediaRes.headers.get('content-type') || 'application/octet-stream';
      const fileName = mediaId;

      let file: File;
      try {
        file = new File([arrayBuffer], fileName, { type: mimeType });
      } catch {
        file = { name: fileName, type: mimeType, size: buffer.length } as any;
      }

      return { base64, mimeType, file };
    }

    let mediaType: 'image' | 'document' | 'audio' | undefined;
    let mediaObj: any;
    let caption: string | undefined;

    if (message?.image && typeof message.image === 'object' && 'id' in message.image) {
      mediaType = 'image';
      mediaObj = message.image;
      caption = message.image.caption;
    } else if (message?.document && typeof message.document === 'object' && 'id' in message.document) {
      mediaType = 'document';
      mediaObj = message.document;
    } else if (message?.audio && typeof message.audio === 'object' && 'id' in message.audio) {
      mediaType = 'audio';
      mediaObj = message.audio;
    }

    if (!mediaType || !mediaObj) return undefined;

    const mediaId = mediaObj.id;
    const media = await fetchWhatsAppMedia(mediaId, token);

    attachments.push({ 
      name: mediaId, 
      type: media.mimeType, 
      content: media.base64 
    });

    if (mediaType === 'image') {
      return {
        type: 'image',
        content: media.base64,
        file: media.file,
        caption,
      };
    }
    if (mediaType === 'document') {
      return {
        type: 'document',
        content: media.base64,
        file: media.file,
      };
    }
    if (mediaType === 'audio') {
      return {
        type: 'audio',
        content: media.base64,
        file: media.file,
      };
    }

    return undefined;
  }
};