import {
  IPlanPriceRepository,
  PlanPriceCreateDTO,
  PlanPriceUpdateDTO,
  PlanPriceFindDTO,
} from '../../../interfaces/repositories/plan-price'
import { PlanPrice } from '../../../domain/entities/PlanPrice'

export class InMemoryPlanPriceRepository implements IPlanPriceRepository {
  private planPrices: PlanPrice[] = []

  async create(dto: PlanPriceCreateDTO): Promise<PlanPrice> {
    const planPrice: PlanPrice = {
      id: Math.random().toString(36).substring(2, 15),
      ...dto,
    }
    this.planPrices.push(planPrice)
    return planPrice
  }

  async update(dto: PlanPriceUpdateDTO): Promise<PlanPrice> {
    const index = this.planPrices.findIndex(
      (planPrice) => planPrice.id === dto.id,
    )
    if (index === -1) {
      throw new Error('PlanPrice not found')
    }
    const updatedPlanPrice = { ...this.planPrices[index], ...dto }
    this.planPrices[index] = updatedPlanPrice
    return updatedPlanPrice
  }

  async findUnique(dto: PlanPriceFindDTO): Promise<PlanPrice | null> {
    const planPrice = this.planPrices.find(
      (planPrice) => planPrice.id === dto.id,
    )
    return planPrice || null
  }

  async getById(id: string): Promise<PlanPrice | null> {
    const planPrice = this.planPrices.find((planPrice) => planPrice.id === id)
    return planPrice || null
  }

  async getByProviderId(providerId: string): Promise<PlanPrice | null> {
    const planPrice = this.planPrices.find(
      (planPrice) => planPrice.paymentProviderId === providerId,
    )
    return planPrice || null
  }
}
