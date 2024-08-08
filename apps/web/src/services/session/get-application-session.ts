import { cache } from 'react'
import { getCurrentUser } from './get-current-user'

export const getApplicationSession = cache(async () => {
  const user = await getCurrentUser()

  return {
    user,
  }
})
