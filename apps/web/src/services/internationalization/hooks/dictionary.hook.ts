import { useContext } from 'react'
import {
  LocaleContext,
  LocaleContextProps,
} from '@/services/internationalization/contexts/locale.context'

export function useDictionary(): LocaleContextProps {
  return useContext(LocaleContext)
}
