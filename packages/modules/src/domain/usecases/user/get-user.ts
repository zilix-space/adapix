import { JsonParserDateObject } from '../../../infrastructure/json-parser/json-parser'
import {
  userSettingsDefault,
  userSettingsSchema,
} from '../../../infrastructure/json-parser/jsons/user'
import { SlugValueObject } from '../../../infrastructure/slug/value-object-slug'
import { IUserRepository } from '../../../interfaces/repositories/user'
import { User } from '../../entities/User'

export class GetUserByIdUseCase {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(id: string) {
    const user = await this.userRepository.getById(id)

    const settings = JsonParserDateObject.parse({
      schema: userSettingsSchema,
      data: {
        default: userSettingsDefault,
        current: user.settings,
      },
    })

    if (!user.username) {
      await this.userRepository.update(user.id, {
        username: SlugValueObject.createFromEmail(user.email),
      })
    }

    return {
      ...user,
      settings:
        settings.success === false ? userSettingsDefault : settings.data,
    } as User
  }
}
