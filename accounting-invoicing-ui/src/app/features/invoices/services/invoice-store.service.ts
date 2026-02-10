import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiError } from '@core/services/http.service';
import { AccountId, InvoiceId } from '@shared/models/types';
import { Invoice, InvoiceDetail, InvoiceMetadataUpdate } from '../models/invoice.model';
import { InvoiceService } from './invoice.service';

interface CachedInvoices {
  at: number;
  invoices: Invoice[];
}

@Injectable({ providedIn: 'root' })
export class InvoiceStoreService {
  private readonly api = inject(InvoiceService);

  private readonly invoicesSignal = signal<Invoice[]>([]);
  private readonly selectedSignal = signal<InvoiceDetail | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<ApiError | null>(null);

  private readonly cache = new Map<string, CachedInvoices>();

  readonly invoices = computed(() => this.invoicesSignal());
  readonly selected = computed(() => this.selectedSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());

  loadInvoices(accountId: AccountId): void {
    const key = String(accountId);
    const now = Date.now();
    const cached = this.cache.get(key);
    if (cached && now - cached.at <= environment.cacheTimeoutMs) {
      this.invoicesSignal.set(cached.invoices);
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api
      .listInvoices(accountId, { limit: 50, offset: 0, orderBy: 'billingPeriodEnd', orderDirection: 'DESC' })
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (resp) => {
          const invoices = resp.data ?? [];
          this.invoicesSignal.set(invoices);
          this.cache.set(key, { at: now, invoices });
        },
        error: (e: ApiError) => this.errorSignal.set(e),
      });
  }

  loadInvoice(invoiceId: InvoiceId): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api
      .getInvoiceById(invoiceId)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (detail) => this.selectedSignal.set(detail),
        error: (e: ApiError) => this.errorSignal.set(e),
      });
  }

  updateMetadata(invoiceId: InvoiceId, update: InvoiceMetadataUpdate): void {
    const current = this.selectedSignal();
    if (!current) return;

    // Optimistic update: apply locally first.
    this.selectedSignal.set({ ...current, ...update, lastMetadataUpdate: new Date().toISOString() });

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api
      .updateInvoiceMetadata(invoiceId, update)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (detail) => this.selectedSignal.set(detail),
        error: (e: ApiError) => {
          this.errorSignal.set(e);
          // Re-fetch to reconcile if server rejected.
          this.loadInvoice(invoiceId);
        },
      });
  }
}
