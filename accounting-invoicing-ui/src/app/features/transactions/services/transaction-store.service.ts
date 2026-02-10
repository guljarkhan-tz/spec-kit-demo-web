import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiError } from '@core/services/http.service';
import { AccountId, LedgerEntryId } from '@shared/models/types';
import { LedgerEntry, LedgerEntryDetail } from '../models/ledger-entry.model';
import { LedgerFilters, TransactionService } from './transaction.service';

type CacheKey = string;

interface CachedLedger {
  at: number;
  entries: LedgerEntry[];
  filters: LedgerFilters;
}

@Injectable({ providedIn: 'root' })
export class TransactionStoreService {
  private readonly api = inject(TransactionService);

  private readonly entriesSignal = signal<LedgerEntry[]>([]);
  private readonly selectedSignal = signal<LedgerEntryDetail | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<ApiError | null>(null);

  private readonly cache = new Map<CacheKey, CachedLedger>();

  readonly entries = computed(() => this.entriesSignal());
  readonly selected = computed(() => this.selectedSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());

  loadEntries(accountId: AccountId, filters: LedgerFilters): void {
    const key = this.key(accountId, filters);
    const cached = this.cache.get(key);
    const now = Date.now();
    const ttl = environment.cacheTimeoutMs;

    if (cached && now - cached.at <= ttl) {
      this.entriesSignal.set(cached.entries);
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api
      .listLedgerEntries(accountId, { ...filters, limit: filters.limit ?? 200, offset: filters.offset ?? 0 })
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (resp) => {
          const entries = resp.data ?? [];
          this.entriesSignal.set(entries);
          this.cache.set(key, { at: now, entries, filters });
        },
        error: (e: ApiError) => this.errorSignal.set(e),
      });
  }

  selectEntry(entryId: LedgerEntryId): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api
      .getLedgerEntryById(entryId)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (detail) => this.selectedSignal.set(detail),
        error: (e: ApiError) => this.errorSignal.set(e),
      });
  }

  clearSelection(): void {
    this.selectedSignal.set(null);
  }

  private key(accountId: AccountId, filters: LedgerFilters): CacheKey {
    const stable = JSON.stringify({
      days: filters.days,
      startDate: filters.startDate,
      endDate: filters.endDate,
      sourceType: filters.sourceType,
      minAmount: filters.minAmount,
      maxAmount: filters.maxAmount,
      orderBy: filters.orderBy,
      orderDirection: filters.orderDirection,
    });
    return `${accountId}::${stable}`;
  }
}
