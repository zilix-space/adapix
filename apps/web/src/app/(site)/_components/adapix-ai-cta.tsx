'use client'

import {
  MessagesSquare,
  SendHorizontal,
  Zap,
  BarChart4,
  Lock,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedSection } from './animated-section'
import { TelegramIcon, WhatsAppIcon } from './icons'

export function AdapixAiCTA() {
  const features = [
    {
      icon: <Zap className="h-4 w-4 text-primary" />,
      title: 'Tudo no Chat',
      description: 'Compre e venda ADA em segundos diretamente pelo chat',
    },
    {
      icon: <MessagesSquare className="h-4 w-4 text-primary" />,
      title: 'Interface Familiar',
      description: 'Use o WhatsApp ou Telegram que você já conhece',
    },
    {
      icon: <Lock className="h-4 w-4 text-primary" />,
      title: 'Segurança',
      description: 'Proteção em todas as etapas da transação',
    },
    {
      icon: <BarChart4 className="h-4 w-4 text-primary" />,
      title: 'Cotações',
      description: 'Decisões melhores com preços e noticias',
    },
  ]

  return (
    <AnimatedSection delay={0.1}>
      <section className="p-8 md:p-12 bg-secondary/50 rounded-3xl border border-border/10 shadow-sm">
        <header className="mb-6">
          <h2 className="text-xl font-medium tracking-tight">
            Faça tudo no seu celular com <u>Ada Pix AI</u>
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Compre e venda ADA usando apenas mensagens de texto, sem
            complicações
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Left side with cards */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-background/60 p-4 rounded-lg border border-border/10 hover:shadow-sm transition-all flex flex-col h-full"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="bg-primary/5 h-8 w-8 rounded-full flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm font-medium mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="flex flex-col space-y-4 mt-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <motion.a
                href={
                  process.env.NEXT_PUBLIC_WHATSAPP_URL ||
                  'https://wa.me/5511999999999'
                }
                className="inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <WhatsAppIcon className="h-4 w-4 mr-2" />
                Usar o AdaPix no WhatsApp
              </motion.a>
              <motion.a
                href={
                  process.env.NEXT_PUBLIC_TELEGRAM_URL ||
                  'https://t.me/adapix_bot'
                }
                className="inline-flex items-center justify-center bg-secondary text-foreground border border-border px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TelegramIcon className="h-4 w-4 mr-2" />
                Usar o AdaPix no Telegram
              </motion.a>
            </motion.div>
          </div>

          {/* Right side with chat mockup */}
          <div className="relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative max-w-[260px] shadow-lg rounded-2xl overflow-hidden border border-border/10"
            >
              {/* Phone mockup with chat interface */}
              <div className="bg-background h-[420px] w-full relative">
                {/* Chat header */}
                <div className="bg-primary px-3 py-2 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                    A
                  </div>
                  <div className="ml-2">
                    <p className="text-white text-xs font-medium">AdaPix AI</p>
                    <p className="text-white/70 text-[10px]">Online agora</p>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="p-2 h-[calc(420px-40px)] overflow-y-auto flex flex-col justify-end">
                  {/* Bot message */}
                  <motion.div
                    className="bg-secondary rounded-lg rounded-tl-none p-2 max-w-[80%] mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <p className="text-xs">
                      Olá! Sou o assistente AdaPix. Como posso ajudar?
                    </p>
                  </motion.div>

                  {/* User message */}
                  <motion.div
                    className="bg-primary/10 text-primary rounded-lg rounded-tr-none p-2 max-w-[80%] ml-auto mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    <p className="text-xs">Quero comprar ADA</p>
                  </motion.div>

                  {/* Bot message */}
                  <motion.div
                    className="bg-secondary rounded-lg rounded-tl-none p-2 max-w-[80%] mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  >
                    <p className="text-xs">
                      Claro! Quanto em ADA você gostaria de comprar?
                    </p>
                  </motion.div>

                  {/* User message */}
                  <motion.div
                    className="bg-primary/10 text-primary rounded-lg rounded-tr-none p-2 max-w-[80%] ml-auto mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  >
                    <p className="text-xs">R$ 100,00 em ADA</p>
                  </motion.div>

                  {/* Bot message with quote */}
                  <motion.div
                    className="bg-secondary rounded-lg rounded-tl-none p-2 max-w-[80%] mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                  >
                    <p className="text-xs mb-1">
                      Pela cotação atual, você receberá:
                    </p>
                    <div className="bg-background rounded p-1.5 flex justify-between items-center">
                      <span className="text-xs font-medium">65,24 ADA</span>
                      <span className="text-xs text-muted-foreground">
                        R$ 100,00
                      </span>
                    </div>
                    <p className="text-xs mt-1">Deseja confirmar?</p>
                  </motion.div>

                  {/* Chat input */}
                  <motion.div
                    className="bg-background border-t border-border/10 mt-2 p-1.5 flex"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 1.0 }}
                  >
                    <div className="bg-secondary/50 rounded-full flex-1 h-7"></div>
                    <button className="w-7 h-7 bg-primary rounded-full flex items-center justify-center ml-1.5">
                      <SendHorizontal className="h-3 w-3 text-white" />
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  )
}
