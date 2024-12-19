# Database Package

This package contains the database configuration and schema for the Adapix application using Prisma ORM.

## Structure

```
/packages/db/
├── prisma/
│   ├── migrations/     # Database migrations history
│   └── schema.prisma  # Database schema definition
├── index.ts          # Database client and exports
└── package.json      # Package dependencies
```

## Models

### User
- Complete user management with authentication support
- Roles: USER, ADMIN
- Status: PENDING, ACTIVE, BLOCKED
- Includes settings and profile information

### Transaction
- Handles all financial transactions
- Types: DEPOSIT, WITHDRAW
- Status tracking: PENDING_DEPOSIT, PENDING_EXCHANGE, PENDING_PAYMENT, COMPLETED, EXPIRED
- Tracks amounts, currencies, and exchange information

### Authentication Models
- Account: OAuth provider accounts
- Session: User sessions management
- VerificationToken: Email verification

## Setup

1. Make sure you have PostgreSQL installed and running
2. Configure your environment variables:
   ```env
   POSTGRES_URL=your_connection_string
   POSTGRES_URL_NON_POOLING=your_direct_connection_string
   ```

## Usage

```typescript
import { db } from '@adapix/db'

// Example: Create a new user
const user = await db.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    role: 'USER',
    status: 'PENDING'
  }
})
```

## Database Schema Updates

1. Edit the `schema.prisma` file
2. Run migrations:
   ```bash
   pnpm prisma migrate dev
   ```
3. Generate Prisma Client:
   ```bash
   pnpm prisma generate
   ``` 