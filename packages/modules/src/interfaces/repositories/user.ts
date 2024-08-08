import { UserStatus } from '@app/db'
import { User, UserSettings } from '../../domain/entities/User'
import { DeepPartial } from '../../infrastructure/json-parser/json-parser'

export interface UpdateUserDTO {
  name?: string
  username?: string
  image?: string
  status?: UserStatus
  settings?: UserSettings
}

export interface IUserRepository {
  getById: (id: string) => Promise<User>
  getByUsername: (username: string) => Promise<User>
  update: (id: string, data: DeepPartial<UpdateUserDTO>) => Promise<User>
}
