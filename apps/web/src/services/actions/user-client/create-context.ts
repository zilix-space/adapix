import { getCurrentUser } from '@/services/session/get-current-user'

export const createContext = async () => {
  const user = await getCurrentUser()
  return {
    user,
  }
}
