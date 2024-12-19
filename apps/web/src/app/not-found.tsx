import Link from 'next/link'
import { Logo } from './_components/logo'
import { Button } from '@design-system/react/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

/**
 * Metadata for the Not Found page
 */
export const metadata: Metadata = {
  title: 'Página não encontrada',
  description:
    'Desculpe, não conseguimos encontrar a página que você está procurando.',
}

/**
 * Custom 404 Not Found page component
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <Logo className="h-12" />

      <div className="max-w-md text-center space-y-2">
        <h1 className="text-4xl font-bold">Página não encontrada</h1>
        <p className="text-muted-foreground">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
      </div>

      <Button asChild variant="outline">
        <Link href="/" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar para o início
        </Link>
      </Button>
    </div>
  )
}
