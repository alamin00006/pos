# SoftGhor POS Backend API

Production-ready NestJS backend for SoftGhor POS Admin Panel.

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (Access + Refresh tokens)
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI

## Features

- Full RBAC with granular permissions
- JWT authentication with refresh token rotation
- Soft delete support
- Pagination, filtering, and sorting
- Stock ledger system
- Customer/Supplier ledger tracking
- Cash book management
- Comprehensive reporting endpoints

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Seed the database

```bash
npx prisma db seed
```

### 6. Start the server

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Documentation

Once running, access Swagger docs at: `http://localhost:3000/docs`

## Default Admin Credentials

- **Email**: admin@softghor.com
- **Password**: admin

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root module
├── common/                 # Shared utilities
│   ├── decorators/         # Custom decorators
│   ├── guards/             # Auth & permission guards
│   ├── interceptors/       # Response interceptors
│   ├── filters/            # Exception filters
│   └── dto/                # Shared DTOs
├── prisma/                 # Prisma service
├── auth/                   # Authentication module
├── users/                  # User management
├── roles/                  # Role management
├── permissions/            # Permission management
├── units/                  # Unit management
├── owners/                 # Owner management
├── bank-accounts/          # Bank account operations
├── brands/                 # Brand management
├── categories/             # Category management
├── subcategories/          # Subcategory management
├── products/               # Product management
├── stock/                  # Stock ledger
├── suppliers/              # Supplier management
├── customers/              # Customer management
├── purchases/              # Purchase management
├── sales/                  # Sales/POS
├── returns/                # Sales returns
├── expenses/               # Expense tracking
├── expense-categories/     # Expense categories
├── payments/               # Payment records
├── damages/                # Damage tracking
├── employees/              # Employee management
├── salary/                 # Salary payments
├── assets/                 # Asset management
├── estimates/              # Estimates/Quotations
├── reports/                # Reporting endpoints
├── settings/               # System settings
└── backup/                 # Backup utilities
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

## License

MIT
