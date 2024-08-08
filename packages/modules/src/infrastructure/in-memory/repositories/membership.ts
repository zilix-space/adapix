import {
  IMembershipRepository,
  CreateMembershipDTO,
  UpdateMembershipDTO,
} from '../../../interfaces/repositories/membership'
import { Membership } from '../../../domain/entities/Membership'
import { NodeUUIDProvider } from '../../uuid/node-uuid'

export class InMemoryMembershipRepository implements IMembershipRepository {
  private memberships: Membership[] = []

  async list(tenantId: string): Promise<Membership[]> {
    return this.memberships.filter(
      (membership) => membership.tenantId === tenantId,
    )
  }

  async delete(tenantId: string): Promise<void> {
    this.memberships = this.memberships.filter(
      (membership) => membership.tenantId !== tenantId,
    )
  }

  async create(data: CreateMembershipDTO): Promise<Membership> {
    const newMembership: Membership = {
      id: NodeUUIDProvider.generate(),
      tenantId: data.tenantId,
      userId: data.userId,
      role: data.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.memberships.push(newMembership)
    return newMembership
  }

  async update(id: string, data: UpdateMembershipDTO): Promise<Membership> {
    const membershipIndex = this.memberships.findIndex(
      (membership) => membership.id === id,
    )
    if (membershipIndex === -1) {
      throw new Error('Membership not found')
    }
    const updatedMembership = {
      ...this.memberships[membershipIndex],
      ...data,
      updatedAt: new Date(),
    }
    this.memberships[membershipIndex] = updatedMembership
    return updatedMembership
  }

  async getById(membershipId: string): Promise<Membership> {
    const membership = this.memberships.find(
      (membership) => membership.id === membershipId,
    )
    if (!membership) {
      throw new Error('Membership not found')
    }
    return membership
  }

  async getByUserOnTenant(
    userId: string,
    tenantId: string,
  ): Promise<Membership> {
    const membership = this.memberships.find(
      (membership) =>
        membership.userId === userId && membership.tenantId === tenantId,
    )
    if (!membership) {
      throw new Error('Membership not found')
    }
    return membership
  }
}
