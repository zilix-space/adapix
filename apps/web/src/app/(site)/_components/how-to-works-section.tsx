"use client";

import {
  UserPlusIcon,
  CheckCircleIcon,
  WalletIcon,
  KeyIcon,
  CurrencyIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection } from "./animated-section";

export function HowToWorksSection() {
  return (
    <AnimatedSection>
      <section className="p-8 md:p-16 bg-secondary/50 rounded-3xl border shadow-sm">
        <header className="mb-10">
          <h2 className="text-xl font-medium tracking-tight">Como funciona</h2>
          <p className="text-muted-foreground mt-2 md:max-w-[70%] text-sm">
            Siga os passos abaixo para começar a usar a AdaPix
          </p>
        </header>
        <main className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-[32px] bottom-8 w-[1px] bg-border hidden md:block"></div>

          {/* Step 1 */}
          <motion.div
            className="flex flex-col md:flex-row items-start mb-10 group relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-primary/20 z-10 mb-4 md:mb-0 md:mr-6">
              <span className="text-primary text-sm font-medium">1</span>
            </div>
            <div className="md:pt-0 w-full">
              <div className="p-0 md:p-0 transition-all duration-300">
                <div className="flex items-center mb-2">
                  <UserPlusIcon className="text-primary w-5 h-5 mx-1.5" />
                  <h3 className="text-base font-medium">Crie sua conta</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed pl-8 text-sm">
                  Cadastre-se na plataforma AdaPix para começar a comprar e
                  vender ADA de forma segura.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="flex flex-col md:flex-row items-start mb-10 group relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-primary/20 z-10 mb-4 md:mb-0 md:mr-6">
              <span className="text-primary text-sm font-medium">2</span>
            </div>
            <div className="md:pt-0 w-full">
              <div className="p-0 md:p-0 transition-all duration-300">
                <div className="flex items-center mb-2">
                  <CheckCircleIcon className="text-primary w-5 h-5 mx-1.5" />
                  <h3 className="text-base font-medium">Valide sua conta</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed pl-8 text-sm">
                  Complete o cadastro e envie os documentos necessários para
                  validar sua conta com segurança.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="flex flex-col md:flex-row items-start mb-10 group relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-primary/20 z-10 mb-4 md:mb-0 md:mr-6">
              <span className="text-primary text-sm font-medium">3</span>
            </div>
            <div className="md:pt-0 w-full">
              <div className="p-0 md:p-0 transition-all duration-300">
                <div className="flex items-center mb-2">
                  <WalletIcon className="text-primary w-5 h-5 mx-1.5" />
                  <h3 className="text-base font-medium">
                    Conecte sua wallet Cardano
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed pl-8 text-sm">
                  Conecte sua wallet Cardano de forma rápida e segura para
                  gerenciar seus ativos.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            className="flex flex-col md:flex-row items-start mb-10 group relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-primary/20 z-10 mb-4 md:mb-0 md:mr-6">
              <span className="text-primary text-sm font-medium">4</span>
            </div>
            <div className="md:pt-0 w-full">
              <div className="p-0 md:p-0 transition-all duration-300">
                <div className="flex items-center mb-2">
                  <KeyIcon className="text-primary w-5 h-5 mx-1.5" />
                  <h3 className="text-base font-medium">
                    Cadastre sua chave PIX
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed pl-8 text-sm">
                  Cadastre sua chave PIX padrão para facilitar as transações
                  rápidas e seguras.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 5 */}
          <motion.div
            className="flex flex-col md:flex-row items-start group relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-primary/20 z-10 mb-4 md:mb-0 md:mr-6">
              <span className="text-primary text-sm font-medium">5</span>
            </div>
            <div className="md:pt-0 w-full">
              <div className="p-0 md:p-0 transition-all duration-300">
                <div className="flex items-center mb-2">
                  <CurrencyIcon className="text-primary w-5 h-5 mx-1.5" />
                  <h3 className="text-base font-medium">
                    Compre e venda Cardano
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed pl-8 text-sm">
                  Compre e venda ADA (Cardano) com facilidade e segurança
                  utilizando PIX, com transações instantâneas.
                </p>
              </div>
            </div>
          </motion.div>
        </main>
      </section>
    </AnimatedSection>
  );
}
