import {
  DappPage,
  DappPageFooter,
  DappPageMain,
} from '../../../_components/dapp-page'
import { CheckAnimation } from './_components/check'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function Page() {
  return (
    <DappPage className="flex flex-col justify-between h-full">
      <div></div>
      <DappPageMain className="p-4 text-lg text-gray-700">
        <div className="flex flex-col items-center justify-center space-y-4 h-16 mb-6">
          <CheckAnimation />
        </div>
        <h1 className="text-xl font-bold text-center text-green-600 mb-2">
          Cadastro concluído!
        </h1>
        <p className="text-center">
          Em até 48 horas você receberá um email com o resultado da análise.
        </p>
      </DappPageMain>
      <DappPageFooter className="mt-auto">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AdaPix. Todos os direitos reservados.
        </p>
      </DappPageFooter>
    </DappPage>
  )
}
