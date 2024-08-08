import { User as UserModel } from '@app/modules/src/domain/entities/User'

import 'next-auth/jwt'

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}

declare module 'next-auth' {
  interface Session {
    user: UserModel
  }
}

declare module 'next-auth' {
  interface User extends UserModel {}
}
