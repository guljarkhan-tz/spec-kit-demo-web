import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TransactionStoreService } from '../services/transaction-store.service';
import { TransactionFiltersComponent } from './transaction-filters.component';
import { LoadingComponent } from '@shared/components/loading.component';
import { ErrorDisplayComponent } from '@shared/components/error-display.component';
import { AccountId, asAccountId, asLedgerEntryId } from '@shared/models/types';
import { amountFormat } from '@shared/models/financial-amount';
import { LedgerFilters } from '../services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, RouterLink, ScrollingModule, TransactionFiltersComponent, LoadingComponent, ErrorDisplayComponent],
  template: `
    <div class="space-y-4">
      <app-transaction-filters (filtersChanged)="onFilters($event)" />

      <div *ngIf="store.loading()"><app-loading label="Loading transactions" /></div>
      <div *ngIf="store.error() as err"><app-error-display [apiError]="err" title="Unable to load transactions" /></div>

      <div class="rounded-lg border border-slate-200 bg-white" *ngIf="!store.loading() && !store.error()">
        <cdk-virtual-scroll-viewport itemSize="52" class="block h-[520px]">
          <div
            *cdkVirtualFor="let entry of store.entries(); trackBy: trackById"
            class="grid cursor-pointer grid-cols-6 gap-2 border-b border-slate-100 px-4 py-3 text-sm hover:bg-slate-50"
            (click)="select(entry.id)"
          >
            <div class="col-span-1 text-slate-700">{{ entry.postingDate }}</div>
            <div class="col-span-1 text-slate-700">{{ entry.sourceType }}</div>
            <div class="col-span-1 text-slate-700">{{ entry.sourceReferenceId }}</div>
            <div class="col-span-1 text-slate-700">{{ format(entry.debitAmount) }}</div>
            <div class="col-span-1 text-slate-700">{{ format(entry.creditAmount) }}</div>
            <div class="col-span-1 text-slate-700">{{ format(entry.runningBalance) }}</div>
          </div>
        </cdk-virtual-scroll-viewport>
      </div>

      <div class="rounded-lg border border-slate-200 bg-white p-4" *ngIf="store.selected() as selected">
        <div class="flex items-center justify-between">
          <div class="text-sm font-semibold text-slate-900">Ledger Entry Detail</div>
          <a class="text-sm text-blue-700 hover:underline" [routerLink]="['../transactions', selected.id]">Permalink</a>
        </div>

        <dl class="mt-3 grid gap-2 md:grid-cols-2">
          <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Posting Date</dt><dd class="text-sm">{{ selected.postingDate }}</dd></div>
          <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Source</dt><dd class="text-sm">{{ selected.sourceType }} / {{ selected.sourceReferenceId }}</dd></div>
          <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Debit</dt><dd class="text-sm">{{ format(selected.debitAmount) }}</dd></div>
          <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Credit</dt><dd class="text-sm">{{ format(selected.creditAmount) }}</dd></div>
          <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Running Balance</dt><dd class="text-sm">{{ format(selected.runningBalance) }}</dd></div>
          <div><dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</dt><dd class="text-sm">{{ selected.description }}</dd></div>
        </dl>

        <div class="mt-3 text-xs text-slate-500">Read-only: ledger entries are immutable.</div>
      </div>
    </div>
  `,
})
export class TransactionListComponent implements OnInit {
  readonly store = inject(TransactionStoreService);
  private readonly route = inject(ActivatedRoute);

  private accountId: AccountId | null = null;
  private filters: LedgerFilters = { days: 90, orderBy: 'postingDate', orderDirection: 'DESC' };

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      const id = params.get('accountId');
      if (!id) return;
      this.accountId = asAccountId(id);
      this.store.loadEntries(this.accountId, this.filters);
    });

    this.route.paramMap.subscribe((params) => {
      const entryId = params.get('entryId');
      if (entryId) {
        this.store.selectEntry(asLedgerEntryId(entryId));
      }
    });
  }

  onFilters(filters: LedgerFilters): void {
    this.filters = filters;
    if (!this.accountId) return;
    this.store.loadEntries(this.accountId, this.filters);
  }

  select(entryId: unknown): void {
    this.store.selectEntry(asLedgerEntryId(String(entryId)));
  }

  trackById = (_: number, item: { id: unknown }) => item.id;
  format = amountFormat;
}
