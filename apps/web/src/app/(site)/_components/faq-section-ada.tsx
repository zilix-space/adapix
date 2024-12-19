import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@design-system/react/components/ui/accordion'
import { getFaq } from '../_data/faq'

export function FAQSectionAda() {
  const faq = getFaq()

  return (
    <section className="p-6 md:p-12 bg-background rounded-3xl border border-border">
      <header>
        <h2 className="text-xl md:text-2xl font-semibold">Como funciona</h2>
      </header>
      <main>
        <Accordion type="single" collapsible className="w-full">
          {faq.map((item) => (
            <AccordionItem key={item.title} value={item.title}>
              <AccordionTrigger className="text-left">
                {item.title}
              </AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </section>
  )
}
