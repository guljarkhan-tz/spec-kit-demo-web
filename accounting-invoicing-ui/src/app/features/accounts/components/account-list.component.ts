import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountStoreService } from '../services/account-store.service';
import { LoadingComponent } from '@shared/components/loading.component';
import { ErrorDisplayComponent } from '@shared/components/error-display.component';
import { amountFormat } from '@shared/models/financial-amount';

@Component({
  selector: 'app-account-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgFor, RouterLink, LoadingComponent, ErrorDisplayComponent],
  template: `
    <div class="p-6">
      <h1 class="text-xl font-semibold text-slate-900">Accounts</h1>

      <div class="mt-4" *ngIf="store.loading()">
        <app-loading label="Loading accounts" />
      </div>

      <div class="mt-4" *ngIf="store.error() as err">
        <app-error-display [apiError]="err" title="Unable to load accounts" />
      </div>

      <div class="mt-4 overflow-x-auto rounded-lg border border-slate-200" *ngIf="!store.loading() && !store.error()">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Name</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Type</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Balance</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Last Invoice</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr
              *ngFor="let account of store.accounts(); trackBy: trackById"
              class="hover:bg-slate-50"
            >
              <td class="px-4 py-3 text-sm">
                <a class="text-blue-700 hover:underline" [routerLink]="['/accounts', account.id, 'summary']">{{ account.name }}</a>
              </td>
              <td class="px-4 py-3 text-sm text-slate-700">{{ account.type }}</td>
              <td class="px-4 py-3 text-sm text-slate-700">{{ format(account.currentBalance) }}</td>
              <td class="px-4 py-3 text-sm text-slate-700">{{ account.lastInvoiceDate ?? '—' }}</td>
              <td class="px-4 py-3 text-sm text-slate-700">{{ account.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 text-sm text-slate-600" *ngIf="!store.loading() && !store.error() && store.accounts().length === 0">
        No accounts found.
      </div>
    </div>
  `,
})
export class AccountListComponent implements OnInit {
  readonly store = inject(AccountStoreService);

  ngOnInit(): void {
    this.store.loadAccounts();
  }

  trackById = (_: number, item: { id: unknown }) => item.id;

  format = amountFormat;
}
