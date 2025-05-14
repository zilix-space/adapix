import { APP_CONFIGS } from '@/boilerplate.config'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border relative mt-10 py-12 bg-card/30">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e informações */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">{APP_CONFIGS.app.name}</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Compre e venda ADA de forma segura e instantânea com PIX. Tenha suas transações concluídas rapidamente e sem complicações.
            </p>
          </div>

          {/* Links úteis */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:suporte@adapix.com.br" className="text-muted-foreground hover:text-primary transition-colors">
                  suporte@adapix.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} {APP_CONFIGS.app.name}. Todos os direitos reservados
          </p>
          <p className="mt-2 md:mt-0">
            Powered on Cardano Blockchain
          </p>
        </div>
      </div>
    </footer>
  )
}