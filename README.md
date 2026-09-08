# WashCare Laundry Services PWA

A professional, English-only, mobile-first, offline-first laundry business management PWA.

## Included in this package
- Dashboard / Home
- Orders and central pricing engine
- Customers
- Items and service pricing
- Payments and payment ledger
- Cash closing
- Expenses
- Employees
- Inventory and low-stock alerts
- Admin settings
- Audit log
- Backup / restore
- Orders CSV export
- Three-copy receipt printing
  - Admin Master
  - Customer
  - Delivery (no pricing)
- PWA manifest + service worker
- Demo seed data
- Supplied receipt reference image

## Run locally
Because this is a PWA, serve the folder over HTTP/HTTPS rather than opening `index.html` directly.

### Python
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080`.

### Node
```bash
npx serve .
```

No npm install is required for the included application.

## Demo data
On first launch, WashCare creates sample customers, items, employee and inventory records. Use Settings → Data Management → Reset to restore the demo dataset.

## Important production note
This package is intentionally dependency-free and fully local-first. It is suitable as a functional PWA foundation and single-device operational deployment. For a multi-device commercial deployment, add a secure backend with authentication, role-based authorization, server-side validation, encrypted transport, centralized database, server-side audit logs and a conflict-aware sync service.
