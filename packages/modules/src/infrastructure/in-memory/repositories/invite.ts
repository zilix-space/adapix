import {
  IInviteRepository,
  CreateInviteDTO,
  UpdateInviteDTO,
} from '../../../interfaces/repositories/invite'
import { Invite } from '../../../domain/entities/Invite'
import { NodeUUIDProvider } from '../../uuid/node-uuid'

export class InMemoryInviteRepository implements IInviteRepository {
  private invites: Invite[] = []

  async create(tenantId: string, data: CreateInviteDTO): Promise<Invite> {
    const newInvite: Invite = {
      id: NodeUUIDProvider.generate(),
      tenantId,
      email: data.email,
      role: data.role,
      expiresAt: data.expiresAt,
      acceptedAt: data.acceptedAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.invites.push(newInvite)
    return newInvite
  }

  async update(id: string, data: Partial<UpdateInviteDTO>): Promise<Invite> {
    const inviteIndex = this.invites.findIndex((invite) => invite.id === id)
    if (inviteIndex === -1) {
      throw new Error('Invite not found')
    }
    const updatedInvite = {
      ...this.invites[inviteIndex],
      ...data,
      updatedAt: new Date(),
    }
    this.invites[inviteIndex] = updatedInvite
    return updatedInvite
  }

  async delete(id: string): Promise<void> {
    this.invites = this.invites.filter((invite) => invite.id !== id)
  }

  async getById(id: string): Promise<Invite | null> {
    const invite = this.invites.find((invite) => invite.id === id)
    return invite || null
  }

  async list(tenantId: string): Promise<Invite[]> {
    return this.invites.filter((invite) => invite.tenantId === tenantId)
  }

  async getByEmailAndTenantId(
    email: string,
    tenantId: string,
  ): Promise<Invite | null> {
    return (
      this.invites.find(
        (invite) => invite.email === email && invite.tenantId === tenantId,
      ) || null
    )
  }
}
