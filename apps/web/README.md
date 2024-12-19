# Web Application

The web application is built using Next.js 14 and implements the main interface for the Adapix platform.

## Tech Stack

- **Framework**: Next.js 14.2.4
- **UI Library**: React 18.3.1
- **Authentication**: NextAuth 4.24.4
- **Validation**: Zod 3.22.4
- **Styling**: TailwindCSS
- **Design System**: Custom (@design-system/react)
- **Blockchain**: MeshSDK (Cardano integration)
- **Email**: React Email
- **State Management**: React Context + Hooks
- **Forms**: React Hook Form

## Project Structure

```
apps/web/src/
├── app/                  # Next.js App Router
│   ├── (site)/          # Public website
│   ├── (dapp)/          # Main application
│   ├── app/             # Admin area
│   ├── auth/            # Authentication
│   └── api/             # API routes
├── emails/              # Email templates
├── services/            # Core services
├── helpers/             # Utility functions
└── hooks/               # Custom hooks
```

## Public Website (/(site))

### Pages
- **Home Page**: Landing page with ADA price integration
  - Hero section with real-time ADA quote
  - How it works section
  - FAQ section
  - Embedded dApp interface

### Components
- `PageWrapper`: Layout wrapper with common elements
- `HeroSection`: Main banner with ADA price
- `HowToWorksSection`: Process explanation
- `FAQSectionAda`: Frequently asked questions
- `Dapp`: Embedded transaction interface

### Features
- Real-time ADA price updates
- Responsive design
- SEO optimization

### Integration
- Uses `@app/modules` for:
  - Market price fetching
  - Transaction estimation
  - User management

[More sections to be added as we explore the application...]

## dApp (/(dapp))

### Structure
```
(dapp)/
├── (auth)/       # Authentication flows
├── (kyc)/        # KYC verification
├── (main)/       # Main transaction interface
├── (settings)/   # User settings
├── (transactions)/ # Transaction history
├── _components/  # Shared components
├── _contexts/    # State management
└── _hooks/       # Custom hooks
```

### Features

#### Wallet Integration
- Cardano wallet connection via MeshSDK
- Multiple wallet support (Browser wallets)
- Balance tracking and address management
- Transaction validation and execution
- Local storage for wallet preferences

#### Transaction Interface
- Real-time transaction form
- Dynamic loading for better performance
- Transaction history list
- Wallet summary with balance
- Header toolbar with quick actions

#### Layout
- Responsive design
- Iframe support for embedding
- Card-based interface
- Mobile-optimized view

### Components

#### Main Components
- `WalletTransactionForm`: Transaction creation interface
- `WalletTransactionList`: Transaction history
- `WalletSummary`: Balance and wallet info
- `HeaderToolbar`: Quick actions
- `HeaderUserNav`: User navigation

#### Context Providers
- `WalletProvider`: Manages wallet state and operations
  - Connection management
  - Balance updates
  - Transaction handling
  - Address management

### Integration
- Uses `@app/modules` for:
  - Transaction creation and estimation
  - User data management
  - KYC verification
  - Market price updates

### Technical Details
- Server-side rendering disabled for wallet components
- Force dynamic rendering for real-time data
- No cache for transaction-related pages
- Context-based state management
- Local storage for preferences

[More sections to be added...]

## Authentication & Session Management

### Authentication System

#### Providers
- **OAuth Providers**
  - Google Authentication
  - GitHub Integration
  - Email Magic Links
- **Email Authentication**
  - Custom email templates
  - Magic link flow
  - Welcome emails

#### Configuration
- NextAuth.js with Prisma Adapter
- Custom pages for all flows
- Event tracking with Indier
- Email integration with Resend

### Session Management

#### Core Features
- Server-side session handling
- React cache optimization
- Type-safe session data
- User context persistence

#### Implementation Details
- **Server Components**
  ```typescript
  // Cached user fetching
  const getCurrentUser = cache(async () => {
    const session = await getServerSession(authOptions)
    return session?.user
  })

  // Application session with cache
  const getApplicationSession = cache(async () => {
    const user = await getCurrentUser()
    return { user }
  })
  ```

#### Type System
- **Extended NextAuth Types**
  ```typescript
  // JWT extension
  interface JWT {
    id: string
  }

  // Session extension
  interface Session {
    user: UserModel // From @app/modules
  }

  // User extension
  interface User extends UserModel {}
  ```

### Security Features

#### Authentication
- Secure token handling
- OAuth state validation
- CSRF protection
- XSS prevention

#### Session Security
- Server-side validation
- Encrypted cookies
- Token expiration
- Secure session storage

### Integration Points

#### With @app/modules
- User management
- Email services
- Event tracking
- Data validation

#### With NextAuth
- Custom callbacks
- Session handling
- Provider configuration
- Adapter setup

### Event System

#### Authentication Events
- Sign In tracking
- User creation
- Email verification
- Session updates

#### Analytics Integration
```typescript
// Example event tracking
async signIn(message) {
  await indier.analytics.event.create({
    event: 'user-signed-in',
    channel: 'user-journey',
    title: 'User Signed In',
    description: `User ${message.user.email} signed in`,
    identity: {
      identityId: message.user.id,
      email: message.user.email,
      // ... other user data
    }
  })
}
```

### Development Workflow

#### Setup
1. Configure OAuth providers
2. Set up email templates
3. Configure session handling
4. Implement event tracking

#### Environment Variables
```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com

# Analytics
INDIER_API_KEY=your-indier-api-key
```

[More sections to be added...]

## Environment Variables

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com

# Database
DATABASE_URL=your-database-url

# Analytics
INDIER_API_KEY=your-indier-api-key

# More variables to be added...
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```
## Email System

### Templates

#### Transactional Emails
- **Welcome Email**
  - Sent after user registration
  - Personalized greeting
  - Quick start guide
  - Social media links
  - Marketing consent handling

- **KYC Status Emails**
  - Success notification
  - Document validation status
  - Next steps guidance
  - Support information

- **Transaction Emails**
  - Transaction completion notification
  - Detailed transaction information:
    - Transaction ID
    - Status and type
    - Amount details
    - Wallet addresses
    - Timestamps

### Components
- **Email Footer**
  - Marketing vs. Transactional variants
  - Unsubscribe functionality
  - Security notice
  - Recipient information

### Technical Implementation
- Built with `@react-email/components`
- Tailwind CSS styling
- Responsive design
- Dynamic content injection
- Marketing consent management
- Localization support

### Integration
- Uses Resend for delivery
- Connected with user events
- Transaction status updates
- KYC process notifications

### Features
- Responsive layouts
- Brand consistency
- Dynamic data insertion
- Marketing compliance
- Security considerations
- Accessibility support

[More sections to be added...]

## Actions System

### Core Features

#### Action Client
- Type-safe server actions
- Form integration with Zod validation
- Automatic form state management
- Debounced onChange submissions
- Error handling and response management

#### Hooks
- **useAction**: Basic action execution
  - Submission state tracking
  - Response management
  - Error handling
  - Type inference

- **useActionForm**: Form integration
  - React Hook Form integration
  - Zod schema validation
  - Default values handling
  - Success/Error callbacks
  - Status change notifications

### Client Types
- Public Client (unauthenticated)
- Tenant Client (organization context)
- User Client (authenticated user)

### Technical Implementation
- TypeScript utility types for type safety
- React Server Actions integration
- Session context management
- Form state persistence
- Navigation integration

### Features
- Type-safe action definitions
- Automatic form validation
- Debounced submissions
- Session management
- Error boundary integration
- Loading state handling

### Usage Example
```typescript
// Define action
const myAction = client.action({
  name: 'action.name',
  type: 'mutation',
  handler: async (input) => {
    // Action implementation
  }
})

// Use in component
const MyComponent = () => {
  const form = useActionForm({
    action: myAction,
    schema: zodSchema,
    onSubmitSuccess: (result) => {
      // Handle success
    }
  })

  return <form onSubmit={form.handleSubmit}>
    // Form fields
  </form>
}
```

[More sections to be added...]

## HTTP & Error Handling

### API Handler System

#### Core Features
- Type-safe API handlers
- Middleware support
- Schema validation
- Error handling
- Response standardization

#### Implementation
```typescript
// Create type-safe API handler
const apiHandler = createApiHandler({
  handler: async (req, context) => {
    // Handler implementation
  },
  schemas: {
    body: zodSchema,
    params: zodSchema,
    query: zodSchema
  },
  middlewares: [authMiddleware]
})
```

### Error Handling

#### Error Types
- **HttpResponseError**
  - Custom error class
  - Status code handling
  - Data payload support
  - Error message formatting

#### Error Responses
```typescript
// Standard error response
{
  error: string,
  data?: {
    name: string,
    description: string,
    [key: string]: any
  }
}
```

### Middleware System

#### Authentication Middleware
- User validation
- Channel verification
- KYC status checking
- Error responses

#### Implementation Example
```typescript
const userAuthMiddleware: ApiMiddleware<Context> = async (req, context) => {
  // Channel validation
  const channel = req.headers.get('x-sender-channel')
  
  // User lookup and validation
  const user = await findUser(channel)
  
  // Status checks
  if (user.status !== 'ACTIVE') {
    throw new HttpResponseError({
      status: 403,
      message: 'User not active',
      data: { /* error details */ }
    })
  }
  
  // Context enhancement
  context.user = {
    id: user.id,
    // ... user data
  }
}
```

### Response Handling

#### Standard Responses
- Type-safe response formatting
- Status code management
- Data serialization
- Error wrapping

#### Validation
- Zod schema validation
- Request body parsing
- Query parameter validation
- Parameter type checking

### Technical Details

#### Type System
```typescript
// API Handler Context
type ApiHandlerContext<TBody, TParams, TQuery, TExtra> = {
  body?: TBody
  params?: TParams
  query?: TQuery
  response?: ResponseFunction
  error?: ErrorFunction
} & TExtra

// Middleware Type
type ApiMiddleware<TContext> = (
  req: NextRequest,
  context: TContext
) => Promise<void>
```

#### Features
- Request validation
- Error standardization
- Middleware chaining
- Context enhancement
- Type inference

[More sections to be added...] 

## Utility Systems

### Helpers

#### Format Helpers
- `formatCurrency`: Currency formatting with locale support
- `formatNumber`: Number formatting utilities
- `parseUnitPrice`: Price parsing and normalization
- `toDateTime`: Date formatting

#### Mask Helpers
- `cpfMask`: Brazilian CPF document mask
- `dateMask`: Date input mask
- `zipCodeMask`: Postal code mask

#### Color Helpers
- `getColorWithAlpha`: Alpha channel manipulation
- `hexToHsl`: Color space conversion
- `svgIcon`: SVG icon handling

#### URL & UTM Helpers
- `getUrl`: URL generation
- `getSsrUtms`: Server-side UTM tracking
- `isValidUuid`: UUID validation

#### General Utilities
- `capitalize`: String capitalization
- `delay`: Async delay function
- `isObjectFullFilled`: Object validation
- `getDateRange`: Date range calculations

### Custom Hooks

#### Data Fetching
- `useCep`: Brazilian postal code lookup
  - Address validation
  - Auto-complete
  - Error handling
  - Loading states

### Background Jobs

#### Transaction Sync
- **Purpose**: Maintain transaction status consistency
- **Implementation**:
  ```typescript
  // Sync job endpoint
  export async function GET() {
    const transactions = await findPendingTransactions()
    
    for (const tx of transactions) {
      // Check for expiration (6 hours)
      const isExpired = checkExpiration(tx)
      if (isExpired) {
        await markAsExpired(tx)
      }
    }
  }
  ```

#### Features
- Automatic transaction expiration
- Status synchronization
- Error handling
- Response formatting

#### Configuration
- 6-hour expiration window
- Status filtering
- Batch processing
- Success tracking

[More sections to be added...] 

## Design System

### Core Features

#### Component Library
- **Form Controls**
  - Input, Select, Textarea
  - Radio, Checkbox, Switch
  - File Upload, Gallery Upload
  - Phone Input, Currency Input
  - Color Picker, Date Picker

- **Navigation**
  - Menu Bar, Navigation Menu
  - Tabs, Pagination
  - Dropdown, Context Menu
  - Command Palette

- **Feedback**
  - Toast, Alert, Dialog
  - Progress, Loading States
  - Empty States
  - Timeline

- **Layout**
  - Container, Card
  - Accordion, Collapsible
  - Drawer, Sheet
  - Grid System

- **Data Display**
  - Table, Data Table
  - Timeline
  - Property
  - Badge

### Styling System

#### Tailwind Configuration
- Custom color system
- Dark mode support
- Animation utilities
- Typography system
- Responsive design
- Component variants

#### Theme Features
- HSL color variables
- Dark/Light modes
- Custom radius system
- Animation keyframes
- Shadow system

### Integration

#### Dependencies
- Radix UI primitives
- Tremor components
- HeadlessUI
- Tailwind plugins
- Form libraries

#### Utilities
- Class variance authority
- Tailwind merge
- SCSS modules
- Theme provider

### Development

#### Setup
```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test
```

#### Usage Example
```typescript
import { Button, Input, Toast } from '@design-system/react'

// Use components with variants
<Button variant="primary" size="lg">
  Click me
</Button>

// Use with forms
<Input 
  type="text"
  placeholder="Enter text"
  error={errors.field}
/>

// Use feedback components
<Toast
  title="Success"
  description="Operation completed"
/>
```

[More sections to be added...] 
