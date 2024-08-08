import { PrismaClient } from '@prisma/client'
import {
  IUserRepository,
  UpdateUserDTO,
} from '../../../interfaces/repositories/user'
import { User } from '../../../domain/entities/User'
import { DeepPartial } from '../../json-parser/json-parser'

export class PrismaUserRepository implements IUserRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async getById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return this.toDomain(user)
  }

  async getByUsername(username: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { username },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return this.toDomain(user)
  }

  async update(id: string, data: DeepPartial<UpdateUserDTO>): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        username: data.username,
        image: data.image,
        settings: data.settings,
      },
    })

    return this.toDomain(updatedUser)
  }

  private toDomain(model: any): User {
    return {
      id: model.id,
      email: model.email,
      name: model.name,
      emailVerified: model.emailVerified,
      username: model.username,
      settings: model.settings,
      status: model.status,
      image: model.image,
      transactions: model.transactions || [],
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
