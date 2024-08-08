import {
  FormSection,
  FormSectionDescription,
  FormSectionHeader,
  FormSectionMain,
  FormSectionTitle,
} from '@design-system/react/components/shared/dashboard/form-section'
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@design-system/react/components/shared/dashboard/page'
import { Metadata } from 'next'
import { SettingsProfileForm } from './_components/settings-profile-form'
import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return {
    title: dict.dashboard.settings.main.title,
  }
}

export default function Page() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>
          {dict.dashboard.settings.main.title}
        </DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain className="container max-w-screen-md">
        <FormSection>
          <FormSectionHeader>
            <FormSectionTitle>
              {dict.dashboard.settings.main.title}
            </FormSectionTitle>
            <FormSectionDescription>
              {dict.dashboard.settings.main.description}
            </FormSectionDescription>
          </FormSectionHeader>
          <FormSectionMain>
            <SettingsProfileForm />
          </FormSectionMain>
        </FormSection>
      </DashboardPageMain>
    </DashboardPage>
  )
}
