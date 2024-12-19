# Public Site Documentation

This directory contains the public-facing website components and functionality of the application. It follows Next.js 14 app directory structure conventions and clean code principles.

## Directory Structure

```
(site)/
├── _components/           # Site-specific components
│   ├── dapp.tsx          # dApp showcase component with iframe integration
│   ├── faq-section-ada.tsx    # FAQ section using Accordion component
│   ├── footer.tsx        # Site footer with contact info
│   ├── header.tsx        # Site header with navigation
│   ├── hero-section.tsx  # Hero section with real-time ADA quote
│   ├── how-to-works-section.tsx # Step-by-step guide section
│   └── page-wrapper.tsx  # Layout wrapper for consistent spacing
├── _data/                # Static content and configurations
│   └── faq.ts           # FAQ content structure
├── actions.tsx          # Server actions for ADA quotes
├── layout.tsx           # Base layout with header and footer
└── page.tsx             # Main landing page assembly
```

## Technical Implementation

### Server Components
All components are implemented as React Server Components (RSC) to optimize:
- First-page load performance
- SEO capabilities
- Server-side data fetching

### Data Flow
- **ADA Quotes**: Fetched via server actions with caching
- **FAQ Content**: Managed through TypeScript data structures
- **Session Management**: Server-side session handling for dApp preview

### Component Architecture

#### Layout Components
- `page-wrapper.tsx`: Container component with consistent padding and max-width
- `header.tsx`: Navigation and branding with responsive design
- `footer.tsx`: Contact information and copyright details

#### Content Sections
- `hero-section.tsx`: 
  - Real-time ADA price display
  - Main value proposition
  - Server-side data fetching for quotes

- `how-to-works-section.tsx`:
  - Step-by-step onboarding process
  - Icon-based visual guides
  - Clean and organized layout

- `dapp.tsx`:
  - Responsive iframe implementation
  - KYC status-based routing
  - Session-aware preview

- `faq-section-ada.tsx`:
  - Accordion-based Q&A display
  - Reusable component structure
  - Static content management

### Design System Integration
- Uses custom design system components
- Consistent styling with TailwindCSS
- Responsive design patterns
- Accessible UI components

### Server Actions
- Cached quote fetching
- Real-time market data integration
- Error handling and fallbacks

## Usage Guidelines

### Adding New Content
1. Static content should be added to `_data` directory
2. Components should be added to `_components`
3. New server actions go in `actions.tsx`

### Modifying Existing Content
1. Update FAQ:
   - Modify `_data/faq.ts`
   - Follow existing structure
   - Keep questions focused and concise

2. Update Components:
   - Follow Server Component patterns
   - Maintain responsive design
   - Use design system components

3. Styling Guidelines:
   - Use TailwindCSS classes
   - Follow existing spacing patterns
   - Maintain responsive breakpoints

### Performance Considerations
- Server Components for data-heavy sections
- Cached server actions for repeated data
- Optimized iframe loading for dApp preview
``` 