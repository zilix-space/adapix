# Admin Shared Components

This directory contains reusable components shared across all admin modules.

## Directory Structure

```
_components/
├── layout/               # Layout components
│   ├── sidebar.tsx      # Admin sidebar
│   ├── header.tsx       # Admin header
│   └── breadcrumb.tsx   # Breadcrumb navigation
├── data-display/        # Data display components
│   ├── data-table.tsx   # Base table component
│   ├── status-badge.tsx # Status indicator
│   └── metrics-card.tsx # Metrics display
├── forms/               # Form components
│   ├── search-field.tsx # Search input
│   ├── filters.tsx      # Filter controls
│   └── date-range.tsx   # Date range picker
└── feedback/            # Feedback components
    ├── alert.tsx        # Alert messages
    ├── loading.tsx      # Loading states
    └── error.tsx        # Error messages
```

## Core Components

### Layout Components
- [ ] Responsive sidebar
- [ ] Dynamic header
- [ ] Breadcrumb navigation
- [ ] Content container
- [ ] Action bar

### Data Display
- [ ] Data table with sorting
- [ ] Status indicators
- [ ] Metric cards
- [ ] Charts
- [ ] Lists

### Form Elements
- [ ] Search fields
- [ ] Filter controls
- [ ] Date pickers
- [ ] Select inputs
- [ ] Action buttons

### Feedback Components
- [ ] Alert messages
- [ ] Loading states
- [ ] Error displays
- [ ] Success messages
- [ ] Progress indicators

## Technical Requirements

### Component Architecture
- [ ] TypeScript types
- [ ] Prop validation
- [ ] Event handling
- [ ] State management
- [ ] Error boundaries

### Styling
- [ ] Consistent theme
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Accessibility
- [ ] Animation

### Performance
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Memoization
- [ ] Bundle optimization
- [ ] State updates

## Implementation Guidelines

### Component Structure
```typescript
/**
 * Base component interface for admin data tables
 */
interface AdminDataTable<T> {
  data: T[]
  columns: TableColumn[]
  loading?: boolean
  error?: Error
  onSort?: (column: string) => void
  onFilter?: (filters: Filter[]) => void
  onRowClick?: (row: T) => void
}

/**
 * Base component interface for admin forms
 */
interface AdminForm<T> {
  initialData?: T
  onSubmit: (data: T) => Promise<void>
  onCancel: () => void
  loading?: boolean
  error?: Error
}

/**
 * Base component interface for admin metrics
 */
interface AdminMetric {
  title: string
  value: number | string
  change?: number
  trend?: 'up' | 'down'
  period?: string
}
```

### Styling Guidelines
```typescript
// Theme constants
const ADMIN_THEME = {
  colors: {
    primary: '#0066FF',
    secondary: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#F9FAFB'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  }
}
```

## Usage Examples

### Data Table
```typescript
/**
 * Example usage of the AdminDataTable component
 */
<AdminDataTable
  data={users}
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', component: StatusBadge },
    { key: 'actions', label: 'Actions', component: ActionButtons }
  ]}
  loading={isLoading}
  error={error}
  onSort={handleSort}
  onFilter={handleFilter}
/>
```

### Metric Card
```typescript
/**
 * Example usage of the MetricCard component
 */
<MetricCard
  title="Total Users"
  value={totalUsers}
  change={userGrowth}
  trend="up"
  period="Last 30 days"
/>
```

## Testing Requirements

### Unit Tests
- [ ] Component rendering
- [ ] Props validation
- [ ] Event handling
- [ ] State updates
- [ ] Error cases

### Integration Tests
- [ ] Component interactions
- [ ] Data flow
- [ ] Layout behavior
- [ ] Responsive design
- [ ] Theme switching

### Accessibility Tests
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast
- [ ] ARIA attributes
- [ ] Focus management

## Documentation

### Component Documentation
- [ ] Props interface
- [ ] Usage examples
- [ ] Event handlers
- [ ] Styling options
- [ ] Best practices

### Storybook Stories
- [ ] Basic usage
- [ ] Variants
- [ ] States
- [ ] Interactions
- [ ] Responsive behavior

## Development Checklist

### Setup
- [ ] Component structure
- [ ] TypeScript config
- [ ] Styling system
- [ ] Testing setup
- [ ] Documentation

### Implementation
- [ ] Core components
- [ ] Variants
- [ ] Responsive design
- [ ] Theme support
- [ ] Animations

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] Accessibility tests
- [ ] Performance tests
- [ ] Browser testing

### Documentation
- [ ] Component docs
- [ ] Usage examples
- [ ] API reference
- [ ] Storybook
- [ ] Changelog
``` 