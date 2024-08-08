'use client'

import React from 'react'

import { Button, ButtonIcon } from '@design-system/react/components/ui/button'
import { SeparatorWithText } from '@design-system/react/components/ui/separator-with-text'
import { toast } from '@design-system/react/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { GoogleIcon } from './google-icon'
import { Input } from '@design-system/react/components/ui/input'
import { APP_CONFIGS } from '@/boilerplate.config'
import { sendGTMEvent } from '@next/third-parties/google'
import { useSearchParams } from 'next/navigation'

const authFormSchema = z.object({
  email: z.string().email(),
})

type AuthFormSchema = z.infer<typeof authFormSchema>

export function AuthForm() {
  const searchParams = useSearchParams()
  const form = useForm({
    resolver: zodResolver(authFormSchema),
  })

  const [isLoading, setIsLoading] = React.useState({
    google: false,
    github: false,
    email: false,
  })

  async function onSocialLogin(provider: 'google' | 'github') {
    setIsLoading((prev) => ({ ...prev, [provider]: true }))

    try {
      const callbackUrl = searchParams.get('callbackUrl')
      await signIn(provider, {
        callbackUrl: callbackUrl ?? '/',
      })

      sendGTMEvent({
        event: 'register',
        value: 'lead',
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }))
    }
  }

  const handleSubmit = form.handleSubmit(async (data: AuthFormSchema) => {
    setIsLoading((prev) => ({ ...prev, email: true }))

    try {
      const callbackUrl = searchParams.get('callbackUrl')
      await signIn('email', {
        email: data.email,
        redirect: false,
        callbackUrl: callbackUrl ?? '/',
      })

      sendGTMEvent({
        event: 'register',
        value: 'lead',
      })

      toast({
        title: 'Email enviado',
        description: `Enviamos um email para ${data.email} com um código de verificação.`,
      })
    } catch (error) {
      console.log(error)

      toast({
        title: 'Erro ao enviar email',
        description: `Ocorreu um erro ao enviar o email para ${data.email}.`,
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, email: false }))
    }
  })

  return (
    <form
      className="flex flex-col items-center justify-center text-center h-full"
      onSubmit={handleSubmit}
    >
      <div className="w-full space-y-8 mb-8">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full h-12 rounded-full"
          onClick={() => onSocialLogin('google')}
        >
          <ButtonIcon
            className="w-4 h-4 mr-3"
            icon={GoogleIcon}
            isLoading={isLoading.google}
          />
          Continuar com Google
        </Button>

        <SeparatorWithText>ou</SeparatorWithText>

        <Input
          variant="outline"
          placeholder="Seu email"
          className="h-12"
          {...form.register('email')}
        />
      </div>

      <footer className="mt-auto space-y-8 w-full">
        <span className="text-sm opacity-60 max-w-[80%]">
          Ao se inscrever, você concorda com nossos <br />
          termos{' '}
          <a
            href={APP_CONFIGS.app.links.terms}
            target="_blank"
            className="underline"
          >
            <b>Termos de Uso</b>
          </a>
        </span>

        <Button size="lg" className="w-full h-12 rounded-full">
          <ButtonIcon className="w-4 h-4 mr-3" isLoading={isLoading.email} />
          Continuar com email
        </Button>
      </footer>
    </form>
  )
}
