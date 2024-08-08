import {
  UserPlusIcon,
  CheckCircleIcon,
  WalletIcon,
  KeyIcon,
  CurrencyIcon,
} from 'lucide-react'

export function HowToWorksSection() {
  return (
    <section className="p-6 md:p-12 bg-white rounded-3xl border border-border">
      <header>
        <h2 className="text-xl md:text-2xl font-semibold">Como funciona</h2>
      </header>
      <main>
        <div className="mt-6">
          <div className="flex items-center space-x-2">
            <UserPlusIcon className="text-primary w-5 h-5" />
            <h3 className="text-lg font-bold">Crie sua conta</h3>
          </div>
          <p className="text-gray-600 ml-8">
            Cadastre-se na plataforma AdaPix para começar a comprar e vender
            ADA.
          </p>
        </div>

        <hr className="my-6 border-gray-200" />

        <div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="text-primary w-5 h-5" />
            <h3 className="text-lg font-bold">Valide sua conta</h3>
          </div>
          <p className="text-gray-600 ml-8">
            Complete o cadastro e envie os documentos necessários para validar
            sua conta.
          </p>
        </div>

        <hr className="my-6 border-gray-200" />

        <div>
          <div className="flex items-center space-x-2">
            <WalletIcon className="text-primary w-5 h-5" />
            <h3 className="text-lg font-bold">Conecte sua wallet Cardano</h3>
          </div>
          <p className="text-gray-600 ml-8">
            Conecte sua wallet Cardano de forma rápida e segura.
          </p>
        </div>

        <hr className="my-6 border-gray-200" />

        <div>
          <div className="flex items-center space-x-2">
            <KeyIcon className="text-primary w-5 h-5" />
            <h3 className="text-lg font-bold">Cadastre sua chave PIX</h3>
          </div>
          <p className="text-gray-600 ml-8">
            Cadastre sua chave PIX padrão para facilitar as transações.
          </p>
        </div>

        <hr className="my-6 border-gray-200" />

        <div>
          <div className="flex items-center space-x-2">
            <CurrencyIcon className="text-primary w-5 h-5" />
            <h3 className="text-lg font-bold">Compre e venda Cardano</h3>
          </div>
          <p className="text-gray-600 ml-8">
            Compre e venda ADA (Cardano) com facilidade e segurança utilizando
            PIX.
          </p>
        </div>
      </main>
    </section>
  )
}
