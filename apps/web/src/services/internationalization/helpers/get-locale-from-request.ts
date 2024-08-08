import { APP_CONFIGS } from '@/boilerplate.config'
import { cookies, headers } from 'next/headers'
import { LocalesEnum } from './get-dictionary'

export function getLocaleFromRequest() {
  const acceptLocale = headers().get('Accept-Language')?.split('-')[0]
  const userPreferenceLocale = cookies().get('x-locale')

  return (userPreferenceLocale?.value ||
    acceptLocale ||
    APP_CONFIGS.app.defaultLanguage) as LocalesEnum
}
