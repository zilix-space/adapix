'use client'

import { Badge } from '@design-system/react/components/ui/badge'
import { ArrowRightIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export async function HeroSection({ quote }: { quote: number }) {
  return (
    <section className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 overflow-hidden relative">
      <div className="absolute -top-28 -right-28 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-8 -left-24 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

      <div className="relative z-10">
        <motion.h1
          className="text-2xl md:text-3xl lg:text-4xl md:max-w-[60%] font-semibold mb-4 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sua ADA na Wallet em Minutos com PIX
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-primary-foreground/80 md:max-w-[70%] leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Compre e venda ADA de forma segura e instantânea com PIX. Transações
          concluídas rapidamente e sem complicações.
        </motion.p>

        <motion.div
          className="flex mt-6 space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.button
            className="bg-white text-primary px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Começar agora
          </motion.button>
          <motion.button
            className="text-white border border-white/20 px-5 py-2.5 rounded-full text-sm font-medium flex items-center group hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Saiba mais
            <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <small className="uppercase text-primary-foreground/70 mb-2 block font-medium tracking-wide text-xs">
            Cotação da ADA (Cardano) hoje:
          </small>

          <div className="flex items-center space-x-4">
            <Badge
              variant="outline"
              className="h-10 px-4 pl-3 bg-background/10 backdrop-blur-sm border-white/10 text-white shadow-sm"
            >
              <span className="h-6 w-6 flex items-center justify-center rounded-full bg-white/10 mr-3 font-medium">
                ₳
              </span>
              <span className="font-medium text-sm">
                1 ADA = <span className="text-white">R${quote}</span>
              </span>
            </Badge>
            <span className="text-primary-foreground/60 text-xs">
              Atualizado agora
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
