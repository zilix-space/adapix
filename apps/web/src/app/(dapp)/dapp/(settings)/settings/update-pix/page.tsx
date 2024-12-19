import {
  DappPage,
  DappPageHeader,
  DappPageHeaderBackButton,
  DappPageHeaderContainer,
  DappPageHeaderTitle,
  DappPageMain,
} from '../../../_components/dapp-page'
import { UpdatePixForm } from './_components/form'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
export const dynamicParams = true

export default function Page() {
  return (
    <DappPage>
      <DappPageHeader>
        <DappPageHeaderBackButton href="/dapp" />
        <DappPageHeaderContainer>
          <DappPageHeaderTitle>Atualizar chave PIX</DappPageHeaderTitle>
        </DappPageHeaderContainer>
      </DappPageHeader>
      <DappPageMain>
        <UpdatePixForm />
      </DappPageMain>
    </DappPage>
  )
}
