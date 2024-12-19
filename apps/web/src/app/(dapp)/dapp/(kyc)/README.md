# KYC (Know Your Customer) Module

This module handles the user verification process in the Adapix dApp, ensuring compliance with regulatory requirements and maintaining security standards.

## Verification Flow

The KYC process follows a strict sequential flow:

1. **Basic Data** (`(main)`)
   - Name validation
   - CPF validation
   - Birth date validation (18+ years)
   - Redirects to address validation
   - Tracks onboarding start

2. **Address Validation** (`validate-user-address`)
   - City and state
   - Neighborhood
   - ZIP code
   - Street and number
   - Redirects to phone validation

3. **Phone Validation** (`validate-user-phone`)
   - Phone number input
   - Contact information update
   - Redirects to PIX validation

4. **PIX Key** (`validate-user-pix`)
   - PIX key registration
   - Payment settings update
   - Redirects to document validation

5. **Document Upload** (`validate-user-document`)
   - Front of document
   - Back of document
   - Redirects to selfie validation

6. **Document with Selfie** (`validate-user-document-and-selfie`)
   - Selfie upload
   - Updates KYC status to 'submitted'
   - Tracks onboarding completion
   - Redirects to final confirmation

7. **Confirmation** (`validate-user-data`)
   - Success animation
   - Completion message
   - 48-hour review notice

## Directory Structure

```
└── kyc/
    ├── README.md
    ├── layout.tsx                           # KYC layout wrapper
    ├── (main)/                             # Initial data collection
    │   ├── actions.ts                      # Basic data validation
    │   ├── page.tsx                        # Main form
    │   └── schema.ts                       # Validation rules
    ├── validate-user-address/              # Address verification
    │   ├── actions.ts                      # Address update
    │   ├── page.tsx                        # Address form
    │   └── schema.ts                       # Address validation
    ├── validate-user-data/                 # Final confirmation
    │   ├── _components/                    # Success components
    │   │   └── check.tsx                   # Success animation
    │   └── page.tsx                        # Confirmation page
    ├── validate-user-document/             # Document upload
    │   ├── actions.ts                      # Document processing
    │   ├── page.tsx                        # Upload interface
    │   └── schema.ts                       # Document validation
    ├── validate-user-document-and-selfie/  # Selfie verification
    │   ├── actions.ts                      # Selfie processing
    │   ├── page.tsx                        # Selfie capture
    │   └── schema.ts                       # Selfie validation
    ├── validate-user-phone/                # Phone verification
    │   ├── actions.ts                      # Phone update
    │   ├── page.tsx                        # Phone form
    │   └── schema.ts                       # Phone validation
    └── validate-user-pix/                  # PIX registration
        ├── actions.ts                      # PIX update
        ├── page.tsx                        # PIX form
        └── schema.ts                       # PIX validation
```

## Technical Implementation

### State Management
- Each step updates specific user settings
- Progress is tracked through redirects
- Form state managed by `useActionForm`
- Real-time validation with `reValidateMode: 'onChange'`

### Data Storage
- User settings in profile:
  - Basic data in `settings.kyc.data`
  - Address in `settings.kyc.data.address`
  - Phone in `settings.contact`
  - PIX in `settings.payment`
  - Documents in `settings.kyc.data.attachments`

### Status Tracking
- Initial: No status
- After completion: 'submitted'
- Analytics events:
  - 'onboarding-started' at beginning
  - 'onboarding-finished' at completion

### Security
- Server-side validation
- Type-safe schemas with Zod
- Secure file handling
- Protected routes

## Development Guidelines

### Adding New Steps
1. Create directory with standard files:
   ```
   new-step/
   ├── actions.ts    # Server actions
   ├── page.tsx      # UI component
   └── schema.ts     # Validation rules
   ```
2. Update flow in previous step's redirect
3. Add validation schemas
4. Implement server actions

### Best Practices
- Use TypeScript for type safety
- Implement proper validation
- Add loading states
- Follow existing patterns
- Document new features

### Error Handling
- Form-level validation
- Server-side validation
- File upload validation
- User feedback

## User Experience

### Progress Indication
- Clear step navigation
- Loading states
- Success animations
- Error messages

### Form Design
- Consistent layout
- Clear instructions
- Real-time validation
- Mobile responsive

### Security Measures
- Data encryption
- Secure file upload
- Session validation
- Access control
``` 