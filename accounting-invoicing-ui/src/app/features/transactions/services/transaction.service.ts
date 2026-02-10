import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { AccountId, LedgerEntryId } from '@shared/models/types';
import { LedgerEntry, LedgerEntryDetail } from '../models/ledger-entry.model';
import { QueryValue } from '@core/services/http.service';

export interface PaginationInfo {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

export interface ListResponse<T> {
  data: T[];
  pagination?: PaginationInfo;
  summary?: unknown;
}

export interface LedgerFilters {
  days?: number;
  startDate?: string;
  endDate?: string;
  sourceType?: 'RIDE' | 'PAYMENT';
  minAmount?: number;
  maxAmount?: number;
  limit?: number;
  offset?: number;
  orderBy?: 'postingDate' | 'amount';
  orderDirection?: 'ASC' | 'DESC';
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpService);

  listLedgerEntries(accountId: AccountId, filters: LedgerFilters): Observable<ListResponse<LedgerEntry>> {
    return this.http.get<ListResponse<LedgerEntry>>(`/accounts/${accountId}/ledger-entries`, {
      params: filters as unknown as Record<string, QueryValue>,
    });
  }

  getLedgerEntryById(entryId: LedgerEntryId): Observable<LedgerEntryDetail> {
    return this.http.get<LedgerEntryDetail>(`/ledger-entries/${entryId}`);
  }
}
