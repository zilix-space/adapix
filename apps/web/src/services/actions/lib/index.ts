/* eslint-disable @typescript-eslint/no-unused-vars */
import { ZodSchema, z } from 'zod'
import { IsAny } from './utils'

export type AsIfByKey<Key, True, False> = Key extends null ? False : True

type Middleware<Context = any> = (request: {
  input: any
  action: string
  context: Context
  next: () => void
}) => void

type Action<Input, Context, Output> = AsIfByKey<
  Input,
  (request: { input: Input; context: Context }) => Promise<Output>,
  (request: { context: Context }) => Promise<Output>
>

type ActionHandler<Input, Output> = AsIfByKey<
  Input,
  (input: Input) => Promise<Output>,
  () => Promise<Output>
>

// create a type if schema is empty returns undefined else returns the schema
type SchemaType<T> = T extends z.ZodSchema<infer Type> ? IsAny<Type> : null

export function createActionClient<Context>(routerOptions: {
  context: () => Promise<Context>
  onExecute?: (props: {
    action: string
    type: string
    input: unknown
    context: Context
    error?: any
  }) => Promise<void> | void
}) {
  const middlewares: Middleware<Context>[] = []

  return {
    use(middleware: Middleware<Context>) {
      middlewares.push(middleware)
    },
    action<Schema extends ZodSchema, Output>(options: {
      name: string
      type: 'mutate' | 'query'
      schema?: Schema
      path?: string
      handler: Action<SchemaType<Schema>, Context, Output>
    }): ActionHandler<SchemaType<Schema>, Output> {
      const { schema, handler } = options

      async function constructContext() {
        const context = await routerOptions
          .context()
          .catch((error) => {
            console.error(error)
            return {} as Context
          })
          .then((context) => context)

        return context
      }

      async function runMiddlewares({
        input,
        context,
      }: {
        input: any
        context: Context
      }) {
        for (const middleware of middlewares) {
          middleware({
            input,
            action: options.name ?? '',
            context,
            next: () => {},
          })
        }
      }

      async function runHandler(payload: any) {
        try {
          await routerOptions.onExecute?.({
            action: options.name ?? '',
            type: options.type,
            input: payload.input,
            context: payload.context,
            error: undefined,
          })

          const result = handler(payload)

          await routerOptions.onExecute?.({
            action: options.name ?? '',
            type: options.type,
            input: payload.input,
            context: payload.context,
            error: undefined,
          })

          return result
        } catch (error) {
          await routerOptions.onExecute?.({
            action: options.name ?? '',
            type: options.type,
            input: payload.input,
            context: payload.context,
            error,
          })

          throw error
        }
      }

      if (!schema) {
        return async () => {
          const context = await constructContext()

          await runMiddlewares({
            input: undefined,
            context,
          })

          return runHandler({
            context,
          })
        }
      }

      return async (input?: z.infer<Schema>) => {
        const context = await constructContext()

        await runMiddlewares({
          input,
          context,
        })

        return runHandler({
          input,
          context,
        })
      }
    },
  }
}
