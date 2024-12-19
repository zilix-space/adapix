# Custom Hooks

This directory contains custom React hooks that provide reusable logic across the Adapix dApp.

## Core Hooks

### useWallet
Provides wallet management functionality through the WalletContext:

```tsx
const wallet = useWallet()
```

#### Features
- Current wallet state
- Wallet connection management
- Transaction handling
- Balance tracking

#### Properties
```typescript
interface WalletContextProps {
  current: UserWallet | null
  installed: WalletInfo[]
  connect: (provider: string) => Promise<void>
  disconnect: () => Promise<void>
  startTransaction: (address: string, amount: number) => Promise<void>
  validateTransaction: (amount: number) => Promise<boolean>
}
```

#### Usage Example
```tsx
function WalletComponent() {
  const wallet = useWallet()
  
  return (
    <div>
      {wallet.current ? (
        <div>
          <p>Balance: {wallet.current.balance} ADA</p>
          <button onClick={wallet.disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={() => wallet.connect('nami')}>Connect Wallet</button>
      )}
    </div>
  )
}
```

### useApplication
Provides access to global application state:

```tsx
const application = useApplication()
```

#### Features
- User session management
- Application settings
- Global state access
- Type-safe context

#### Properties
```typescript
interface ApplicationContextProps {
  session: {
    user: User | null
    status: 'authenticated' | 'loading' | 'unauthenticated'
  }
  settings: ApplicationSettings
}
```

#### Usage Example
```tsx
function UserProfile() {
  const application = useApplication()
  
  if (!application.session.user) {
    return <div>Please log in</div>
  }
  
  return (
    <div>
      <h1>Welcome, {application.session.user.name}</h1>
    </div>
  )
}
```

### useActionForm
Provides form management with server actions integration:

```tsx
const form = useActionForm(options)
```

#### Features
- Server action integration
- Form state management
- Validation handling
- Success/error states

#### Options
```typescript
interface ActionFormOptions<T> {
  action: ServerAction<T>
  schema: ZodSchema<T>
  defaultValues?: Partial<T>
  reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit'
  onSubmitSuccess?: (result: any) => void
  onSubmitError?: (error: Error) => void
}
```

#### Usage Example
```tsx
function ProfileForm() {
  const form = useActionForm({
    action: updateProfile,
    schema: profileSchema,
    defaultValues: {
      name: '',
      email: ''
    },
    onSubmitSuccess: () => {
      toast.success('Profile updated')
    }
  })
  
  return (
    <Form {...form}>
      <FormField
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  )
}
```

## Best Practices

### Hook Usage
- Always use hooks at the component top level
- Handle loading and error states
- Provide proper TypeScript types
- Follow React hooks rules

### Error Handling
- Implement try/catch blocks
- Provide meaningful error messages
- Handle edge cases
- Use error boundaries

### State Management
- Keep state updates atomic
- Implement proper cleanup
- Handle side effects
- Cache results when appropriate

### Performance
- Memoize callbacks
- Optimize re-renders
- Use proper dependencies
- Implement loading states

## Integration Guidelines

### With Components
```tsx
function Component() {
  const wallet = useWallet()
  const application = useApplication()
  const form = useActionForm(options)
  
  // Component logic
}
```

### With Server Actions
```tsx
const form = useActionForm({
  action: serverAction,
  schema: validationSchema,
  onSubmitSuccess: handleSuccess
})
```

### With Context
```tsx
function useCustomHook() {
  const wallet = useWallet()
  const application = useApplication()
  
  // Custom hook logic
}
```

## Testing

### Mock Implementation
```tsx
const mockWallet = {
  current: null,
  installed: [],
  connect: jest.fn(),
  disconnect: jest.fn()
}

jest.mock('../_hooks/use-wallet', () => ({
  useWallet: () => mockWallet
}))
```

### Test Examples
```tsx
describe('useWallet', () => {
  it('should handle wallet connection', async () => {
    const { result } = renderHook(() => useWallet())
    await act(() => result.current.connect('nami'))
    expect(result.current.current).toBeDefined()
  })
})
``` 