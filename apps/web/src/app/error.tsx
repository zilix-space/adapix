'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Logo } from './_components/logo'
import { Button } from '@design-system/react/components/ui/button'
import { ArrowLeft, RefreshCcw } from 'lucide-react'
import type { Metadata } from 'next'

/**
 * Metadata for the Error page
 */
export const metadata: Metadata = {
  title: 'Erro',
  description: 'Ocorreu um erro ao processar sua solicitação.',
}

/**
 * Props for the Error component
 */
interface ErrorProps {
  error: Error
  reset: () => void
}

/**
 * Custom Error page component
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <Logo className="h-12" />

      <div className="max-w-md text-center space-y-2">
        <h1 className="text-4xl font-bold">Algo deu errado!</h1>
        <p className="text-muted-foreground">
          Ocorreu um erro ao processar sua solicitação. Por favor, tente
          novamente mais tarde.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={reset} variant="default" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Tentar novamente
        </Button>

        <Button asChild variant="outline">
          <Link href="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o início
          </Link>
        </Button>
      </div>
    </div>
  )
}
