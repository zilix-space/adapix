import { bot } from '@/services/bot/bots/adapix/adapix.agent'
import type { NextRequest } from 'next/server'

export const POST = async (request: NextRequest) => {
  await bot.handle('telegram', request)

  console.log('Request received for Telegram bot')
  return new Response('OK', { status: 200 })
}
