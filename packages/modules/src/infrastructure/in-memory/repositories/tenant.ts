import {
  ITenantRepository,
  CreateTenantDTO,
  UpdateTenantDTO,
} from '../../../interfaces/repositories/tenant'
import { Tenant } from '../../../domain/entities/Tenant'
import { NodeUUIDProvider } from '../../uuid/node-uuid'

export class InMemoryTenantRepository implements ITenantRepository {
  private tenants: Tenant[] = []

  async create(data: CreateTenantDTO): Promise<Tenant> {
    const newTenant: Tenant = {
      id: NodeUUIDProvider.generate(),
      name: data.name,
      slug: data.slug,
      settings: {
        billing: {
          email: '',
        },
        emails: {
          usageExceededSentAt: '',
        },
        integrations: {
          slack: {
            url: '',
          },
          discord: {
            url: '',
          },
          webhook: {
            url: '',
          },
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.tenants.push(newTenant)
    return newTenant
  }

  async getBySlug(slug: string): Promise<Tenant | undefined> {
    return this.tenants.find((tenant) => tenant.slug === slug)
  }

  async getById(tenantId: string): Promise<Tenant | undefined> {
    return this.tenants.find((tenant) => tenant.id === tenantId)
  }

  async update(
    tenantId: string,
    data: Partial<UpdateTenantDTO>,
  ): Promise<Tenant> {
    const tenantIndex = this.tenants.findIndex(
      (tenant) => tenant.id === tenantId,
    )

    if (tenantIndex === -1) {
      throw new Error('Tenant not found or user not authorized')
    }

    const tenant = this.tenants[tenantIndex]

    const updatedTenant: Tenant = {
      ...tenant,
      ...data,
      settings: {
        ...tenant.settings,
        ...data.settings,
      },
      updatedAt: new Date(),
    }

    this.tenants[tenantIndex] = updatedTenant
    return updatedTenant
  }
}
