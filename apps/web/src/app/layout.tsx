import NextTopLoader from 'nextjs-toploader'

import { APP_CONFIGS } from '@/boilerplate.config'
import { Toaster } from '@design-system/react/components/ui/toaster'
import { UTMProvider } from '@design-system/react/components/ui/utm-provider'
import { GoogleAnalytics } from '@next/third-parties/google'
import { GeistSans } from 'geist/font/sans'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { getApplicationSession } from '@/services/session/get-application-session'

import '@design-system/react/style.scss'
import CrispChat from './_components/crisp'
import { LocaleProvider } from '@/services/internationalization/contexts/locale.context'
import { ApplicationProvider } from '@/contexts/app.context'

export const metadata = {
  title: {
    template: `${APP_CONFIGS.app.name} · %s`,
    default: 'Page',
  },
  openGraph: {
    images: [APP_CONFIGS.app.ogImage],
  },
  metadataBase: new URL(APP_CONFIGS.app.url),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = getLocaleFromRequest()
  const session = await getApplicationSession()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${GeistSans.className} font-sans`}>
        <NextTopLoader color="#e11d48" />
        <GoogleAnalytics gaId={APP_CONFIGS.providers.analytics.GTM} />
        <UTMProvider />
        <Toaster />
        <CrispChat />

        <ApplicationProvider session={session}>
          <LocaleProvider locale={locale}>{children}</LocaleProvider>
        </ApplicationProvider>
      </body>
    </html>
  )
}
