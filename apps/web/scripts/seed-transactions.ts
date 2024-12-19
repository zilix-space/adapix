import { db, UserStatus } from '@app/db'
import { faker } from '@faker-js/faker'
import 'dotenv/config'
import { TransactionStatus, TransactionType } from '@prisma/client'

/**
 * Constants for exchange rates and amounts
 */
const EXCHANGE_RATES = {
  ADA_TO_BRL: 6, // 1 ADA = 6 BRL
}

/**
 * Generate a random transaction amount for deposits (in BRL)
 * @returns number
 */
function generateDepositAmount(): number {
  return faker.number.float({ min: 100, max: 10000, fractionDigits: 2 })
}

/**
 * Generate a random transaction amount for withdrawals (in ADA)
 * @returns number
 */
function generateWithdrawAmount(): number {
  return faker.number.float({ min: 10, max: 1000, fractionDigits: 2 })
}

/**
 * Generate a random completed transaction
 * @param userId - ID of the user to create transaction for
 * @returns Transaction object
 */
function generateTransaction(userId: string) {
  const type = faker.helpers.arrayElement([
    TransactionType.DEPOSIT,
    TransactionType.WITHDRAW,
  ])

  let fromAmount: number
  let toAmount: number

  if (type === TransactionType.DEPOSIT) {
    fromAmount = generateDepositAmount() // BRL amount
    toAmount = fromAmount / EXCHANGE_RATES.ADA_TO_BRL // Convert to ADA
  } else {
    fromAmount = generateWithdrawAmount() // ADA amount
    toAmount = fromAmount * EXCHANGE_RATES.ADA_TO_BRL // Convert to BRL
  }

  return {
    userId,
    status: TransactionStatus.COMPLETED,
    type,
    fromAmount,
    toAmount,
    fromCurrency: type === TransactionType.DEPOSIT ? 'BRL' : 'ADA',
    toCurrency: type === TransactionType.DEPOSIT ? 'ADA' : 'BRL',
    exchangeId: faker.string.uuid(),
    exchangeAddress: faker.finance.ethereumAddress(),
    paymentId: faker.string.uuid(),
    paymentAddress: faker.finance.accountNumber(),
    addressToReceive: faker.finance.ethereumAddress(),
    completedAt: faker.date.recent({ days: 30 }), // ~30 days
    expiresAt: faker.date.soon({ refDate: new Date(), days: 1 }), // ~1 day
    createdAt: faker.date.recent({ days: 30 }),
    updatedAt: faker.date.recent({ days: 30 }),
  }
}

/**
 * Create test transactions for existing users
 */
async function seedTransactions() {
  try {
    // Get all existing users
    const users = await db.user.findMany({
      select: { id: true },
      where: {
        status: UserStatus.ACTIVE,
      },
    })

    if (users.length === 0) {
      console.log('No users found. Please run the seed:users script first.')
      return
    }

    console.log(`Found ${users.length} users. Creating transactions...`)

    // Create 5-15 transactions for each user
    for (const user of users) {
      const transactionsCount = faker.number.int({ min: 5, max: 15 })

      for (let i = 0; i < transactionsCount; i++) {
        const transaction = generateTransaction(user.id)
        await db.transaction.create({
          data: transaction,
        })
      }

      console.log(
        `Created ${transactionsCount} transactions for user ${user.id}`,
      )
    }

    const totalTransactions = await db.transaction.count()
    console.log(`\nSuccessfully created ${totalTransactions} transactions!`)
  } catch (error) {
    console.error('Error seeding transactions:', error)
  }
}

// Run the seed function
seedTransactions()
