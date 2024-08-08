'use client'

import {
  LocaleDict,
  LocalesEnum,
  DEFAULT_DICT,
  getDictionary,
} from '@/services/internationalization/helpers/get-dictionary'

import React, { PropsWithChildren, createContext } from 'react'

export interface LocaleContextProps {
  dict: LocaleDict
}

export const LocaleContext = createContext<LocaleContextProps>({
  dict: DEFAULT_DICT,
})

export const LocaleProvider: React.FC<
  PropsWithChildren<{
    locale: LocalesEnum
  }>
> = ({ children, locale }) => {
  return (
    <LocaleContext.Provider
      value={{
        dict: getDictionary(locale),
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}
