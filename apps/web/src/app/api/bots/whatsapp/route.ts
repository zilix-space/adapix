import { bot } from '@/services/bot/bots/adapix/adapix.agent'
import type { NextRequest } from 'next/server'

export const GET = async (request: NextRequest) => {
  console.log('[GET] Received WhatsApp webhook verification request')

  const mode = request.nextUrl.searchParams.get('hub.mode')
  console.log('[GET] hub.mode:', mode)

  const challenge = request.nextUrl.searchParams.get('hub.challenge')
  console.log('[GET] hub.challenge:', challenge)

  const token = request.nextUrl.searchParams.get('hub.verify_token')
  console.log('[GET] hub.verify_token:', token)

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'cfd55193-01cc-4722-811c-315948a3a110'
  console.log('[GET] expectedToken:', expectedToken)

  if (mode !== 'subscribe' || token !== expectedToken) {
    console.error('[GET] Verification failed. Invalid token or mode.')
    return new Response('Forbidden', { status: 403 })
  }

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('[GET] Webhook verified successfully.')

    return new Response(challenge, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  console.error('[GET] Verification failed. Invalid token or mode.')
  return new Response('Forbidden', { status: 403 })
}

export const POST = async (request: NextRequest) => {
  console.log('[POST] Received WhatsApp webhook event')

  console.log('[POST] Calling bot.handle for WhatsApp')
  await bot.handle('whatsapp', request)

  console.log('[POST] Request processed for WhatsApp bot')
  return new Response('OK', { status: 200 })
}
