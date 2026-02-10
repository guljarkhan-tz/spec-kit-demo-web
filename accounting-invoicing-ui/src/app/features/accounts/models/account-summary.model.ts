import { FinancialAmount } from '@shared/models/financial-amount';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface AccountMetadata {
  organizationDetails?: {
    taxId?: string;
    contactPerson?: string;
    departmentName?: string;
  };
  individualDetails?: {
    dateOfBirth?: string;
    guardianName?: string;
  };
  billingAddress?: Address;
  communicationPreferences?: {
    emailNotifications?: boolean;
    paperStatements?: boolean;
  };
}

export interface AccountSummary {
  totalLedgerEntries: number;
  totalInvoices: number;
  currentBalance: FinancialAmount;
  lastActivityDate: string;
  overdueAmount?: FinancialAmount;
}
