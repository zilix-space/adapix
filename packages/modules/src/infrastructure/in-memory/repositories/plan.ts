import {
  IPlanRepository,
  PlanFindDTO,
  PlanUpsertDTO,
} from '../../../interfaces/repositories/plan'
import { Plan } from '../../../domain/entities/Plan'

export class InMemoryPlanRepository implements IPlanRepository {
  private plans: Plan[] = []

  async upsert(dto: PlanUpsertDTO): Promise<Plan> {
    const existingIndex = this.plans.findIndex(
      (plan) =>
        plan.paymentProviderId === dto.paymentProviderId &&
        plan.name === dto.name,
    )
    const plan: Plan = {
      id:
        existingIndex >= 0
          ? this.plans[existingIndex].id
          : Math.random().toString(36).substring(2, 15),
      paymentProviderId: dto.paymentProviderId,
      name: dto.name,
      metadata: dto.metadata,
      active: true,
    }

    if (existingIndex >= 0) {
      this.plans[existingIndex] = plan
    } else {
      this.plans.push(plan)
    }

    return plan
  }

  async findUnique(dto: PlanFindDTO): Promise<Plan> {
    const plan = this.plans.find((plan) => plan.id === dto.id)
    if (!plan) {
      throw new Error('Plan not found')
    }
    return plan
  }
}
