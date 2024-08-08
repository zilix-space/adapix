import { zodResolver } from '@hookform/resolvers/zod'
import { debounce } from 'lodash'
import { useRouter } from 'next/navigation'
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react'
import {
  UseFormHandleSubmit,
  UseFormProps,
  UseFormReturn,
  useForm,
} from 'react-hook-form'
import { z } from 'zod'

type ClientAction<ActionInput, ActionOutput> = (
  input: ActionInput,
) => Promise<ActionOutput>

export const useAction = <ActionInput, ActionOutput>(
  actions: ClientAction<ActionInput, ActionOutput>,
) => {
  const executor = useRef(actions)

  const [isSubmitting, startTransition] = useTransition()
  const [response, setResponse] = useState<ActionOutput | null>()
  const [error, setError] = useState<any>(null)

  const execute = useCallback((input: ActionInput): Promise<ActionOutput> => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          setResponse(null)
          const result = await executor.current(input)
          setResponse(result)
          resolve(result)
        } catch (error) {
          setError(error)
          reject(error)
        }
      })
    })
  }, [])

  return {
    execute,
    isSubmitting,
    response,
    error,
  }
}

type UseActionFormProps<Input extends z.ZodType<any, any>, Output> = Omit<
  UseFormProps<z.infer<Input>>,
  'resolver'
> & {
  action: ClientAction<z.input<Input>, Output>
  schema: Input
  onSubmitError?: (error: any) => void
  onSubmitSuccess?: (result: Output) => void
  onSubmitStatusChange?: (isSubmitting: boolean) => void
}

// eslint-disable-next-line no-unused-vars
type UseActionFormReturn<Input extends z.ZodType<any, any>, Output> = Omit<
  UseFormReturn<z.infer<Input>>,
  'handleSubmit'
> & {
  actionState: {
    isSubmitting: boolean
    response: Output | null
    error: any
  }
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  handleSubmitOrigin: UseFormHandleSubmit<z.infer<Input>>
}

export const useActionForm = <Input extends z.ZodType<any, any>, Output>({
  action,
  schema,
  onSubmitError,
  onSubmitSuccess,
  onSubmitStatusChange,
  defaultValues,
  ...formOptions
}: UseActionFormProps<Input, Output>): UseActionFormReturn<Input, Output> => {
  const router = useRouter()

  const form = useForm<z.infer<Input>>({
    resolver: zodResolver(schema),
    ...formOptions,
    defaultValues,
  })

  const { error, execute, isSubmitting, response } = useAction(action)

  const parseResultWithDefaultValue = (data: z.input<Input>) => {
    // merge with default value. If the default value is not defined, it will be undefined. If the data.value is not defined, it will be undefined
    const result = {
      ...defaultValues,
      ...data,
    } as z.infer<Input>

    return result
  }

  const handleSubmit = form.handleSubmit(async (data: z.input<Input>) => {
    try {
      const parsedData = parseResultWithDefaultValue(data)
      const result = await execute(parsedData)

      router.refresh()

      if (onSubmitSuccess) return onSubmitSuccess(result)
    } catch (error: any) {
      if (onSubmitError) return onSubmitError(error)
    }
  })

  useEffect(() => {
    const delayedWatch = debounce((value, { type }) => {
      if (formOptions.mode !== 'onChange' || type !== 'change') return
      handleSubmit()
    }, 1000)

    const subscription = form.watch(delayedWatch)

    return () => {
      subscription.unsubscribe()
      delayedWatch.cancel() // Certifique-se de cancelar a chamada adiada quando o componente é desmontado
    }
  }, [form.watch, formOptions.mode, handleSubmit])

  useEffect(() => {
    onSubmitStatusChange?.(isSubmitting)
  }, [isSubmitting])

  return {
    ...form,
    handleSubmit,
    handleSubmitOrigin: form.handleSubmit,
    actionState: {
      error,
      isSubmitting,
      response,
    },
  }
}
