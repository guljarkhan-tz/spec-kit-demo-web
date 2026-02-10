import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { Account } from '../models/account.model';
import { AccountSummary } from '../models/account-summary.model';
import { amountFormat } from '@shared/models/financial-amount';

@Component({
  selector: 'app-account-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf],
  template: `
    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-lg border border-slate-200 bg-white p-4">
        <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Current Balance</div>
        <div class="mt-1 text-lg font-semibold text-slate-900">{{ format(account.currentBalance) }}</div>
      </div>

      <div class="rounded-lg border border-slate-200 bg-white p-4" *ngIf="summary">
        <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Activity</div>
        <div class="mt-1 text-sm text-slate-800">{{ summary.lastActivityDate }}</div>
        <div class="mt-2 text-sm text-slate-700">Ledger entries: {{ summary.totalLedgerEntries }}</div>
        <div class="text-sm text-slate-700">Invoices: {{ summary.totalInvoices }}</div>
      </div>
    </div>
  `,
})
export class AccountSummaryComponent {
  @Input({ required: true }) account!: Account;
  @Input() summary: AccountSummary | null = null;

  format = amountFormat;
}
