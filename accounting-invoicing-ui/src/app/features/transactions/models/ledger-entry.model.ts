import { FinancialAmount } from '@shared/models/financial-amount';
import { AccountId, InvoiceId, LedgerEntryId, SourceType, TenantId } from '@shared/models/types';
import { LedgerMetadata } from './ledger-metadata.model';

export interface LedgerEntry {
  id: LedgerEntryId;
  accountId: AccountId;
  tenantId: TenantId;
  postingDate: string;
  sourceType: SourceType;
  sourceReferenceId: string;
  debitAmount: FinancialAmount;
  creditAmount: FinancialAmount;
  runningBalance: FinancialAmount;
  description: string;
  linkedInvoiceId: InvoiceId | null;
  metadata?: LedgerMetadata;
  readonly: true;
  createdAt: string;
}

export interface LedgerEntryDetail extends LedgerEntry {
  auditTrail?: {
    createdBy?: string;
    createdAt?: string;
  };
}
