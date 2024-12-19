import {
  DappPage,
  DappPageHeader,
  DappPageHeaderBackButton,
  DappPageHeaderContainer,
  DappPageHeaderTitle,
  DappPageMain,
} from '../../../_components/dapp-page'
import { UserProfileForm } from './_components/form'

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
          <DappPageHeaderTitle>Perfil</DappPageHeaderTitle>
        </DappPageHeaderContainer>
      </DappPageHeader>
      <DappPageMain>
        <UserProfileForm />
      </DappPageMain>
    </DappPage>
  )
}
