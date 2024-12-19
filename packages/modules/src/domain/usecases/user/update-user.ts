import {
  DeepPartial,
  JsonParserDateObject,
} from '../../../infrastructure/json-parser/json-parser'
import {
  userSettingsDefault,
  userSettingsSchema,
} from '../../../infrastructure/json-parser/jsons/user'
import {
  IUserRepository,
  UpdateUserDTO,
} from '../../../interfaces/repositories/user'
import { UserSettings } from '../../entities/User'
import { AppError } from '../../../types/app-error'

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, data: DeepPartial<UpdateUserDTO>): Promise<void> {
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw new AppError('User not found', 404)
    }

    let settings = user.settings

    if (data.settings) {
      const parsedSettings = JsonParserDateObject.parse({
        schema: userSettingsSchema,
        data: {
          default: userSettingsDefault,
          current: user.settings,
          upsert: data.settings,
        },
      })

      if (parsedSettings.success === false) {
        throw new AppError('User settings are invalid', 400)
      }

      settings = parsedSettings.data as UserSettings
    }

    await this.userRepository.update(id, {
      name: data.name,
      username: data.username,
      image: data.image,
      status: data.status,
      settings,
    })
  }
}
