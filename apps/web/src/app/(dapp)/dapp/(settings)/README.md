# Settings Module

This module handles user settings and profile management in the Adapix dApp, including account information and PIX key management.

## Directory Structure

```
(settings)/
└── settings/
    ├── my-account/              # Account management
    │   ├── _components/        # Account-specific components
    │   │   └── form.tsx       # Profile form component
    │   ├── actions.ts         # Account update actions
    │   ├── page.tsx           # Account page layout
    │   └── schemas.ts         # Validation schemas
    └── update-pix/            # PIX management
        ├── _components/        # PIX-specific components
        │   └── form.tsx       # PIX update form
        ├── actions.ts         # PIX update actions
        ├── page.tsx           # PIX page layout
        └── schemas.ts         # PIX validation schemas
```

## Features

### Account Management
- Profile information display and editing
- Collapsible form sections for:
  - Name (support required for changes)
  - Email (support required for changes)
  - Phone (support required for changes)
  - Profile picture (direct update)
  - Address information (read-only)
- Real-time form validation
- Success notifications
- Support link integration

### PIX Management
- PIX key display and editing
- Supports multiple PIX key types:
  - Email
  - CPF
  - Phone number
- Validation rules
- Bank account holder verification
- Success notifications

## Technical Implementation

### Validation Schemas

#### Profile Schema
```typescript
{
  image: string (optional),
  name: string (optional),
  email: string (optional),
  phone: string (optional),
  telegram: string (optional),
  address: {
    state: string (optional),
    city: string (optional),
    neighborhood: string (optional),
    zipCode: string (optional),
    street: string (optional),
    number: string (optional)
  }
}
```

#### PIX Schema
```typescript
{
  payment: {
    pix: string (optional)
  }
}
```

### Server Actions

#### Profile Update Action
- Type: `user.update` (mutation)
- Client: Tenant-specific client
- Updates:
  - Basic profile (name, image)
  - Contact information (phone, telegram)
  - Address information
- Success feedback via toast

#### PIX Update Action
- Type: `user.update` (mutation)
- Client: Tenant-specific client
- Updates:
  - Payment settings
  - PIX key
- Success feedback via toast

### Data Structure
```typescript
User {
  id: string
  name: string
  image: string
  settings: {
    contact: {
      phone: string
      telegram: string
    }
    kyc: {
      data: {
        address: {
          state: string
          city: string
          neighborhood: string
          zipCode: string
          street: string
          number: string
        }
      }
    }
    payment: {
      pix: string
    }
  }
}
```

### Components

#### Profile Form
- Collapsible form sections
- Avatar upload support
- Read-only fields with support redirection
- Form state management
- Validation feedback

#### PIX Form
- Single-field form
- Multiple key type support
- Validation rules
- Success feedback
- Fixed bottom save button

### State Management
- Form state using `useActionForm`
- Session management
- Success notifications
- Error handling

### Validation
- Type-safe schemas with Zod
- Real-time validation
- Error messages
- Success feedback

## User Interface

### Layout
- Clean and organized sections
- Back navigation
- Clear section headers
- Responsive design

### Form Design
- Collapsible sections
- Clear labels
- Input validation
- Help text
- Error messages

### Interactions
- Form submissions
- Image uploads
- Success notifications
- Support redirects

## Development Guidelines

### Adding New Settings
1. Create new directory following pattern:
   ```
   new-setting/
   ├── _components/
   │   └── form.tsx
   ├── actions.ts
   ├── page.tsx
   └── schemas.ts
   ```
2. Implement validation schema
3. Create server actions
4. Build form component

### Best Practices
- Use TypeScript for type safety
- Implement proper validation
- Add loading states
- Follow existing patterns
- Document new features

### Form Guidelines
- Clear validation rules
- Proper error handling
- Loading states
- Success feedback
- Support integration

## Security Considerations

### Data Protection
- Sensitive field protection
- Support-required changes
- Validation rules
- Session verification

### Validation
- Input sanitization
- Schema validation
- Type checking
- Error handling

### Session Management
- Authentication checks
- Authorization rules
- Session persistence
- Timeout handling

## User Experience

### Form Feedback
- Clear error messages
- Success notifications
- Loading indicators
- Support redirection

### Navigation
- Back button
- Section organization
- Clear headers
- Intuitive layout

### Accessibility
- Clear labels
- Error messages
- Help text
- Keyboard navigation

## Form Implementation

### Profile Form
- Uses `CollapsableForm` for sections
- Conditional rendering based on field type
- Support redirection for protected fields
- Image upload handling
- Address field management

### PIX Form
- Single input field
- Multiple key type support
- Bank account validation
- Success notification
- Fixed position save button

### Form State Management
- Uses `useActionForm` hook
- Default values from session
- Real-time validation
- Success/error handling
- Toast notifications

## Security Implementation

### Field Protection
- Read-only fields for sensitive data
- Support redirection for changes
- Session validation
- Client-side validation

### Data Updates
- Server-side validation
- Type checking with Zod
- Session context verification
- Tenant-specific actions

### Access Control
- Authentication required
- Session validation
- Protected routes
- Secure updates

## Integration Points

### With Backend
- User module integration
- Tenant-specific actions
- Session management
- Data persistence

### With Support System
- Field change requests
- Support redirections
- Help documentation
- Contact integration

## Error Handling

### Validation Errors
- Schema-based validation
- Field-level error messages
- Form-level error states
- User feedback

### Update Errors
- Action error handling
- Toast notifications
- Form state management
- Error recovery

## Performance Considerations

### Form Optimization
- Collapsible sections
- Lazy loading
- Minimal re-renders
- Efficient validation

### State Management
- Cached session data
- Optimistic updates
- Error boundaries
- Loading states
``` 