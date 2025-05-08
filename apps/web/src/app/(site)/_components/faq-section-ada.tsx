'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@design-system/react/components/ui/accordion'
import { getFaq } from '../_data/faq'
import { motion } from 'framer-motion'
import { AnimatedSection } from './animated-section'

export function FAQSectionAda() {
  const faq = getFaq()

  return (
    <AnimatedSection delay={0.1}>
      <section className="p-8 md:p-12 bg-secondary/50 rounded-3xl border shadow-sm">
        <header className="mb-6">
          <h2 className="text-xl font-medium tracking-tight">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Encontre respostas para as dúvidas mais comuns sobre a plataforma
          </p>
        </header>
        <main>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <AccordionItem
                  value={item.title}
                  className="border-b border-border/30 px-1 py-1"
                >
                  <AccordionTrigger className="text-left hover:no-underline text-base font-medium py-3">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-1 pb-4 text-sm">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </main>
      </section>
    </AnimatedSection>
  )
}
