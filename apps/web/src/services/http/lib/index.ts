import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { HttpResponseError } from '../errors'

// Function to abstract the Next response
export const sendResponse = (status: number = 200, data: any) => {
  return NextResponse.json(data, { status })
}

// Function to handle errors
const handleError = (error: Error) => {
  if (error instanceof z.ZodError) {
    console.error({ errors: error.errors })
    return sendResponse(400, { error: 'Invalid data.', details: error.errors })
  }

  if (error instanceof HttpResponseError) {
    return sendResponse(error.status, {
      error: error.message,
      data: error.data,
    })
  }

  return sendResponse(500, {
    error: 'Internal Server Error',
    data: {
      name: error.name,
      description: error.message,
    },
  })
}

// Tipo para o contexto da API
export type ApiHandlerContext<
  TBody = any,
  TParams = any,
  TQuery = any,
  TExtra = NonNullable<unknown>,
> = {
  body?: TBody
  params?: TParams
  query?: TQuery
  response?: (status: number, data: any) => NextResponse<any>
  error?: (error: Error) => NextResponse<any>
} & TExtra

// Definição de tipos para os middlewares
export type ApiMiddleware<TContext> = (
  req: NextRequest,
  context: TContext,
) => Promise<void>

// Definição de tipos para os esquemas
export interface ApiHandlerOptions<
  TBody = any,
  TParams = any,
  TQuery = any,
  TExtra = NonNullable<unknown>,
> {
  handler: (
    req: NextRequest,
    context: ApiHandlerContext<TBody, TParams, TQuery, TExtra>,
  ) => Promise<NextResponse>
  schemas?: {
    body?: z.ZodSchema<TBody>
    params?: z.ZodSchema<TParams>
    query?: z.ZodSchema<TQuery>
  }
  middlewares?: ApiMiddleware<
    ApiHandlerContext<TBody, TParams, TQuery, TExtra>
  >[]
}

// Higher-order function to create the API handler wrapper
export const createApiHandler = <
  TBody = any,
  TParams = any,
  TQuery = any,
  TExtra = NonNullable<unknown>,
>({
  handler,
  middlewares = [],
  schemas,
}: ApiHandlerOptions<TBody, TParams, TQuery, TExtra>) => {
  return async (req: NextRequest, { params }: { params: TParams }) => {
    try {
      // Contexto inicial tipado
      const context: ApiHandlerContext<TBody, TParams, TQuery, TExtra> =
        {} as ApiHandlerContext<TBody, TParams, TQuery, TExtra>

      context.response = sendResponse
      context.error = handleError

      // Validação do body
      if (schemas?.body) {
        const body = await req.json()
        context.body = schemas.body.parse(body)
      }

      // Validação dos params
      if (schemas?.params) {
        context.params = schemas.params.parse(params)
      }

      // Validação da query
      if (schemas?.query) {
        const query = req.nextUrl.searchParams
        context.query = schemas.query.parse(Object.fromEntries(query))
      }

      // Execute middlewares
      for (const middleware of middlewares) {
        await middleware(req, context)
      }

      // Execute the API handler with the context
      return await handler(req, context)
    } catch (error: any) {
      return handleError(error as Error)
    }
  }
}
