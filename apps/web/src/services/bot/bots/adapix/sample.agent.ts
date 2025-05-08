import { telegram } from '../../adapters/telegram.adapter'
import { whatsapp } from '../../adapters/whatsapp'
import { Bot } from '../../bot-manager'

// Middleware de exemplo para logging
const loggerMiddleware = async (ctx: any, next: () => Promise<void>) => {
  console.log('Nova mensagem recebida:', ctx.message)
  await next()
}

// Criação do bot
export const sampleBot = Bot.create({
  id: 'sample-bot',
  name: 'Bot de Exemplo',
  
  // Configuração dos adaptadores
  adapters: {
    telegram: telegram({
      token: 'sua-api-key-aqui',
      webhook: {
        url: 'https://seu-webhook-url.com',
      }
    }),
    whatsapp: whatsapp({
      token: 'sua-api',
      phone: 'seu-whatsapp-id',
    })
  },
  
  // Lista de middlewares
  middlewares: [loggerMiddleware],
  
  // Comandos disponíveis
  commands: {
    ping: {
      name: 'ping',
      description: 'Responde com pong',
      help: 'ping',
      aliases: ['p'],
      async handle(ctx) {
        await ctx.bot.send({
          provider: ctx.provider,
          channel: ctx.channel.id,
          content: {
            type: 'text',
            content: 'pong! 🏓'
          }
        })
      }
    }
  },
  
  // Eventos do bot
  on: {
    message: async (ctx) => {
      console.log('Mensagem recebida:', ctx.message)
      
      await ctx.bot.send({
        provider: ctx.provider,
        channel: ctx.channel.id,
        content: {
          type: 'text',
          content: `Você disse: ${ctx.message.content.type === 'text' && ctx.message.content.raw}`
        }
      })
    },
    error: async (ctx) => {
      console.error('Erro no bot:', ctx)
    }
  }
})
