import { Routes } from '@angular/router';
import { AccountListComponent } from './components/account-list.component';
import { AccountDetailComponent } from './components/account-detail.component';
import { AccountSummaryTabComponent } from './components/account-summary-tab.component';

export const accountsRoutes: Routes = [
  {
    path: 'accounts',
    children: [
      { path: '', component: AccountListComponent },
      {
        path: ':accountId',
        component: AccountDetailComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'summary' },
          { path: 'summary', component: AccountSummaryTabComponent },
          {
            path: 'transactions',
            loadComponent: () =>
              import('../transactions/components/transaction-list.component').then((m) => m.TransactionListComponent),
          },
          {
            path: 'transactions/:entryId',
            loadComponent: () =>
              import('../transactions/components/transaction-list.component').then((m) => m.TransactionListComponent),
          },
          {
            path: 'invoices',
            loadComponent: () => import('../invoices/components/invoice-list.component').then((m) => m.InvoiceListComponent),
            children: [
              {
                path: ':invoiceId',
                loadComponent: () =>
                  import('../invoices/components/invoice-detail.component').then((m) => m.InvoiceDetailComponent),
              },
            ],
          },
        ],
      },
    ],
  },
];
