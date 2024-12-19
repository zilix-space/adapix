import { getCurrentUser } from '@/services/session/get-current-user'
import { redirect } from 'next/navigation'

export const createContext = async () => {
  const session = await getCurrentUser()
  if (!session || session.role !== 'ADMIN') return redirect('/')
  return session
}
