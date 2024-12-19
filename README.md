# Adapix Platform

Welcome to Adapix, a comprehensive platform for ADA transactions and cryptocurrency management. This platform is built with modern technologies and follows best practices for security and user experience.

## Core Features

### Public Site
- Modern landing page with real-time ADA quotes
- Comprehensive FAQ section
- Step-by-step guide for new users
- dApp preview integration

### Authentication & Security
- **Next Auth**: Secure user authentication
- Protected routes and session management
- OAuth integration
- Role-based access control

### KYC System
- Complete user verification flow
- Document validation
- Identity verification
- Address validation
- PIX key registration
- Real-time status tracking

### Transaction System
- Real-time ADA transactions
- PIX integration for payments
- Transaction history
- Status tracking
- Blockchain integration

### User Dashboard
- Wallet management
- Transaction creation
- Real-time balance display
- Quick actions menu

### Settings Management
- Profile settings
- Security preferences
- Contact information
- Payment methods

## Technical Stack

- **Next.js 14**: Server-side rendering and app router
- **Prisma**: Database management and ORM
- **Zod**: Schema validation
- **React Hook Form**: Form handling
- **TailwindCSS**: Styling and design system
- **TypeScript**: Type safety
- **Server Components**: Performance optimization

## Project Structure

```
/
├── apps/
│   └── web/                 # Next.js application
│       ├── (site)/         # Public site
│       └── (dapp)/         # Main application
│           ├── (auth)/     # Authentication
│           ├── (kyc)/      # KYC verification
│           ├── (main)/     # Dashboard
│           └── (settings)/ # User settings
├── packages/
│   ├── db/                 # Database package
│   └── modules/            # Business logic
```

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL
- pnpm

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   pnpm dev
   ```

### Environment Variables

Required environment variables:
- `POSTGRES_URL`: Database connection string
- `NEXTAUTH_SECRET`: Authentication secret
- `NEXT_PUBLIC_APP_URL`: Application URL

## Documentation

Detailed documentation for each module:
- [Public Site](apps/web/src/app/(site)/README.md)
- [dApp Overview](apps/web/src/app/(dapp)/README.md)
- [KYC System](apps/web/src/app/(dapp)/dapp/(kyc)/README.md)
- [Transaction System](apps/web/src/app/(dapp)/dapp/(transactions)/README.md)
- [Database](packages/db/README.md)
- [Business Modules](packages/modules/README.md)

## Best Practices

- TypeScript for type safety
- Server Components for performance
- Clean code principles
- Comprehensive error handling
- Security best practices
- Responsive design

## Support

For support, questions, or feedback reach out on [Twitter](https://twitter.com/feldbarcelospro).

## Contributors

This project was created by [Felipe Barcelos](https://twitter.com/feldbarcelospro).

### Contributing

Please read our [Git Flow Guide](docs/GITFLOW.md) before contributing.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
