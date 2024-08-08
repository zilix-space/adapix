import { APP_CONFIGS } from '@/boilerplate.config'
import { getDictionary } from '@/services/internationalization/helpers/get-dictionary'
import { getLocaleFromRequest } from '@/services/internationalization/helpers/get-locale-from-request'

export function Footer() {
  const locale = getLocaleFromRequest()
  const dict = getDictionary(locale)

  return (
    <footer className="border-t border-border relative mt-10 pb-8">
      <div className="border-t border-border pt-8 text-sm">
        <div className="container max-w-screen-xl flex flex-col md:flex-row text-center md:text-left justify-between opacity-60">
          <p className="mb-8 md:mb-0">
            &copy; {new Date().getFullYear()} {APP_CONFIGS.app.name}.{' '}
            {dict.site.layout.footer.rights} | Powered on Cardano Blockchain
          </p>
          <ul className="flex flex-col md:flex-row space-y-2 h-4 md:space-x-8 items-center md:space-y-0">
            <li className="mr-4">
              <a href="mailto:suporte@adapix.com.br">suporte@adapix.com.br</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
