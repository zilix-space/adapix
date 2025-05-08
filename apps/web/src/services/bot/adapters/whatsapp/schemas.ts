import { z } from "zod";

/**
 * Schema for WhatsApp Adapter configuration parameters.
 * - token: WhatsApp API access token (required).
 * - phone: WhatsApp phone number ID (required).
 */
export const WhatsAppAdapterParams = z.object({
  token: z.string().min(1, "WhatsApp API Token is required."),
  phone: z.string().min(1, "Phone is required."),
});

/**
 * Schema for WhatsApp contact information.
 * - wa_id: WhatsApp user ID.
 * - profile: Optional profile object containing the user's name.
 */
export const WhatsAppContactSchema = z.object({
  wa_id: z.string(),
  profile: z.object({
    name: z.string().optional(),
  }).optional(),
});

/**
 * Schema for WhatsApp message object.
 * - id: Message ID.
 * - from: Sender's WhatsApp ID.
 * - type: Message type ('text', 'image', 'document', 'audio').
 * - text: Optional text content.
 * - image: Optional image file.
 * - document: Optional document file.
 * - audio: Optional audio file.
 * - timestamp: Message timestamp.
 */
export const WhatsAppMessageSchema = z.object({
  id: z.string(),
  from: z.string(),
  type: z.enum(['text', 'image', 'document', 'audio']),
  text: z.object({ body: z.string() }).optional(),
  image: z.custom<File>().optional(),
  document: z.custom<File>().optional(),
  audio: z.custom<File>().optional(),
  timestamp: z.string(),
});

/**
 * Schema for WhatsApp webhook payload value.
 * - messaging_product: Messaging product name.
 * - metadata: Optional metadata (display phone number, phone number ID).
 * - contacts: Optional array of contact objects.
 * - messages: Optional array of message objects.
 */
export const WhatsAppWebhookValueSchema = z.object({
  messaging_product: z.string(),
  metadata: z.object({
    display_phone_number: z.string().optional(),
    phone_number_id: z.string().optional(),
  }).optional(),
  contacts: z.array(WhatsAppContactSchema).optional(),
  messages: z.array(WhatsAppMessageSchema).optional(),
});

/**
 * Schema for WhatsApp webhook payload.
 * - field: Event field name.
 * - value: Webhook value object.
 */
export const WhatsAppWebhookSchema = z.object({
  field: z.string(),
  value: WhatsAppWebhookValueSchema,
});