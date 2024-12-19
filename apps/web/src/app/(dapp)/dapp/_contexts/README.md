# Context Providers

This directory contains the context providers that manage global state and integrations in the Adapix dApp.

## Wallet Integration

### WalletContext (`wallet.tsx`)
Manages Cardano wallet integration using MeshSDK:

```tsx
const WalletContext = createContext<WalletContextProps>(undefined)
```

#### Features
- Wallet connection management
- Balance tracking
- Transaction handling
- State persistence

#### State Interface
```typescript
interface UserWallet {
  name: string
  address: string
  balance: number
}

interface WalletContextProps {
  current: UserWallet | null
  installed: {
    name: string
    provider: string
    icon: string
  }[]
  connect: (provider: string, noToast?: boolean) => Promise<void>
  disconnect: () => Promise<void>
  startTransaction: (address: string, amount: number) => Promise<void>
  validateTransaction: (amount: number) => Promise<boolean>
}
```

#### Implementation Details

1. **Wallet Detection**
```typescript
BrowserWallet.getInstalledWallets()
```
- Detects installed Cardano wallets
- Returns wallet information
- Handles multiple wallet types

2. **Connection Management**
```typescript
const handleConnect = async (provider: string) => {
  await mesh.connect(provider)
  setPreferredWallet(provider)
}
```
- Connects to selected wallet
- Stores preference
- Handles errors
- Shows notifications

3. **Balance Updates**
```typescript
const handleUpdateWallet = async () => {
  const balance = await mesh.wallet.getLovelace()
  const addresses = await mesh.wallet.getUsedAddresses()
  // Update state
}
```
- Real-time balance tracking
- Address management
- Error handling

4. **Transaction Handling**
```typescript
const handleStartTransaction = async (address: string, amount: number) => {
  const tx = new Transaction({ initiator: mesh.wallet })
    .sendLovelace(address, amount)
  // Build and submit transaction
}
```
- Transaction building
- Signature handling
- Submission process
- Error management

## Usage Examples

### Basic Wallet Connection
```tsx
function WalletButton() {
  const { connect, disconnect, current } = useWallet()
  
  return current ? (
    <button onClick={disconnect}>
      Disconnect {current.name}
    </button>
  ) : (
    <button onClick={() => connect('nami')}>
      Connect Wallet
    </button>
  )
}
```

### Transaction Flow
```tsx
function TransactionComponent() {
  const { current, startTransaction, validateTransaction } = useWallet()
  
  const handleSend = async () => {
    if (await validateTransaction(amount)) {
      await startTransaction(address, amount)
    }
  }
  
  return (
    // Transaction UI
  )
}
```

### Wallet List
```tsx
function WalletList() {
  const { installed, connect } = useWallet()
  
  return (
    <div>
      {installed.map(wallet => (
        <button
          key={wallet.provider}
          onClick={() => connect(wallet.provider)}
        >
          <img src={wallet.icon} alt={wallet.name} />
          {wallet.name}
        </button>
      ))}
    </div>
  )
}
```

## Integration with MeshSDK

### Provider Setup
```tsx
export function WalletProvider({ children }) {
  return (
    <MeshProvider>
      <WalletContext.Provider value={...}>
        {children}
      </WalletContext.Provider>
    </MeshProvider>
  )
}
```

### Transaction Building
```typescript
const buildTransaction = async (params) => {
  const tx = new Transaction({ initiator: wallet })
    .sendLovelace(address, amount)
  
  const unsignedTx = await tx.build()
  const signedTx = await wallet.signTx(unsignedTx)
  const txHash = await wallet.submitTx(signedTx)
  
  return txHash
}
```

## State Management

### Local Storage
```typescript
const [preferredWallet, setPreferredWallet] = useLocalStorageState<string | null>(
  'x-prefered-wallet',
  null
)
```
- Persists wallet preference
- Handles reconnection
- Manages state sync

### Wallet State
```typescript
const [userWallet, setUserWallet] = useState<UserWallet | null>(null)
```
- Current wallet info
- Balance tracking
- Address management

## Error Handling

### Connection Errors
```typescript
try {
  await mesh.connect(provider)
} catch (error) {
  console.error(error)
  toast.error('Failed to connect wallet')
}
```

### Transaction Errors
```typescript
try {
  await handleStartTransaction(address, amount)
} catch (error) {
  console.error(error)
  toast.error('Transaction failed')
}
```

## Best Practices

### Implementation
- Use TypeScript for type safety
- Handle all error cases
- Implement proper cleanup
- Follow React context patterns

### Security
- Validate transactions
- Check balances
- Handle network errors
- Protect sensitive data

### Performance
- Optimize state updates
- Handle loading states
- Cache wallet data
- Manage reconnection

### User Experience
- Clear error messages
- Loading indicators
- Success feedback
- Connection status
``` 