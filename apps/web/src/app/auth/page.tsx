import Link from 'next/link'

import { APP_CONFIGS } from '@/boilerplate.config'
import { AuthForm } from './_components/auth-form'
import { ArrowLeft, HelpCircle } from 'lucide-react'
import { Button } from '@design-system/react/components/ui/button'
import { Metadata } from 'next'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'
import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return {
    title: dict.auth.metadata.title,
    description: `${dict.auth.metadata.description[0]} ${APP_CONFIGS.app.name}. ${dict.auth.metadata.description[1]}`,
  }
}

export default function Page() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <div className="grid md:grid-cols-[1fr_40vw]">
      <div className="hidden md:block relative rounded-r-[32px] overflow-hidden bg-gradient-to-b from-black to-neutral-700">
        <img
          src="https://images.pexels.com/photos/593158/pexels-photo-593158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt={APP_CONFIGS.app.name}
          className="w-full h-screen object-cover opacity-80"
        />
      </div>
      <main className="h-screen flex flex-col justify-between overflow-hidden">
        <header className="flex items-center sticky top-0 justify-between p-8">
          <Link href="/">
            <Button variant="secondary" size="icon" className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <Link
            href={APP_CONFIGS.app.links.support}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="rounded-full">
              <HelpCircle className="w-3 h-3 mr-2" />
              {dict.auth.main.button.label}
            </Button>
          </Link>
        </header>
        <main className="flex items-start md:items-center justify-center p-8">
          <div className="w-[26rem]">
            <AuthForm />
          </div>
        </main>

        <footer className="flex justify-center p-8 opacity-40">
          <span>
            © {new Date().getFullYear()} {APP_CONFIGS.app.name}.{' '}
            {dict.auth.footer.rights}
          </span>
        </footer>
      </main>
    </div>
  )
}
