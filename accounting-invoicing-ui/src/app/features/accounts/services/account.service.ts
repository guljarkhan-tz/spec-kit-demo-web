import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { Account } from '../models/account.model';
import { AccountId } from '@shared/models/types';
import { AccountMetadata, AccountSummary } from '../models/account-summary.model';

export interface PaginationInfo {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

export interface ListResponse<T> {
  data: T[];
  pagination?: PaginationInfo;
}

export interface AccountDetail extends Account {
  metadata?: AccountMetadata;
  summary?: AccountSummary;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpService);

  listAccounts(params?: {
    status?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }): Observable<ListResponse<Account>> {
    return this.http.get<ListResponse<Account>>('/accounts', { params });
  }

  getAccountById(accountId: AccountId): Observable<AccountDetail> {
    return this.http.get<AccountDetail>(`/accounts/${accountId}`);
  }
}
