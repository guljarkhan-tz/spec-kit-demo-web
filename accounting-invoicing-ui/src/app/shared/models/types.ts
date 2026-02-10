export type Brand<K, T extends string> = K & { readonly __brand: T };

export type TenantId = Brand<string, 'TenantId'>;
export type AccountId = Brand<string, 'AccountId'>;
export type LedgerEntryId = Brand<string, 'LedgerEntryId'>;
export type InvoiceId = Brand<string, 'InvoiceId'>;

export type AccountType = 'ORGANIZATION' | 'INDIVIDUAL';
export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
export type SourceType = 'RIDE' | 'PAYMENT';
export type InvoiceFrequency = 'PER_RIDE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'OVERDUE';

export const asTenantId = (value: string): TenantId => value as TenantId;
export const asAccountId = (value: string): AccountId => value as AccountId;
export const asLedgerEntryId = (value: string): LedgerEntryId => value as LedgerEntryId;
export const asInvoiceId = (value: string): InvoiceId => value as InvoiceId;
