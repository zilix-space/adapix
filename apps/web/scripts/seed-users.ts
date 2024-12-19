import { db } from '@app/db'
import { faker } from '@faker-js/faker'

import 'dotenv/config'

/**
 * Generate a random user settings object
 */
function generateUserSettings() {
  return {
    contact: {
      phone: faker.phone.number(),
      telegram: faker.internet.userName(),
    },
    utms: {
      utm_source: faker.helpers.arrayElement(['google', 'facebook', 'twitter']),
      utm_medium: faker.helpers.arrayElement(['cpc', 'organic', 'social']),
      utm_campaign: faker.helpers.arrayElement([
        'summer_sale',
        'black_friday',
        'launch',
      ]),
    },
    payment: {
      pix: faker.finance.accountNumber(),
      wallet: faker.finance.ethereumAddress(),
    },
    kyc: {
      status: 'submitted',
      data: {
        name: faker.person.fullName(),
        document: faker.string.numeric(11),
        birthdate: faker.date.past({ years: 30 }).toISOString().split('T')[0],
        address: {
          country: 'Brazil',
          state: faker.location.state(),
          city: faker.location.city(),
          neighborhood: faker.location.street(),
          complement: faker.location.secondaryAddress(),
          zipCode: faker.location.zipCode('#####-###'),
          street: faker.location.street(),
          number: faker.string.numeric(3),
        },
        attachments: {
          selfie: faker.image.avatar(),
          selfieWithDocument: faker.image.avatar(),
          documentFront: faker.image.avatar(),
          documentBack: faker.image.avatar(),
        },
      },
    },
  }
}

/**
 * Create test users with pending KYC
 */
async function seedUsers() {
  try {
    // Create 20 test users
    const usersToCreate = 20

    for (let i = 0; i < usersToCreate; i++) {
      const email = faker.internet.email().toLowerCase()
      const name = faker.person.fullName()

      await db.user.create({
        data: {
          email,
          name,
          username: faker.internet.userName(),
          status: 'PENDING',
          role: 'USER',
          image: faker.image.avatar(),
          settings: generateUserSettings(),
          emailVerified: faker.date.recent(),
        },
      })

      console.log(`Created user: ${email}`)
    }

    console.log(`\nSuccessfully created ${usersToCreate} test users!`)
  } catch (error) {
    console.error('Error seeding users:', error)
  }
}

// Run the seed function
seedUsers()
