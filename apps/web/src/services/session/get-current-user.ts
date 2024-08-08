'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/config'
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const session = await getServerSession(authOptions)
  return session?.user
})
