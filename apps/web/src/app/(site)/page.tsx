import { Metadata } from 'next'
import { Dapp } from './_components/dapp'
import { PageWrapper } from './_components/page-wrapper'
import { HeroSection } from './_components/hero-section'
import { HowToWorksSection } from './_components/how-to-works-section'
import { FAQSectionAda } from './_components/faq-section-ada'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Sua ADA na Wallet em Minutos com PIX',
    description:
      'Compre e venda ADA de forma segura e instantânea com PIX. Tenha suas transaçes concluídas rapidamente e sem complicaçes.',
  }
}

export default function Page() {
  return (
    <PageWrapper>
      <div className="space-y-12">
        <HeroSection />
        <HowToWorksSection />
        <FAQSectionAda />
      </div>
      <div className="hidden md:block relative h-full">
        <Dapp />
      </div>
    </PageWrapper>
  )
}
