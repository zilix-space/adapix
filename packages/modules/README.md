# Modules Package

This package implements the core business logic of the Adapix application following Clean Architecture principles.

## Structure

```
/packages/modules/
└── src/
    ├── domain/           # Core business logic
    │   ├── entities/     # Business entities
    │   └── usecases/     # Application use cases
    ├── infrastructure/   # External implementations
    ├── interfaces/       # Contracts and protocols
    └── types/           # Shared types and errors
```

## Domain Layer

### Entities

#### User Entity
- Core user management with authentication
- Status: PENDING, ACTIVE, BLOCKED
- Settings Configuration:
  - Contact Information (phone, telegram)
  - UTM Tracking
  - Payment Methods (PIX, wallet)
  - KYC Management:
    - Status: pending, approved, rejected, submitted
    - Personal Information
    - Address Details
    - Required Documents:
      - Selfie
      - Selfie with Document
      - Document Front
      - Document Back

#### Transaction Entity
- Status Flow:
  - PENDING_DEPOSIT: Initial state for buy operations
  - PENDING_EXCHANGE: Waiting for exchange processing
  - PENDING_PAYMENT: Processing payment
  - COMPLETED: Transaction finished
  - EXPIRED: Transaction timeout (15 minutes)
- Types: DEPOSIT (buy), WITHDRAW (sell)
- Tracks:
  - Amount and currency pairs
  - Exchange details (ID, address)
  - Payment information
  - Wallet address for receiving
  - Timestamps (completion, expiration)

### Use Cases

#### Transaction Management
- **Create Transaction**
  - Handles both buy and sell operations
  - Integrates with fiat and crypto exchange providers
  - Manages transaction flow with 15-minute expiration
  - Supports ADA/BRL currency pairs
  - Handles user KYC data validation

- **Estimate Transaction**
  - Calculates transaction estimates for both buy and sell
  - Integrates market prices for ADA/BRL
  - Includes fee calculations (network + exchange fees)
  - Supports USDT as intermediate currency

- **Get Transaction by ID**
  - Retrieves detailed transaction information

- **List Transactions**
  - Fetches user transaction history

#### User Management
- **Get User**
  - Retrieves user profile and settings
- **Update User**
  - Manages user profile updates

## Infrastructure Layer

### Providers

#### Exchange Provider (ChangeNow.io)
- Handles crypto-to-crypto exchanges
- Status mapping:
  - new/waiting/confirming -> PENDING_DEPOSIT
  - exchanging -> PENDING_EXCHANGE
  - sending -> PENDING_PAYMENT
  - finished -> COMPLETED
  - expired -> EXPIRED
- Requires: `SIMPLESWAP_API_KEY`

#### Fiat Provider (SmartPay)
- Handles BRL/USDT operations
- Different endpoints for:
  - Buy: `/swapix/pixlinkverify`
  - Sell: `/swapix/chainlink`
- Requires: `SMARTPAY_API_USER` and `SMARTPAY_API_SECRET`
- Includes KYC validation

#### Market Provider (CoinGecko)
- Fetches real-time crypto prices
- Caches prices for 1 hour
- No API key required for basic usage
- Used for ADA/BRL price calculations

#### Mail Provider
- Two implementations:
  - Resend.com (primary): Modern email API
  - Nodemailer (backup): Traditional SMTP
- Simple interface for sending emails:
  - from, to, subject, body
- Requires: `RESEND_API_KEY` for Resend.com

#### Storage Provider (DigitalOcean Spaces)
- Handles file storage (KYC documents)
- Compatible with AWS S3 API

### Repositories
- Prisma implementations for:
  - Transaction repository
  - User repository
- In-memory implementations for:
  - Invite
  - Membership
  - Place price
  - Plan
  - Subscription
  - Tenant
  - User

### Utils

#### JSON Parser
- **Purpose**: Safe handling of nested object updates
- **Features**:
  - Deep object comparison and merging
  - Schema validation using Zod
  - Handles arrays and nested objects
  - Empty string to undefined conversion
  - Default value management
- **Use Cases**:
  - User settings updates
  - Tenant configuration changes
  - KYC data management
- **Validation**:
  - Schema-based validation
  - Type safety with TypeScript
  - Error handling for invalid updates

#### Other Utils
- Slug generator: URL-friendly string creation
- UUID generator: Unique identifier generation

## Interfaces Layer

### Provider Interfaces
- Exchange provider
- Fiat provider
- Mail provider
- Market provider
- Payment provider
- Storage provider

### Repository Interfaces

#### Transaction Repository
- **Operations**:
  - `create`: Creates new transaction with all required fields
  - `update`: Partially updates transaction by ID
  - `getById`: Retrieves single transaction
  - `list`: Lists all transactions, optionally filtered by user
- **Required Fields**:
  - User association
  - Transaction type (DEPOSIT/WITHDRAW)
  - Amount and currency pairs
  - Exchange and payment details
  - Wallet address
  - Expiration settings

#### User Repository
- **Operations**:
  - `getById`: Retrieves user by ID
  - `getByUsername`: Retrieves user by username
  - `update`: Updates user with partial data
- **Update Fields**:
  - Basic info (name, username, image)
  - Status management
  - Settings (deeply nested structure)
  - KYC information
  - Contact details

## Types

### Core Types
- `Transaction`: Full transaction entity type
- `User`: Complete user entity with settings
- `TransactionStatus`: Transaction state enum
- `TransactionType`: DEPOSIT/WITHDRAW enum
- `UserStatus`: User state enum

### Utility Types
- `DeepPartial<T>`: Recursive partial type for nested updates
  - Used for partial updates of nested objects
  - Handles arrays and objects recursively
  - Preserves type safety in deep updates
- `JsonData<T>`: Configuration data structure
  - Supports default values
  - Handles current state
  - Manages partial updates

## Usage

```typescript
import { modules } from '@app/modules'

// Example: Create a buy transaction
await modules.usecases.transaction.createTransaction.execute({
  userId: 'user-id',
  type: 'buy',
  amount: 100,
  address: 'ada-wallet-address'
})

// Example: Get transaction estimate
const estimate = await modules.usecases.transaction.estimateTransaction.execute({
  type: 'buy',
  amount: 100
})

// Example: Using providers
await modules.provider.mail.send({
  to: 'user@example.com',
  subject: 'Welcome',
  body: 'Welcome to Adapix!'
})
```

## Development

1. Implement new features in the domain layer first
2. Create interfaces for external dependencies
3. Implement concrete classes in the infrastructure layer
4. Wire everything together in the use cases