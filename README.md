# E-Commerce Platform

A production-ready e-commerce monorepo with Next.js 14 storefront, admin dashboard, and Express/Prisma API.

## Structure

```
ecommerce-platform/
├── BACKEND/          # Express + Prisma API
├── FRONTEND/
│   ├── apps/
│   │   ├── store/   # Next.js 14 customer storefront
│   │   └── admin/   # Next.js 14 admin dashboard
│   └── packages/
│       └── types/   # Shared TypeScript interfaces
```

## Quick Start

1. Copy env files: `cp BACKEND/.env.example BACKEND/.env`
2. Set up your PostgreSQL database and update `DATABASE_URL`
3. Run migrations: `cd BACKEND && npm run db:migrate`
4. Install dependencies: `npm install` (from root)
5. Start dev: `npm run dev`
