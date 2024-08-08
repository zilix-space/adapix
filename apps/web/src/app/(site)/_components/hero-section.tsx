import { Badge } from '@design-system/react/components/ui/badge'

import { getAdaQuoteAction } from '../actions'

export async function HeroSection() {
  const { quote } = await getAdaQuoteAction()

  return (
    <section className="bg-primary text-primary-foreground rounded-3xl p-6 md:p-12">
      <h1 className="text-2xl md:text-3xl md:max-w-[60%] font-bold mb-4 leading-loose">
        Sua ADA na Wallet em Minutos com PIX
      </h1>
      <p className="text-lg md:text-2xl text-primary-foreground/60">
        Compre e venda ADA de forma segura e instantânea com PIX. Tenha suas
        transações concluídas rapidamente e sem complicações.
      </p>

      <div className="mt-16">
        <small className="uppercase text-primary-foreground/60 mb-2 block">
          Cotação da ADA(Cardano) hoje:
        </small>

        <div className="flex items-center space-x-4">
          <Badge
            variant="outline"
            className="h-9 px-3 pl-2 bg-white/20 border-white/10 text-white"
          >
            <span className="h-6 w-6 flex items-center justify-center rounded-full bg-black/5 mr-3">
              ₳
            </span>
            1 ADA = R${quote}
          </Badge>
        </div>
      </div>
    </section>
  )
}
