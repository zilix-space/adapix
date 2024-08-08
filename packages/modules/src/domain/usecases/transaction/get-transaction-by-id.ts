import { IExchangeProvider } from '../../../interfaces/providers/exchange'
import { IFiatProvider } from '../../../interfaces/providers/fiat'
import { ITransactionRepository } from '../../../interfaces/repositories/transaction'
import { Transaction } from '../../entities/Transaction'

export class GetTransactionByIdUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly fiatExchangeProvider: IFiatProvider,
    private readonly exchangeProvider: IExchangeProvider,
  ) {}

  async execute({
    transactionId,
  }: {
    transactionId: string
  }): Promise<Transaction> {
    console.log('Fetching transaction by ID:', transactionId)
    let transaction = await this.transactionRepository.getById(transactionId)
    console.log('Transaction fetched:', transaction)

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    if (transaction.status === 'COMPLETED') {
      console.log('Transaction is already completed:', transaction)
      return transaction
    }

    if (transaction.status === 'EXPIRED') {
      console.log('Transaction is already expired:', transaction)
      return transaction
    }

    if (transaction.type === 'WITHDRAW') {
      console.log('Transaction type is WITHDRAW')
      const exchange = await this.exchangeProvider.getExchange(
        transaction.exchangeId,
      )
      console.log('Exchange fetched:', exchange)

      transaction = await this.transactionRepository.update(transaction.id, {
        status: exchange.status,
      })
      console.log('Transaction updated with exchange status:', transaction)

      if (transaction.status === 'PENDING_PAYMENT') {
        console.log('Transaction status is PENDING_PAYMENT')
        const fiatExchange = await this.fiatExchangeProvider.getExchange(
          transaction.paymentId,
        )
        console.log('Fiat exchange fetched:', fiatExchange)

        if (fiatExchange.status !== 'COMPLETED') {
          console.log(
            'Fiat exchange status is not COMPLETED:',
            fiatExchange.status,
          )
          return transaction
        }

        transaction = await this.transactionRepository.update(transaction.id, {
          status: fiatExchange.status,
        })
        console.log(
          'Transaction updated with fiat exchange status:',
          transaction,
        )
      }
    }

    if (transaction.type === 'DEPOSIT') {
      console.log('Transaction type is DEPOSIT')
      const fiatExchange = await this.fiatExchangeProvider.getExchange(
        transaction.paymentId,
      )
      console.log('Fiat exchange fetched:', fiatExchange)

      if (fiatExchange.status !== 'COMPLETED') {
        console.log(
          'Fiat exchange status is not COMPLETED:',
          fiatExchange.status,
        )
        return transaction
      }

      transaction = await this.transactionRepository.update(transaction.id, {
        status: 'PENDING_EXCHANGE',
      })
      console.log('Transaction updated with fiat exchange status:', transaction)

      const exchange = await this.exchangeProvider.getExchange(
        transaction.exchangeId,
      )
      console.log('Exchange fetched:', exchange)

      if (exchange.status !== 'COMPLETED') {
        console.log('Exchange status is PENDING_DEPOSIT')
        return transaction
      }

      transaction = await this.transactionRepository.update(transaction.id, {
        status: exchange.status,
      })
      console.log('Transaction updated with exchange status:', transaction)
    }

    console.log('Final transaction:', transaction)
    return transaction
  }
}
