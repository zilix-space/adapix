# dApp Core Components

This directory contains the core components and providers that form the foundation of the Adapix dApp.

## Providers System

### DappProvider (`providers.tsx`)
Main provider component that wraps the entire dApp with necessary context providers:

```tsx
<DappProvider>
  <DynamicMeshProvider>
    <DynamicWalletProvider>
      {children}
    </DynamicWalletProvider>
  </DynamicMeshProvider>
</DappProvider>
```

#### Features
- Dynamic loading with skeleton states
- SSR-safe wallet integration
- Nested provider architecture

#### Components
1. **MeshProvider**
   - Cardano wallet integration
   - Dynamic import for client-side only
   - Loading skeleton UI
   - Network management

2. **WalletProvider**
   - Wallet state management
   - Connection handling
   - Transaction validation
   - Balance tracking

## Base Components

### DappPage
Base layout component with consistent styling and animations:

```tsx
<DappPage>
  <DappPageHeader />
  <DappPageMain />
  <DappPageFooter />
</DappPage>
```

#### Features
- Fade-up animations
- Consistent spacing
- Flexible layout system
- Responsive design

#### Components
1. **DappPageHeader**
   - Back navigation
   - Title/subtitle system
   - Container management
   - Flexible positioning

2. **DappPageMain**
   - Content wrapper
   - Full-width support
   - Spacing management

3. **DappPageFooter**
   - Bottom positioning
   - Action buttons
   - Form submissions

### CollapsableForm
Reusable form component with expandable sections:

```tsx
<CollapsableForm>
  <CollapsableFormTrigger>
    <CollapsableFormTriggerLabel />
    <CollapsableFormTriggerValue />
  </CollapsableFormTrigger>
  <CollapsableFormContent>
    <CollapsableFormHeader />
    <CollapsableFormMain />
    <CollapsableFormFooter />
  </CollapsableFormContent>
</CollapsableForm>
```

#### Features
- Drawer-based expansion
- Consistent styling
- Form section management
- Responsive behavior

#### Components
1. **CollapsableFormTrigger**
   - Click interaction
   - Label/value display
   - State indication

2. **CollapsableFormContent**
   - Content wrapper
   - Animation handling
   - Drawer integration

3. **CollapsableFormHeader**
   - Title component
   - Description support
   - Consistent spacing

4. **CollapsableFormMain**
   - Form fields container
   - Spacing management
   - Content organization

5. **CollapsableFormFooter**
   - Action buttons
   - Border styling
   - Fixed positioning

## Loading States

### Skeleton Components
Loading state components for various UI elements:

```tsx
<Skeleton className="h-10 w-10 rounded-full" /> // Avatar
<Skeleton className="h-6 w-1/2" /> // Text
<Skeleton className="h-16 w-full" /> // Card
```

#### Features
- Consistent animations
- Responsive widths
- Layout preservation
- Visual hierarchy

## Usage Guidelines

### Provider Implementation
```tsx
// Wrap your app with providers
export function RootLayout({ children }) {
  return (
    <DappProvider>
      {children}
    </DappProvider>
  )
}
```

### Page Structure
```tsx
export default function Page() {
  return (
    <DappPage>
      <DappPageHeader>
        <DappPageHeaderTitle>Title</DappPageHeaderTitle>
      </DappPageHeader>
      <DappPageMain>
        {/* Content */}
      </DappPageMain>
      <DappPageFooter>
        {/* Actions */}
      </DappPageFooter>
    </DappPage>
  )
}
```

### Form Implementation
```tsx
export function SettingsForm() {
  return (
    <CollapsableForm>
      <CollapsableFormTrigger>
        <CollapsableFormTriggerLabel>
          Profile
        </CollapsableFormTriggerLabel>
      </CollapsableFormTrigger>
      <CollapsableFormContent>
        {/* Form fields */}
      </CollapsableFormContent>
    </CollapsableForm>
  )
}
```

## Best Practices

### Component Usage
- Use DappPage for consistent layouts
- Implement loading states with skeletons
- Follow form structure patterns
- Maintain responsive design

### Provider Implementation
- Keep providers at root level
- Handle loading states
- Implement error boundaries
- Manage SSR compatibility

### Form Development
- Use CollapsableForm for settings
- Follow form field patterns
- Implement proper validation
- Handle loading states
``` 