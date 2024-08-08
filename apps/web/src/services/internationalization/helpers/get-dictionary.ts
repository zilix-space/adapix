import pt from '../dictionaries/pt.json'
import en from '../dictionaries/en.json'
// import es from '../dictionaries/es.json'

import { APP_CONFIGS } from '@/boilerplate.config'

const dictionaries = {
  pt,
  en,
  // es,
}

export const dictionariesOptions = [
  {
    value: 'en',
    label: 'EN-US',
  },
  {
    value: 'pt',
    label: 'PT-BR',
  },
  // {
  //   value: 'es',
  //   label: 'EN-ES',
  // },
]

export type LocalesEnum = keyof typeof dictionaries
export type LocaleDict = (typeof dictionaries)[LocalesEnum]
export const DEFAULT_DICT: LocaleDict =
  dictionaries[APP_CONFIGS.app.defaultLanguage as LocalesEnum]

export const getDictionary = (
  locale: LocalesEnum = APP_CONFIGS.app.defaultLanguage as LocalesEnum,
): LocaleDict => {
  return dictionaries[locale]
}
