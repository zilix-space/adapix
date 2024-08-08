import { IExchangeProvider } from '../../../interfaces/providers/exchange'
import { IFiatProvider } from '../../../interfaces/providers/fiat'
import { ITransactionRepository } from '../../../interfaces/repositories/transaction'
import { IUserRepository } from '../../../interfaces/repositories/user'
import { Transaction } from '../../entities/Transaction'

export class CreateTransactionUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly fiatExchangeProvider: IFiatProvider,
    private readonly exchangeProvider: IExchangeProvider,
  ) {}

  async execute({
    userId,
    type,
    amount,
    address,
  }: {
    userId: string
    type: 'buy' | 'sell'
    amount: number
    address: string
  }): Promise<Transaction> {
    const EXPIRE_IN_15_MINUTES = 15 * 60

    const user = await this.userRepository.getById(userId)
    console.log('User fetched:', user)

    if (!user) {
      throw new Error('User not found')
    }

    if (type === 'sell') {
      const estimate = await this.exchangeProvider.getEstimateForExchange({
        amount,
        from: 'ada',
        to: 'usdttrc20',
      })
      console.log("Estimate for 'sell':", estimate)

      const fiatExchange = await this.fiatExchangeProvider.createExchange({
        address,
        amount: estimate.outAmount,
        type: 'sell',
        user: {
          email: user.email,
          document: user.settings.kyc.data.document?.replace(/\D/g, '') || '',
          phone: user.settings.contact.phone?.replace(/\D/g, '') || '',
          country: user.settings.kyc.data.address.country || 'BR',
          address: {
            street: user.settings.kyc.data.address.street as string,
            number: user.settings.kyc.data.address.number as string,
            zipCode: user.settings.kyc.data.address.zipCode as string,
          },
        },
      })
      console.log("Fiat exchange created for 'sell':", fiatExchange)

      if (!fiatExchange.address) {
        throw new Error('Failed to create fiat exchange')
      }

      const exchange = await this.exchangeProvider.createExchange({
        addressRecipient: fiatExchange.address,
        amount: fiatExchange.estimate.amountInCrypto,
        rateId: estimate.rateId,
      })
      console.log("Crypto exchange created for 'sell':", exchange)

      return this.transactionRepository.create({
        userId,
        type: 'WITHDRAW',
        fromCurrency: 'ADA',
        toCurrency: 'BRL',
        exchangeId: exchange.id,
        exchangeAddress: exchange.exchangeAddress,
        paymentId: fiatExchange.id,
        paymentAddress: fiatExchange.address,
        addressToReceive: address,
        fromAmount: amount,
        toAmount: Number(fiatExchange.estimate.sendInFiat),
        expiresAt: new Date(new Date().getTime() + EXPIRE_IN_15_MINUTES * 1000),
      })
    }

    const fiatEstimate = await this.fiatExchangeProvider.getEstimateForExchange(
      {
        type: 'sell',
        amount,
      },
    )
    console.log("Fiat estimate for 'buy':", fiatEstimate)

    const exchangeEstimate = await this.exchangeProvider.getEstimateForExchange(
      {
        amount: fiatEstimate.sendInCrypto,
        from: 'usdttrc20',
        to: 'ada',
      },
    )
    console.log("Exchange estimate for 'buy':", exchangeEstimate)

    const exchange = await this.exchangeProvider.createExchange({
      addressRecipient: address,
      amount: fiatEstimate.sendInCrypto,
      rateId: exchangeEstimate.rateId,
    })
    console.log("Crypto exchange created for 'buy':", exchange)

    const fiatExchange = await this.fiatExchangeProvider.createExchange({
      address: exchange.exchangeAddress,
      amount: fiatEstimate.totalInFiat,
      type: 'buy',
      user: {
        email: user.email,
        document: user.settings.kyc.data.document?.replace(/\D/g, '') || '',
        phone: user.settings.contact.phone || '',
        country: 'br',
        address: {
          street: user.settings.kyc.data.address.street as string,
          number: user.settings.kyc.data.address.number as string,
          zipCode: user.settings.kyc.data.address.zipCode as string,
        },
      },
    })
    console.log("Fiat exchange created for 'buy':", fiatExchange)

    return this.transactionRepository.create({
      userId,
      type: 'DEPOSIT',
      fromCurrency: 'BRL',
      toCurrency: 'ADA',
      exchangeId: exchange.id,
      exchangeAddress: exchange.exchangeAddress,
      paymentId: fiatExchange.id,
      paymentAddress: fiatExchange.address,
      addressToReceive: address,
      fromAmount: amount,
      toAmount: exchange.toAmount,
      expiresAt: new Date(new Date().getTime() + EXPIRE_IN_15_MINUTES * 1000),
    })
  }
}
