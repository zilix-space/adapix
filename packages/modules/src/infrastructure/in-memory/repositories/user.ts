import { IUserRepository } from '../../../interfaces/repositories/user'
import { User } from '../../../domain/entities/User'

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = []

  async getById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  async getByUsername(username: string): Promise<User> {
    const user = this.users.find((user) => user.username === username)
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const updatedUser = { ...this.users[userIndex], ...data }
    this.users[userIndex] = updatedUser

    return updatedUser
  }
}
