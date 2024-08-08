import Stripe from 'stripe'

import {
  IPaymentProvider,
  UpsertCustomerDTO,
  CreateSubscriptionDTO,
  CreateCheckoutSessionDTO,
  CreateCustomerPortalSessionDTO,
  PaymentProviderSubscription,
  PaymentProviderCustomer,
  PaymentProviderCreatePlanDTO,
} from '../../interfaces/providers/payment'

export class StripePaymentProvider implements IPaymentProvider {
  stripe: Stripe

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2024-04-10',
    })
  }

  async upsertCustomer(
    dto: UpsertCustomerDTO,
  ): Promise<PaymentProviderCustomer> {
    const { name, email } = dto
    const customers = await this.stripe.customers.list({ email })
    if (customers.data.length === 0) {
      const customer = await this.stripe.customers.create({
        name,
        email,
      })

      return {
        id: customer.id,
      }
    } else {
      const customer = await this.stripe.customers.update(
        customers.data[0].id,
        {
          name,
        },
      )

      return {
        id: customer.id,
      }
    }
  }

  async createSubscription(
    dto: CreateSubscriptionDTO,
  ): Promise<PaymentProviderSubscription> {
    const { customerId, planId } = dto

    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId }],
    })

    return {
      paymentProviderId: subscription.id,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: this.parseDate(subscription.cancel_at),
      canceledAt: this.parseDate(subscription.canceled_at),
      currentPeriodStart: this.parseDate(subscription.current_period_start),
      currentPeriodEnd: this.parseDate(subscription.current_period_end),
      endedAt: this.parseDate(subscription.ended_at),
      trialStart: this.parseDate(subscription.trial_start),
      trialEnd: this.parseDate(subscription.trial_end),
      createdAt: this.parseDate(subscription.created),
      priceId: subscription.items.data[0].price.id,
    }
  }

  async createCheckoutSession(dto: CreateCheckoutSessionDTO): Promise<string> {
    const subscription = await this.stripe.subscriptionItems.list({
      subscription: dto.subscriptionId,
      limit: 1,
    })

    const stripeSession = await this.stripe.billingPortal.sessions.create({
      customer: dto.customerId,
      return_url: dto.successUrl,
      flow_data: {
        type: 'subscription_update_confirm',
        after_completion: {
          type: 'redirect',
          redirect: {
            return_url: dto.successUrl,
          },
        },
        subscription_update_confirm: {
          subscription: dto.subscriptionId,
          items: [
            {
              id: subscription.data[0].id,
              price: dto.priceId,
              quantity: 1,
            },
          ],
        },
      },
    })

    return stripeSession.url
  }

  async createCustomerPortalSession(
    dto: CreateCustomerPortalSessionDTO,
  ): Promise<string> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: dto.customerId,
      return_url: dto.returnUrl,
    })

    return session.url
  }

  async getSubscription(
    subscriptionId: string,
  ): Promise<PaymentProviderSubscription | undefined> {
    const subscription =
      await this.stripe.subscriptions.retrieve(subscriptionId)

    if (!subscription) return undefined

    return {
      paymentProviderId: subscription.id,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: this.parseDate(subscription.cancel_at),
      canceledAt: this.parseDate(subscription.canceled_at),
      currentPeriodStart: this.parseDate(subscription.current_period_start),
      currentPeriodEnd: this.parseDate(subscription.current_period_end),
      endedAt: this.parseDate(subscription.ended_at),
      trialStart: this.parseDate(subscription.trial_start),
      trialEnd: this.parseDate(subscription.trial_end),
      createdAt: this.parseDate(subscription.created),
      priceId: subscription.items.data[0].price.id,
    }
  }

  async createPlan(
    data: PaymentProviderCreatePlanDTO,
  ): Promise<Stripe.Product> {
    const priceMonth = data.prices.find(
      (price) => price.recurring.interval === 'month',
    )

    if (!priceMonth) {
      throw new Error('Monthly pricing data is missing for this plan.')
    }

    const product = await this.stripe.products.create({
      name: data.name,
      description: data.description,
      default_price_data: {
        currency: priceMonth.currency,
        unit_amount: priceMonth.unit_amount,
        recurring: {
          interval: priceMonth.recurring?.interval,
        },
      },
      metadata: data.metadata,
    })

    const pricesWithoutMonth = data.prices.filter(
      (price) => price.recurring.interval !== 'month',
    )

    for (const price of pricesWithoutMonth) {
      await this.stripe.prices.create({
        product: product.id,
        currency: price.currency,
        unit_amount: price.unit_amount,
        recurring: {
          interval: price.recurring.interval,
        },
      })
    }

    return product
  }

  private parseDate(timestamp: number | null): Date | null {
    return timestamp ? new Date(timestamp * 1000) : null
  }
}
