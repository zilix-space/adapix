import { getApplicationSession } from '@/services/session/get-application-session'

export const createContext = async () => {
  const session = await getApplicationSession()
  return session
}
