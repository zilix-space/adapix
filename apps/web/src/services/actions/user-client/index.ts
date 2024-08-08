import { createActionClient } from '../lib'
import { createContext } from './create-context'
import { createOnExecute } from './create-on-execute'

export const client = createActionClient({
  context: createContext,
  onExecute: createOnExecute,
})
