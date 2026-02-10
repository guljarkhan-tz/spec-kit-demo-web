---
description: "Backend APIs required by the Accounting & Invoicing UI"
---

# Backend APIs Needed

Base URL (per contracts): `/v1`

## Auth / Tenant Requirements (applies to all endpoints below)
- `Authorization: Bearer <JWT>` (required by contracts via `BearerAuth`)
- `X-Tenant-Id: <uuid>` (required header for tenant isolation)

## Accounts

### List accounts
- `GET /accounts`
- Query params (optional):
  - `status`: `ACTIVE | SUSPENDED | CLOSED`
  - `type`: `ORGANIZATION | INDIVIDUAL`
  - `limit`: integer (default 50, max 100)
  - `offset`: integer (default 0)
- Response: `200 application/json`
  - Body: `{ data: Account[], pagination?: PaginationInfo }`
  - Header: `X-Total-Count: <int>`

### Get account detail
- `GET /accounts/{accountId}`
- Response: `200 application/json`
  - Body: `AccountDetail` (Account + `metadata?` + `summary?`)

## Ledger Entries (Transactions)

### List ledger entries for an account
- `GET /accounts/{accountId}/ledger-entries`
- Query params (optional):
  - `days`: integer (default 90)
  - `startDate`: `YYYY-MM-DD`
  - `endDate`: `YYYY-MM-DD`
  - `sourceType`: `RIDE | PAYMENT`
  - `minAmount`: number (dollars)
  - `maxAmount`: number (dollars)
  - `limit`: integer (default 100, max 200)
  - `offset`: integer (default 0)
  - `orderBy`: `postingDate | amount`
  - `orderDirection`: `ASC | DESC`
- Response: `200 application/json`
  - Body: `{ data: LedgerEntry[], pagination?: PaginationInfo, summary?: LedgerSummary }`
  - Headers:
    - `X-Total-Count: <int>`
    - `X-Performance-Time: <ms>`

### Get ledger entry detail
- `GET /ledger-entries/{entryId}`
- Response: `200 application/json`
  - Body: `LedgerEntryDetail`

## Invoices

### List invoices for an account
- `GET /accounts/{accountId}/invoices`
- Query params (optional):
  - `status`: `DRAFT | ISSUED | PAID | OVERDUE`
  - `frequency`: `PER_RIDE | DAILY | WEEKLY | MONTHLY`
  - `startDate`: `YYYY-MM-DD`
  - `endDate`: `YYYY-MM-DD`
  - `minAmount`: number (dollars)
  - `maxAmount`: number (dollars)
  - `limit`: integer (default 50, max 100)
  - `offset`: integer (default 0)
  - `orderBy`: `billingPeriodEnd | totalAmount | status`
  - `orderDirection`: `ASC | DESC`
- Response: `200 application/json`
  - Body: `{ data: Invoice[], pagination?: PaginationInfo, summary?: InvoiceSummary }`
  - Headers:
    - `X-Total-Count: <int>`
    - `X-Performance-Time: <ms>`

### Get invoice detail
- `GET /invoices/{invoiceId}`
- Response: `200 application/json`
  - Body: `InvoiceDetail`

### Update invoice metadata (non-financial fields only)
- `PATCH /invoices/{invoiceId}`
- Request body: `InvoiceMetadataUpdate`
  - Allowed fields (per contract intent): `notes?`, `internalReference?`, `billingContact?`
- Response: `200 application/json`
  - Body: updated `InvoiceDetail`

### Download invoice PDF
- `GET /invoices/{invoiceId}/pdf`
- Response: `200 application/pdf` (binary)

## Notes
- The UI is read-only for financial fields; any mutation endpoints for ledger entries are not called by the UI.
- CORS must allow the UI origin(s) (e.g. `http://localhost:4200`) in dev.
- The UI assumes money comes back as `FinancialAmount` objects (`{ value, cents, formatted, currency }`) per the provided contracts + frontend model.
