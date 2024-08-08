import { db } from '@app/db'
import { PrismaUserRepository } from './infrastructure/repositories/prisma/user'
import { DOSpacesStorageProvider } from './infrastructure/storage/digital-ocean-spaces'
import { StripePaymentProvider } from './infrastructure/payment/stripe-payment'
import { UpdateUserUseCase } from './domain/usecases/user/update-user'
import { GetUserByIdUseCase } from './domain/usecases/user/get-user'
import { ResendProvider } from './infrastructure/mail/resend-mail'
import { EstimateTransactionUseCase } from './domain/usecases/transaction/estimate-transaction'
import { CreateTransactionUseCase } from './domain/usecases/transaction/create-transaction'
import { SmartPayFiatProvider } from './infrastructure/fiat/smartpay-fiat-provider'
import { SimpleSwapExchangeProvider } from './infrastructure/exchange/simpleswap-exchange-provider'
import { PrismaTransactionRepository } from './infrastructure/repositories/prisma/transaction'
import { GetTransactionByIdUseCase } from './domain/usecases/transaction/get-transaction-by-id'
import { ListTransactionsUseCase } from './domain/usecases/transaction/list-transaction'
import { CoingeckoMarketProvider } from './infrastructure/market/coingeko'

// REPOSITORIES
const userRepository = new PrismaUserRepository(db)
const transactionRepository = new PrismaTransactionRepository(db)

// PROVIDER
const mailProvider = new ResendProvider()
const storageProvider = new DOSpacesStorageProvider()
const paymentProvider = new StripePaymentProvider()
const fiatProvider = new SmartPayFiatProvider()
const exchangeProvider = new SimpleSwapExchangeProvider()
const marketProvider = new CoingeckoMarketProvider()

export const modules = {
  usecases: {
    transaction: {
      getTransactionById: new GetTransactionByIdUseCase(
        transactionRepository,
        fiatProvider,
        exchangeProvider,
      ),
      estimateTransaction: new EstimateTransactionUseCase(
        fiatProvider,
        exchangeProvider,
        marketProvider,
      ),
      createTransaction: new CreateTransactionUseCase(
        userRepository,
        transactionRepository,
        fiatProvider,
        exchangeProvider,
      ),
      listTransactions: new ListTransactionsUseCase(transactionRepository),
    },
    user: {
      updateUser: new UpdateUserUseCase(userRepository),
      getUserById: new GetUserByIdUseCase(userRepository),
    },
  },
  provider: {
    mail: mailProvider,
    storage: storageProvider,
    payment: paymentProvider,
    market: marketProvider,
  },
}
