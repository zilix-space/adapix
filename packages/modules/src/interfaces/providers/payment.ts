import Stripe from 'stripe'

export interface UpsertCustomerDTO {
  name: string
  email: string
}

export interface CreateSubscriptionDTO {
  customerId: string
  planId: string
}

export interface CreateCheckoutSessionDTO {
  customerId: string
  subscriptionId: string
  priceId: string
  successUrl: string
  cancelUrl: string
}

export interface CreateCustomerPortalSessionDTO {
  customerId: string
  returnUrl: string
}

export interface PaymentProviderSubscription {
  paymentProviderId: string
  status: string
  cancelAtPeriodEnd: boolean
  cancelAt: Date | null
  canceledAt: Date | null
  currentPeriodStart: Date | null
  currentPeriodEnd: Date | null
  endedAt: Date | null
  trialStart: Date | null
  trialEnd: Date | null
  createdAt: Date | null
  priceId: string
}

export interface PaymentProviderCreatePlanDTO {
  name: string
  description: string
  metadata: Record<string, string>
  prices: {
    recurring: {
      interval: 'day' | 'week' | 'month' | 'year'
    }
    currency: 'usd' | 'brl'
    unit_amount: number
  }[]
}

export interface PaymentProviderCustomer {
  id: string
}

export interface IPaymentProvider {
  upsertCustomer(dto: UpsertCustomerDTO): Promise<PaymentProviderCustomer>
  createSubscription(
    dto: CreateSubscriptionDTO,
  ): Promise<PaymentProviderSubscription>
  getSubscription(
    subscriptionId: string,
  ): Promise<PaymentProviderSubscription | undefined>
  createCheckoutSession(dto: CreateCheckoutSessionDTO): Promise<string>
  createCustomerPortalSession(
    dto: CreateCustomerPortalSessionDTO,
  ): Promise<string>
  createPlan(dto: PaymentProviderCreatePlanDTO): Promise<Stripe.Product>
}
