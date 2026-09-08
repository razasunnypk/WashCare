# WashCare Architecture

## Scope
WashCare is an English-only, mobile-first, offline-first PWA for laundry business operations.

## Core principles
- Order is the central business entity.
- Order status and payment status are separate.
- Pricing is calculated by one centralized pricing engine.
- Admin edits are permitted but audited.
- Important records use soft-deletion/active flags rather than destructive deletion.
- IndexedDB is the local source for this standalone package; backup/restore provides portability.
- The architecture is deliberately dependency-free so the package runs without a build step.

## Stores
settings, customers, items, orders, order_items, payments, expenses, inventory, inventory_movements, employees, attendance, deliveries, loyalty_transactions, cash_transactions, audit_logs.

## Production extension
For multi-device/cloud deployment, keep the feature modules and data contracts and add an authenticated API + PostgreSQL server. The local repositories should become an offline sync layer rather than moving business logic into UI components.

## Security boundary
The included package is a local-first operational prototype and should not be treated as a multi-user hosted production system until server authentication, authorization, encryption-in-transit, server-side validation and centralized audit storage are deployed.
