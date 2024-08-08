import {
  ISubscriptionRepository,
  SubscriptionCreateDTO,
  SubscriptionFirstDTO,
  SubscriptionUniqueDTO,
  SubscriptionUpdateDTO,
} from '../../../interfaces/repositories/subscription'
import { Subscription } from '../../../domain/entities/Subscription'

export class InMemorySubscriptionRepository implements ISubscriptionRepository {
  private subscriptions: Subscription[] = []

  async findUnique(dto: SubscriptionUniqueDTO): Promise<Subscription> {
    const subscription = this.subscriptions.find(
      (subscription) =>
        subscription.paymentProviderId === dto.paymentProviderId,
    )
    if (!subscription) {
      throw new Error('Subscription not found')
    }
    return subscription
  }

  async update(dto: SubscriptionUpdateDTO): Promise<Subscription> {
    const index = this.subscriptions.findIndex(
      (subscription) =>
        subscription.paymentProviderId === dto.paymentProviderId,
    )
    if (index === -1) {
      throw new Error('Subscription not found')
    }
    const updatedSubscription = { ...this.subscriptions[index], ...dto }
    this.subscriptions[index] = updatedSubscription
    return updatedSubscription
  }

  async findFirst(dto: SubscriptionFirstDTO): Promise<Subscription | null> {
    const subscription = this.subscriptions.find(
      (subscription) => subscription.tenantId === dto.tenantId,
    )
    return subscription || null
  }

  async create(dto: SubscriptionCreateDTO): Promise<Subscription> {
    const subscription: Subscription = {
      id: Math.random().toString(36).substring(2, 15),
      ...dto,
      status: dto.status || 'active', // Assuming 'active' as a default status to satisfy the Subscription entity requirement
      cancelAtPeriodEnd: dto.cancelAtPeriodEnd || false, // Ensuring cancelAtPeriodEnd is always a boolean
      createdAt: new Date(),
    }
    this.subscriptions.push(subscription)
    return subscription
  }
}
