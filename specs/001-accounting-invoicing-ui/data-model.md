# Data Model: Accounting & Invoicing UI

**Date**: 2026-02-09  
**Context**: Phase 1 design - Entity models and relationships for Angular frontend

## Core Entities

### Account
**Purpose**: Represents the financially responsible entity that owns ledger entries and invoices within a tenant boundary.

**Attributes**:
- `id: AccountId` - Unique identifier for the account
- `tenantId: TenantId` - Tenant isolation boundary (required for all operations)
- `name: string` - Display name (e.g., "City General Hospital", "John Doe")
- `type: AccountType` - Either "ORGANIZATION" or "INDIVIDUAL" 
- `currentBalance: FinancialAmount` - Real-time balance calculated from ledger entries
- `lastInvoiceDate: Date | null` - Date of most recent invoice generation
- `status: AccountStatus` - "ACTIVE", "SUSPENDED", or "CLOSED"
- `metadata: AccountMetadata` - Additional account information
- `createdAt: Date` - Account creation timestamp
- `updatedAt: Date` - Last modification timestamp

**Relationships**:
- One-to-many with LedgerEntry (account has many ledger entries)
- One-to-many with Invoice (account has many invoices)
- Belongs to Tenant (strict isolation boundary)

**Validation Rules**:
- `name` must be non-empty and <= 255 characters
- `currentBalance` must be calculated, never manually set
- `tenantId` must match authenticated user's tenant
- `type` determines validation rules for metadata fields

---

### LedgerEntry
**Purpose**: Immutable financial record representing ride charges or payments posted to an account.

**Attributes**:
- `id: LedgerEntryId` - Unique identifier for the ledger entry
- `accountId: AccountId` - References the owning account
- `tenantId: TenantId` - Tenant isolation boundary
- `postingDate: Date` - When the entry was posted to the ledger
- `sourceType: SourceType` - Either "RIDE" or "PAYMENT"
- `sourceReferenceId: string` - ID of the originating ride or payment record
- `debitAmount: FinancialAmount` - Amount to debit (charges)
- `creditAmount: FinancialAmount` - Amount to credit (payments)
- `runningBalance: FinancialAmount` - Account balance after this entry
- `description: string` - Human-readable description of the transaction
- `linkedInvoiceId: InvoiceId | null` - Associated invoice if applicable
- `metadata: LedgerMetadata` - Additional transaction details
- `readonly: true` - Enforces immutability at type level
- `createdAt: Date` - Entry creation timestamp

**Relationships**:
- Belongs to Account (via accountId)
- May link to Invoice (via linkedInvoiceId)
- References external Ride or Payment (via sourceReferenceId)

**Validation Rules**:
- Exactly one of `debitAmount` or `creditAmount` must be non-zero
- `runningBalance` calculated from previous balance + credit - debit
- `postingDate` cannot be modified once set
- All amounts must be non-negative and precise to cents
- `sourceReferenceId` must exist in corresponding system (ride/payment)

**Business Rules**:
- Entries are immutable once posted
- Running balance must be consistent with account history
- Posting date determines chronological order

---

### Invoice
**Purpose**: Billing document containing ride charges and payment applications for a specific period.

**Attributes**:
- `id: InvoiceId` - Unique identifier for the invoice
- `number: string` - Human-readable invoice number (e.g., "INV-2026-001")
- `accountId: AccountId` - References the billed account
- `tenantId: TenantId` - Tenant isolation boundary
- `billingPeriod: BillingPeriod` - Start and end dates for billing coverage
- `frequency: InvoiceFrequency` - "PER_RIDE", "DAILY", "WEEKLY", or "MONTHLY"
- `totalAmount: FinancialAmount` - Sum of all line items
- `amountPaid: FinancialAmount` - Sum of applied payments
- `outstandingAmount: FinancialAmount` - totalAmount - amountPaid
- `status: InvoiceStatus` - "DRAFT", "ISSUED", "PAID", or "OVERDUE"
- `lineItems: InvoiceLineItem[]` - Individual ride charges
- `appliedPayments: AppliedPayment[]` - Payments allocated to this invoice
- `notes: string` - Editable administrative notes
- `internalReference: string` - Editable internal tracking reference
- `billingContact: BillingContact` - Editable contact information
- `generatedBy: string` - System identifier (always "SYSTEM")
- `generatedAt: Date` - Invoice creation timestamp
- `lastMetadataUpdate: Date` - Last edit to non-financial fields
- `pdfUrl: string` - URL for PDF download

**Relationships**:
- Belongs to Account (via accountId)
- Contains many InvoiceLineItem
- References many LedgerEntry (via line items)
- Contains many AppliedPayment

**Validation Rules**:
- `totalAmount` must equal sum of line item amounts
- `outstandingAmount` must equal totalAmount - amountPaid
- Financial fields (amounts, line items, payments) are immutable
- Metadata fields (notes, reference, contact) are editable
- `billingPeriod.endDate` must be after `startDate`
- `number` must be unique within tenant

**Business Rules**:
- Only non-financial metadata can be modified after creation
- PDF must exactly match backend-generated format
- Status transitions follow business rules (DRAFT→ISSUED→PAID/OVERDUE)

---

## Supporting Types

### FinancialAmount
**Purpose**: Precise financial amount representation preventing floating-point errors.

```typescript
interface FinancialAmount {
  value: number;        // Decimal value for display
  cents: number;        // Integer cents for calculations
  formatted: string;    // Formatted currency display ("$123.45")
  currency: string;     // Currency code ("USD")
}
```

### BillingPeriod
**Purpose**: Defines time range for invoice billing coverage.

```typescript
interface BillingPeriod {
  startDate: Date;
  endDate: Date;
  description: string;  // e.g., "January 2026", "Week of 2026-02-03"
}
```

### InvoiceLineItem
**Purpose**: Individual ride charge within an invoice.

```typescript
interface InvoiceLineItem {
  rideId: string;
  serviceDate: Date;
  fare: FinancialAmount;
  description: string;
  passengerName?: string;
  routeDescription?: string;
}
```

### AppliedPayment
**Purpose**: Payment allocation to specific invoice.

```typescript
interface AppliedPayment {
  paymentId: string;
  amount: FinancialAmount;
  appliedDate: Date;
  paymentMethod: string;
  referenceNumber?: string;
}
```

### BillingContact
**Purpose**: Editable contact information for billing purposes.

```typescript
interface BillingContact {
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}
```

## Branded Type Definitions

```typescript
// Branded types prevent ID confusion and enhance type safety
type TenantId = string & { readonly _brand: unique symbol };
type AccountId = string & { readonly _brand: unique symbol };
type LedgerEntryId = string & { readonly _brand: unique symbol };
type InvoiceId = string & { readonly _brand: unique symbol };

// Enum types for controlled values
type AccountType = 'ORGANIZATION' | 'INDIVIDUAL';
type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
type SourceType = 'RIDE' | 'PAYMENT';
type InvoiceFrequency = 'PER_RIDE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'OVERDUE';
```

## Data Relationships

```
Tenant (1) ←→ (many) Account
Account (1) ←→ (many) LedgerEntry  
Account (1) ←→ (many) Invoice
Invoice (1) ←→ (many) InvoiceLineItem
Invoice (1) ←→ (many) AppliedPayment
LedgerEntry (many) ←→ (0..1) Invoice [via linkedInvoiceId]

External References:
- LedgerEntry.sourceReferenceId → Ride or Payment (external systems)
- InvoiceLineItem.rideId → Ride (external system)
- AppliedPayment.paymentId → Payment (external system)
```

## Aggregation Rules

### Account Balance Calculation
```typescript
// Running balance = previous balance + credits - debits
const calculateRunningBalance = (
  previousBalance: FinancialAmount,
  ledgerEntry: LedgerEntry
): FinancialAmount => {
  const balanceCents = previousBalance.cents + 
                      ledgerEntry.creditAmount.cents - 
                      ledgerEntry.debitAmount.cents;
  return centsToFinancialAmount(balanceCents);
};
```

### Invoice Outstanding Amount
```typescript
// Outstanding = total amount - sum of applied payments
const calculateOutstanding = (
  totalAmount: FinancialAmount,
  appliedPayments: AppliedPayment[]
): FinancialAmount => {
  const paidCents = appliedPayments.reduce(
    (sum, payment) => sum + payment.amount.cents, 
    0
  );
  return centsToFinancialAmount(totalAmount.cents - paidCents);
};
```

## Immutability Constraints

### Read-Only Financial Data
- All `FinancialAmount` fields in posted `LedgerEntry` records
- `totalAmount`, `outstandingAmount` in `Invoice` records  
- `InvoiceLineItem[]` arrays and their contents
- `AppliedPayment[]` arrays and their contents

### Editable Metadata
- `Invoice.notes`, `Invoice.internalReference`, `Invoice.billingContact`
- `Account.name`, `Account.status` (with business rule validation)
- Audit fields: `lastMetadataUpdate` timestamps

## Tenant Isolation Model

All entities MUST include `tenantId` field for strict boundary enforcement:
- API requests filtered by authenticated user's tenant
- UI components verify tenant context before data access
- Cross-tenant references are forbidden and trigger security alerts
- Cache keys include tenant context to prevent data leakage

## Performance Considerations

### Pagination Support
- `LedgerEntry` lists paginated for large transaction histories (>1000 entries)
- Default page size: 100 entries
- Virtual scrolling on frontend with on-demand loading

### Caching Strategy
- `Account` data cached for 5 minutes (balance changes frequently)
- `LedgerEntry` data cached for 15 minutes (immutable once posted)
- `Invoice` data cached for 10 minutes (metadata may change)
- Cache invalidation on real-time updates

### Indexing Requirements
- `LedgerEntry` indexed on `(accountId, postingDate)` for chronological queries
- `Invoice` indexed on `(accountId, billingPeriod.endDate)` for date range filters
- All entities indexed on `tenantId` for isolation performance

This data model supports all functional requirements (FR-001 through FR-015) while maintaining financial data integrity and audit readiness as required by the constitutional principles.