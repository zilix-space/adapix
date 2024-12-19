import {
  ApplicationContext,
  type ApplicationContextProps,
} from '@/contexts/app.context'
import { useContext } from 'react'

export function useApplication(): ApplicationContextProps {
  return useContext(ApplicationContext)
}
