import { FinancialAmount } from '@shared/models/financial-amount';
import { AccountId, InvoiceFrequency, InvoiceId, InvoiceStatus, TenantId } from '@shared/models/types';
import { AppliedPayment, BillingPeriod, InvoiceLineItem } from './invoice-components.model';
import { BillingContact, InvoiceAuditInfo } from './invoice-metadata.model';

export interface Invoice {
  id: InvoiceId;
  number: string;
  accountId: AccountId;
  tenantId: TenantId;
  billingPeriod: BillingPeriod;
  frequency: InvoiceFrequency;
  totalAmount: FinancialAmount;
  amountPaid: FinancialAmount;
  outstandingAmount: FinancialAmount;
  status: InvoiceStatus;
  generatedBy: string;
  generatedAt: string;
  lastMetadataUpdate: string;
}

export interface InvoiceDetail extends Invoice {
  lineItems: InvoiceLineItem[];
  appliedPayments: AppliedPayment[];
  notes?: string;
  internalReference?: string;
  billingContact?: BillingContact;
  auditInfo?: InvoiceAuditInfo;
}

export interface InvoiceMetadataUpdate {
  notes?: string;
  internalReference?: string;
  billingContact?: BillingContact;
}
