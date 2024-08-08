import { ReturnTypeWithoutPromise } from '@/services/actions/lib/utils'
import { getApplicationSession } from '../get-application-session'

export type ApplicationSession = ReturnTypeWithoutPromise<
  typeof getApplicationSession
>
