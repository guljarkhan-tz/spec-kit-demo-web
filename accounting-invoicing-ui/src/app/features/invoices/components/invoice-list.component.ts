import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { InvoiceStoreService } from '../services/invoice-store.service';
import { LoadingComponent } from '@shared/components/loading.component';
import { ErrorDisplayComponent } from '@shared/components/error-display.component';
import { asAccountId } from '@shared/models/types';
import { amountFormat } from '@shared/models/financial-amount';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgFor, RouterLink, RouterOutlet, LoadingComponent, ErrorDisplayComponent],
  template: `
    <div class="space-y-4">
      <div *ngIf="store.loading()"><app-loading label="Loading invoices" /></div>
      <div *ngIf="store.error() as err"><app-error-display [apiError]="err" title="Unable to load invoices" /></div>

      <div class="rounded-lg border border-slate-200 bg-white" *ngIf="!store.loading() && !store.error()">
        <div class="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">Invoices</div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Number</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Period</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Frequency</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Total</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Outstanding</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr *ngFor="let invoice of store.invoices(); trackBy: trackById" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm">
                  <a class="text-blue-700 hover:underline" [routerLink]="['./', invoice.id]">{{ invoice.number }}</a>
                </td>
                <td class="px-4 py-3 text-sm text-slate-700">{{ invoice.billingPeriod.description }}</td>
                <td class="px-4 py-3 text-sm text-slate-700">{{ invoice.frequency }}</td>
                <td class="px-4 py-3 text-sm text-slate-700">{{ format(invoice.totalAmount) }}</td>
                <td class="px-4 py-3 text-sm text-slate-700">{{ format(invoice.outstandingAmount) }}</td>
                <td class="px-4 py-3 text-sm text-slate-700">{{ invoice.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <router-outlet />
    </div>
  `,
})
export class InvoiceListComponent implements OnInit {
  readonly store = inject(InvoiceStoreService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      const accountId = params.get('accountId');
      if (accountId) {
        this.store.loadInvoices(asAccountId(accountId));
      }
    });
  }

  trackById = (_: number, item: { id: unknown }) => item.id;
  format = amountFormat;
}
