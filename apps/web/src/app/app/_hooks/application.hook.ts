import { useContext } from 'react'

import {
  ApplicationContext,
  ApplicationContextProps,
} from '../_contexts/application.context'

export function useApplication(): ApplicationContextProps {
  return useContext(ApplicationContext)
}
