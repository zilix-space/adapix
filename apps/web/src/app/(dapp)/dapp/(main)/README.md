# Main dApp Module

This module represents the core functionality of the Adapix dApp, handling wallet integration, transactions, and user interactions.

## Directory Structure

```
(main)/
├── _components/                # Core components
│   ├── header-toolbar.tsx     # Top toolbar actions
│   ├── header-user-nav.tsx    # User navigation
│   ├── transaction-preview.tsx # Transaction preview
│   ├── wallet-alert.tsx       # Wallet notifications
│   ├── wallet-summary.tsx     # Balance display
│   ├── wallet-transaction-form.tsx # Transaction form
│   └── wallet-transaction-list.tsx # Transaction history
├── layout.tsx                 # Layout with auth/KYC checks
└── page.tsx                   # Main page assembly
```

## Core Features

### Transaction Management
- Buy and sell ADA using PIX
- Real-time price estimation
- Transaction limits:
  - Buy: Min R$60, Max R$200
  - Sell: Min ₳30, Max ₳100
- Transaction validation
- Balance checking

### Wallet Integration
- Multiple wallet support via MeshSDK
- Wallet connection management
- Balance tracking
- Address management
- Transaction signing

### User Interface
- Dynamic form updates
- Real-time validation
- Transaction previews
- Wallet summaries
- Transaction history

## Technical Implementation

### Page Structure
- Header with user navigation and toolbar
- Wallet summary section
- Transaction form
- Transaction history list
- Dynamic component loading for wallet features

### Components

#### HeaderToolbar
- Conditional rendering based on auth state
- Login button for unauthenticated users
- Support link for authenticated users
- Clean and minimal interface

#### WalletTransactionForm
- Type selection (buy/sell)
- Amount input with currency formatting
- Real-time validation
- Transaction preview
- Integration with wallet for transactions

#### WalletSummary
- User greeting
- Wallet balance display
- Wallet selection/connection
- Wallet switching functionality

#### TransactionPreview
- Real-time price updates
- Fee breakdown display
- 60-second validity countdown
- Loading skeleton states
- Formatted currency display
- Automatic refresh on expiry

#### WalletTransactionList
- Server-side transaction fetching
- Transaction status tracking:
  - PENDING_DEPOSIT: Orange indicator
  - PENDING_EXCHANGE: Blue indicator
  - PENDING_PAYMENT: Yellow indicator
  - COMPLETED: Green indicator
  - EXPIRED: Red indicator
- Transaction type icons:
  - Buy (DEPOSIT): Up arrow
  - Sell (WITHDRAW): Down arrow
- Detailed transaction information:
  - Amount and currency
  - Date and time
  - Status with color coding
- Empty state handling
- Clickable items linking to transaction details

#### HeaderUserNav
- User profile display with avatar
- Drawer-based navigation menu
- Main menu options:
  - My Account
  - PIX Key Management
  - Wallet Connection
  - Help Center
  - Logout
- Wallet switching interface:
  - List of installed wallets
  - Current wallet indicator
  - Easy wallet switching
  - Wallet icons and status

#### WalletAlert
- Fee notification display
- Promotional rate information
- Visual rate comparison
- Clean card-based design

### State Management

#### Wallet Context
- Current wallet state
- Installed wallets detection
- Connection management
- Transaction handling
- Balance updates

### Security Features
- KYC status verification
- Route protection
- Transaction validation
- Balance verification

## Integration Points

### With Blockchain
- Wallet connection via MeshSDK
- Transaction signing
- Balance checking
- Address management

### With Backend
- Transaction creation
- Price estimation
- User data management
- KYC verification

## Development Guidelines

### Adding New Features
1. Create components in `_components`
2. Update page layout if needed
3. Integrate with wallet context
4. Add necessary validations

### Best Practices
- Use TypeScript for type safety
- Implement proper error handling
- Add loading states
- Follow existing patterns
- Document new features

### Component Guidelines
- Use server components where possible
- Dynamic imports for wallet features
- Proper error boundaries
- Loading state handling

## Transaction Flow

### Buy Flow
1. User selects "Buy"
2. Enters amount (R$60-R$200)
3. Reviews preview
4. Confirms transaction
5. Redirected to transaction page

### Sell Flow
1. User selects "Sell"
2. Enters amount (₳30-₳100)
3. Balance verification
4. Wallet signs transaction
5. Redirected to transaction page

## Performance Considerations

### Optimization
- Dynamic imports for wallet components
- Real-time validation
- Cached responses
- Loading states

### Security Measures
- Input validation
- Transaction verification
- KYC checks
- Session validation

## User Experience

### Wallet Management
- Easy wallet connection
- Clear balance display
- Simple wallet switching
- Error feedback

### Transaction Interface
- Clear input validation
- Real-time previews
- Simple type switching
- Progress indication

### Error Handling
- Clear error messages
- Validation feedback
- Transaction failures
- Network issues

## Transaction States

### Status Flow
1. **PENDING_DEPOSIT**
   - Waiting for initial payment
   - Orange status indicator
   - User action required

2. **PENDING_EXCHANGE**
   - Processing the exchange
   - Blue status indicator
   - System processing

3. **PENDING_PAYMENT**
   - Finalizing transaction
   - Yellow status indicator
   - System processing

4. **COMPLETED**
   - Transaction successful
   - Green status indicator
   - Final state

5. **EXPIRED**
   - Transaction timeout
   - Red status indicator
   - Failed state

### Display Patterns
- Color-coded status indicators
- Clear status labels
- Transaction type icons
- Amount formatting by currency
- Timestamp formatting
- Interactive list items

## User Interface Features

### Profile Management
- Avatar with fallback initials
- User name and email display
- Quick access to settings
- Session management

### Wallet Management
- Current wallet status
- List of available wallets
- Visual wallet switching
- Connection status indicators

### Navigation
- Drawer-based menu system
- Responsive design
- Clear visual hierarchy
- Intuitive icons

### State Handling
- Session awareness
- Wallet connection state
- Route-based menu closing
- Drawer state management

### Notifications
- Fee rate alerts
- Promotional information
- Visual rate comparisons
- Card-based notifications
- Clear visual hierarchy
``` 