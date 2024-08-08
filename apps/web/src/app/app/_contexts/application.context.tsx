'use client'

import { APP_CONFIGS } from '@/boilerplate.config'
import { ApplicationSession } from '@/services/session/types/application-session'

import React, { PropsWithChildren, createContext } from 'react'

export interface ApplicationContextProps {
  session: ApplicationSession
  config: typeof APP_CONFIGS
}

export const ApplicationContext = createContext<ApplicationContextProps>({
  session: {
    user: null,
  },
  config: APP_CONFIGS,
})

export const ApplicationProvider: React.FC<
  PropsWithChildren<{
    session: ApplicationSession
  }>
> = ({ children, session }) => {
  return (
    <ApplicationContext.Provider
      value={{
        session,
        config: APP_CONFIGS,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  )
}
