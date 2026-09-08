# WashCare Data Model

## Primary entities
- Customers: customer profile, contact and loyalty summary.
- Items: catalogue and service-specific prices.
- Orders: commercial transaction and workflow state.
- Order Items: immutable-at-save line snapshot containing item name, service, quantity and calculated price.
- Payments: individual payment transactions.
- Expenses: operating costs.
- Inventory: current stock.
- Inventory Movements: future-ready stock movement ledger.
- Employees: staff and roles.
- Attendance: future-ready attendance ledger.
- Deliveries: future-ready delivery records.
- Loyalty Transactions: future-ready loyalty ledger.
- Cash Transactions: daily cash closing.
- Audit Logs: before/after administrative history.

## Status separation
Order workflow: Received, Processing, Ready, Out for Delivery, Delivered, Cancelled.
Payment workflow: Paid, Partially Paid, Unpaid, Refunded.
