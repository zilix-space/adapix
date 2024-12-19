# Transaction Management Module

This module provides administrative tools for monitoring and managing cryptocurrency transactions on the Adapix platform.

## Directory Structure

```
transactions/
├── _components/              # Transaction components
│   ├── transaction-table.tsx # Transaction list (client component que usa o data-table.tsx)
│   ├── transaction-filters.tsx # Search and filters (veja o users-filters.tsx para referencia)
│   ├── status-badge.tsx     # Status indicator
│   └── transaction-sheet.tsx # Sheet para visualizar os detalhes da transação
├── actions.ts               # List actions
└── page.tsx                # Transaction list page
```

## Features

### Transaction Monitoring
- [ ] Real-time transaction list
- [ ] Status tracking
- [ ] Amount monitoring
- [ ] Exchange rates
- [ ] Transaction flow visualization

### Transaction Management
- [ ] Status updates
- [ ] Manual intervention
- [ ] Payment verification
- [ ] Exchange tracking
- [ ] Error handling

### Analytics & Reporting
- [ ] Volume metrics
- [ ] Success rates
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] Custom reports

## User Stories

### Transaction Overview
As an administrator
I want to monitor all platform transactions
So that I can ensure smooth operations

Acceptance Criteria:
- View real-time transaction list
- Filter by status and type
- See transaction amounts and rates
- Monitor processing times
- Track success/failure rates
```

### Transaction Intervention
```
As an administrator
I want to intervene in problematic transactions
So that I can resolve issues quickly

Acceptance Criteria:
- Identify stuck transactions
- View detailed transaction info
- Take manual actions when needed
- Log all interventions
- Notify affected users

### Transaction Analysis
As an administrator
I want to analyze transaction patterns
So that I can optimize platform performance

Acceptance Criteria:
- View transaction metrics
- Generate custom reports
- Track error patterns
- Monitor volume trends
- Analyze user behavior

### Payment Verification
As an administrator
I want to verify payment status
So that I can ensure transaction completion

Acceptance Criteria:
- Check PIX payment status
- Verify blockchain transactions
- Confirm exchange rates
- Track payment timelines
- Handle payment issues

## Technical Requirements

### Real-time Monitoring
- [ ] WebSocket integration
- [ ] Status updates
- [ ] Rate monitoring
- [ ] Alert system

### Transaction Processing
- [ ] Payment verification
- [ ] Blockchain integration
- [ ] Exchange rate management
- [ ] Error recovery

### Data Management
- [ ] Real-time updates
- [ ] Historical data
- [ ] Performance metrics
- [ ] Audit logs

## Implementation Checklist

### Phase 1: Transaction List
- [ ] Create transaction table
- [ ] Implement filters
- [ ] Add real-time updates with a polling stategy with router.refresh()
- [ ] Setup sorting

### Phase 2: Transaction Details On Sheet
- [ ] Build detail view
- [ ] Add action buttons
- [ ] Implement status tracking

### Data Structures

```typescript
interface Transaction {
  id: string
  userId: string
  type: 'DEPOSIT' | 'WITHDRAW'
  status: 'PENDING_DEPOSIT' | 'PENDING_EXCHANGE' | 'PENDING_PAYMENT' | 'COMPLETED' | 'EXPIRED'
  fromAmount: number
  toAmount: number
  fromCurrency: string
  toCurrency: string
  exchangeId: string
  exchangeAddress: string
  paymentId: string
  paymentAddress: string
  addressToReceive: string
  completedAt?: Date
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

interface TransactionMetrics {
  totalVolume: number
  successRate: number
  averageTime: number
  errorRate: number
  activeTransactions: number
}
```