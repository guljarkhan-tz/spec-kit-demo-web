import { Injectable } from '@angular/core';
import { AccountId, InvoiceId, LedgerEntryId } from '@shared/models/types';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  toAccounts(): any[] {
    return ['/accounts'];
  }

  toAccount(accountId: AccountId): any[] {
    return ['/accounts', accountId, 'summary'];
  }

  toTransactions(accountId: AccountId): any[] {
    return ['/accounts', accountId, 'transactions'];
  }

  toTransactionDetail(accountId: AccountId, entryId: LedgerEntryId): any[] {
    return ['/accounts', accountId, 'transactions', entryId];
  }

  toInvoices(accountId: AccountId): any[] {
    return ['/accounts', accountId, 'invoices'];
  }

  toInvoiceDetail(accountId: AccountId, invoiceId: InvoiceId): any[] {
    return ['/accounts', accountId, 'invoices', invoiceId];
  }
}
