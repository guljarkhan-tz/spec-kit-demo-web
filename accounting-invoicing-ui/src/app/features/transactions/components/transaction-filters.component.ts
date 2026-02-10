import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LedgerFilters } from '../services/transaction.service';

@Component({
  selector: 'app-transaction-filters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <form class="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-6" (ngSubmit)="apply()">
      <label class="block md:col-span-1">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Days</span>
        <input type="number" class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" [formControl]="form.controls.days" />
      </label>

      <label class="block md:col-span-2">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Start Date</span>
        <input type="date" class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" [formControl]="form.controls.startDate" />
      </label>

      <label class="block md:col-span-2">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">End Date</span>
        <input type="date" class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" [formControl]="form.controls.endDate" />
      </label>

      <label class="block md:col-span-1">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Source</span>
        <select class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" [formControl]="form.controls.sourceType">
          <option value="">All</option>
          <option value="RIDE">Ride</option>
          <option value="PAYMENT">Payment</option>
        </select>
      </label>

      <label class="block md:col-span-2">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Min Amount ($)</span>
        <input type="number" step="0.01" class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" [formControl]="form.controls.minAmount" />
      </label>

      <label class="block md:col-span-2">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Max Amount ($)</span>
        <input type="number" step="0.01" class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" [formControl]="form.controls.maxAmount" />
      </label>

      <div class="flex items-end gap-2 md:col-span-2">
        <button type="submit" class="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Apply</button>
        <button type="button" (click)="reset()" class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800">Reset</button>
      </div>
    </form>
  `,
})
export class TransactionFiltersComponent {
  @Output() filtersChanged = new EventEmitter<LedgerFilters>();

  readonly form = new FormBuilder().nonNullable.group({
    days: 90,
    startDate: '',
    endDate: '',
    sourceType: '' as '' | 'RIDE' | 'PAYMENT',
    minAmount: null as number | null,
    maxAmount: null as number | null,
  });

  apply(): void {
    const value = this.form.getRawValue();
    const filters: LedgerFilters = {
      days: value.startDate ? undefined : value.days,
      startDate: value.startDate || undefined,
      endDate: value.endDate || undefined,
      sourceType: value.sourceType || undefined,
      minAmount: value.minAmount ?? undefined,
      maxAmount: value.maxAmount ?? undefined,
      orderBy: 'postingDate',
      orderDirection: 'DESC',
    };
    this.filtersChanged.emit(filters);
  }

  reset(): void {
    this.form.reset({
      days: 90,
      startDate: '',
      endDate: '',
      sourceType: '',
      minAmount: null,
      maxAmount: null,
    });
    this.apply();
  }
}
