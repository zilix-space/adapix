import type { TypeOf, ZodObject } from 'zod'
import {
  BotEvent,
  BotAttachmentContent,
  BotTextContent,
  BotCommandContent,
  BotContent,
  BotContext,
  BotCommand,
  BotSendParams,
  BotHandleParams,
  IBotAdapter,
  Middleware
} from './bot.types'
import { Logger } from './logger.interface'

/**
 * Main Bot class for @igniter-js/messaging
 *
 * Supports multiple adapters, middlewares, commands, and custom logger integration.
 * If a logger is provided, it will be used for all relevant methods for traceability and debugging.
 */
export class Bot<
  TAdapters extends Record<string, IBotAdapter<any>>,
  TMiddlewares extends Middleware[],
  TCommands extends Record<string, BotCommand>,
> {
  /** Unique bot identifier */
  public id: string
  /** Bot name */
  public name: string

  private adapters: TAdapters
  private middlewares: TMiddlewares
  private commands: TCommands
  private listeners: Partial<Record<BotEvent, ((ctx: BotContext) => Promise<void>)[]>> = {}
  private logger?: Logger

  /**
   * Creates a new Bot instance.
   * @param config Bot configuration object.
   */
  constructor(config: {
    id: string
    name: string
    adapters: TAdapters
    middlewares: TMiddlewares
    commands: TCommands
    on: Partial<Record<BotEvent, (ctx: BotContext) => Promise<void>>>
    logger?: Logger
  }) {
    this.id = config.id
    this.name = config.name
    this.adapters = config.adapters
    this.middlewares = config.middlewares
    this.commands = config.commands
    this.logger = config.logger
    for (const event in config.on) {
      this.on(event as BotEvent, config.on[event as keyof typeof config.on]!)
    }
    }

  static adapter<
    TConfig extends ZodObject<any>
  >(adapter: {
    name: string
    parameters: TConfig
    init: (params: { config: TypeOf<TConfig>, commands: BotCommand[] }) => Promise<void>
    send: (params: BotSendParams<TypeOf<TConfig>>) => Promise<void>
    handle: (request: { request: Request, config: TypeOf<TConfig> }) => Promise<Omit<BotContext, 'bot'>>
  }): (TConfig: TypeOf<TConfig>) => IBotAdapter<TConfig> {
    return (config: TypeOf<TConfig>) => {
      return {
        name: adapter.name,
        parameters: adapter.parameters,
  
        async send(params: BotSendParams<TConfig>) {
          return adapter.send({ ...params, config });
        },
        
        async handle(params: BotHandleParams<TConfig>) {
          return adapter.handle({ 
            ...params, 
            config 
          });
        },
  
        async init(options?: { commands: BotCommand[] }) {
          await adapter.init({ config: config, commands: options?.commands || [] });
        },
      }
    }
  }

  static create<
    TAdapters extends Record<string, IBotAdapter<any>>,
    TMiddlewares extends Middleware[],
    TCommands extends Record<string, BotCommand>,
  >(config: {
    id: string
    name: string
    adapters: TAdapters
    middlewares?: TMiddlewares
    commands?: TCommands
    on?: Partial<Record<BotEvent, (ctx: BotContext) => Promise<void>>>
    logger?: Logger
  }): Bot<TAdapters, TMiddlewares, TCommands> {
    return new Bot({ 
      id: config.id,
      name: config.name,
      middlewares: config.middlewares || [],
      commands: config.commands || {},
      on: config.on || {},
      adapters: config.adapters,
      logger: config.logger,
    }) as 
      Bot<
        TAdapters,
        TMiddlewares,
        TCommands
      >
  }

  /**
   * Registers a listener for a bot event.
   * @param event The event to listen for.
   * @param callback The function to execute when the event occurs.
   */
  on(event: BotEvent, callback: (ctx: BotContext) => Promise<void>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event]!.push(callback)
    this.logger?.debug?.(`Listener registered for event '${event}'`, `Bot:${this.name}#${this.id}`)
  }

  /**
   * Sends a message to a channel via the specified adapter.
   * @param params Message parameters (provider, channel, content).
   */
  async send(
    params: Omit<BotSendParams<any>, 'config'>,
  ): Promise<void> {
    const adapter = this.adapters[params.provider]
    if (!adapter) {
      this.logger?.error(`Provider ${params.provider} not found`, undefined, `Bot:${this.name}#${this.id}`)
      throw new Error(`Provider ${params.provider} not found`)
    }
    // @ts-expect-error - Type 'any' is not assignable to type 'TConfig'
    await adapter.send({
      provider: params.provider,
      channel: params.channel,
      content: { 
        type: params.content.type, 
        content: params.content.content 
      },
    })
    this.logger?.log(`Message sent to channel '${params.channel}' via '${params.provider}'`, `Bot:${this.name}#${this.id}`)
  }

  /**
   * Processes the bot context, running middlewares, listeners, and commands.
   * @param ctx The bot context.
   */
  async process(ctx: BotContext): Promise<void> {
    let index = 0
    const next = async () => {
      if (index < this.middlewares.length) {
        await this.middlewares[index++](ctx, next)
      }
    }
    await next()
    this.logger?.debug?.(`Processing event '${ctx.event}'`, `Bot:${this.name}#${this.id}`)
    const listeners = this.listeners[ctx.event]
    if (listeners) {
      await Promise.all(listeners.map((listener) => listener(ctx)))
    }
    if (ctx.event === 'message' && ctx.message.content?.type === 'command') {
      const commandName = ctx.message.content.command
      const command = Object.values(this.commands).find(
        (cmd) => cmd.name === commandName || cmd.aliases.includes(commandName),
      )
      if (command) {
        try {
          await command.handle(ctx, ctx.message.content.params)
          this.logger?.log(`Command '${commandName}' executed`, `Bot:${this.name}#${this.id}`)
        } catch (error: any) {
          this.logger?.warn?.(`Error executing command '${commandName}': ${error?.message || error}`, `Bot:${this.name}#${this.id}`)
          if(command.help) {
            await this.send({
              provider: ctx.provider,
              channel: ctx.channel.id,
              content: {
                type: 'text',
                content: command.help,
              },
            })
          }
          await this.process({ 
            ...ctx, 
            event: 'error',
            // @ts-expect-error - Error type is not defined
            error: new Error('INVALID_COMMAND_PARAMETERS') 
          })
        }
      } else {
        this.logger?.warn?.(`Command '${commandName}' not found`, `Bot:${this.name}#${this.id}`)
        await this.process({ 
          ...ctx, 
          event: 'error', 
          // @ts-expect-error - Error type is not defined
          error: new Error('COMMAND_NOT_FOUND') 
        })
      }
    }
  }

  /**
   * Handles an incoming request from an adapter.
   * @param adapter The adapter name.
   * @param request The incoming request.
   */
  async handle(adapter: keyof TAdapters, request: Request) {
    const selectedAdapter = this.adapters[adapter]
    if (!selectedAdapter) {
      this.logger?.error(`No adapter found for '${String(adapter)}'`, undefined, `Bot:${this.name}#${this.id}`)
      throw new Error('No adapter found')
    }
    // @ts-expect-error - Type 'any' is not assignable to type 'TConfig'
    const ctx = await selectedAdapter.handle({ request })
    
    this.logger?.log(`Request received from adapter '${String(adapter)}'`, `Bot:${this.name}#${this.id}`)

    await this.process({
      ...ctx,
      bot: {
        id: this.id,
        name: this.name,
        send: async (params: Omit<BotSendParams<any>, 'config'>) => {
          this.send(params)
        },
      },
    })
    return new Response('OK', {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Initializes all registered adapters.
   */
  async start() {
    for (const adapter of Object.values(this.adapters)) {
      this.logger?.log(`Initializing adapter '${adapter.name}'`, `Bot:${this.name}#${this.id}`)
      
      // @ts-expect-error - Error type is not defined
      await adapter.init({ commands: Object.values(this.commands || {}) })
      
      this.logger?.log(`Adapter '${adapter.name}' initialized`, `Bot:${this.name}#${this.id}`)
    }
  }
}
