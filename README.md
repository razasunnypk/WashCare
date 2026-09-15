# WashCare Laundry Manager

A single-page laundry management app for Washcare Laundry Services, Dubai. Runs entirely in the browser — no server, no database, no monthly fee. Built to be hosted free on GitHub Pages.

## What it does

- **Order entry** — customer details, area/building/flat, delivery date and time, unlimited items, urgent charge, discount, advance payment.
- **80mm receipt printing** — three copies per order in one print job: **Office**, **Customer**, and **Factory** (the factory copy shows quantities and items only, never rates or totals).
- **VAT handling** — rates are VAT-inclusive, matching the current printed bill. The receipt shows Amount Incl. VAT, Amount Before VAT and VAT 5% exactly as before.
- **Payments and dues** — record part payments later, and every receipt shows the customer's previous outstanding plus the current balance.
- **Customers** — automatic customer index built from orders: order count, total billed, pending amount, full order history.
- **Reports** — month-by-month sales, collected vs pending, VAT total, discounts, urgent charges, daily sales chart, item-wise sales, and a printable 80mm day/month report slip.
- **Price list** — your full 176-item WashCare price list is built in, by category, with Dry clean / Wash & iron / Ironing rates. Rates auto-fill during order entry, and every rate is editable in the app.
- **Data** — JSON backup and restore, CSV export for all orders or a single month.
- **Mobile** — works on phone, tablet and desktop, and can be installed to the home screen. Works offline once opened.

## Files

| File | Purpose |
|---|---|
| `index.html` | The entire application |
| `manifest.json` | Home-screen install settings |
| `sw.js` | Offline support (network-first, so it never serves a stale version while online) |
| `icon.png`, `icon.svg` | App icons |

## Deploy on GitHub Pages

1. Create a new repository, e.g. `washcare-laundry-manager`.
2. Upload every file to the root of the repository (**Add file → Upload files**).
3. Go to **Settings → Pages**.
4. Under **Source**, choose `Deploy from a branch`, branch `main`, folder `/ (root)`. Save.
5. Wait about a minute. The app is live at `https://<username>.github.io/washcare-laundry-manager/`.

Keep the repository **private** if you prefer — GitHub Pages on a private repo requires a paid plan, so for a free deployment use a public repo. The repository holds only the app code; customer data never leaves the device.

## First-time setup

1. Open **Settings** → fill in business name, mobile, email, website, TRN (if registered).
2. Set **Next receipt no.** so numbering continues from your current book (currently starts at 4528 → `WC-0004528`).
3. The official WashCare logo is already built in — a high-contrast version for thermal paper on receipts, and the full-colour version in the app header. Upload a different file only if you want to change it.
4. Open **Price list** and check the rates. They come from `Washcare-Price_list.xlsx` exactly as supplied.
5. Take a backup from **Settings → Download backup**.

### Fast service

Every item in the supplied price list charges exactly double for fast service. The app handles this with the **Fast service** switch on the order form, which adds 100% as an urgent charge — the same way it appears on your current printed bills. Change the percentage in **Settings** if that ever stops being true.

## Printing setup (80mm thermal)

- Chrome on Android or desktop gives the cleanest result.
- In the print dialog: paper size **80mm × Receipt / Roll**, margins **None**, scale **100%**, and turn **off** headers and footers.
- Turn on **Background graphics** so the copy label boxes print.
- Choose which copies print by default in **Settings → Which copies to print**.

## Where the data lives

Records are stored in the browser's local storage on the device that created them. That means:

- Data is **not** shared between the shop tablet and your phone.
- Clearing browser data, or "clear site data", deletes the records.
- Use one device as the master till, and download a backup weekly into Google Drive.
- To move to another device: **Download backup** on the old one, **Restore backup** on the new one.

If you later need multiple devices sharing one live database, the app will need a hosted backend (Supabase or Firebase). The current build is deliberately serverless so it cannot break, cost money, or leak customer data.
