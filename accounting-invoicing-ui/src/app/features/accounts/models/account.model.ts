import { FinancialAmount } from '@shared/models/financial-amount';
import { AccountId, AccountStatus, AccountType, TenantId } from '@shared/models/types';

export interface Account {
  id: AccountId;
  tenantId: TenantId;
  name: string;
  type: AccountType;
  currentBalance: FinancialAmount;
  lastInvoiceDate: string | null;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}
