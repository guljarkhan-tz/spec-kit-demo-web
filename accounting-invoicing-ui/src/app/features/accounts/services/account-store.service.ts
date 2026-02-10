import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ApiError } from '@core/services/http.service';
import { TenantService } from '@core/auth/tenant.service';
import { AccountService, AccountDetail } from './account.service';
import { Account } from '../models/account.model';
import { AccountId } from '@shared/models/types';

@Injectable({ providedIn: 'root' })
export class AccountStoreService {
  private readonly tenantService = inject(TenantService);
  private readonly api = inject(AccountService);

  private readonly accountsSignal = signal<Account[]>([]);
  private readonly selectedAccountSignal = signal<AccountDetail | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<ApiError | null>(null);

  readonly accounts = computed(() => this.accountsSignal());
  readonly selectedAccount = computed(() => this.selectedAccountSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());

  loadAccounts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api
      .listAccounts({ limit: 50, offset: 0 })
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (resp) => {
          this.accountsSignal.set(resp.data ?? []);
        },
        error: (e: ApiError) => this.errorSignal.set(e),
      });
  }

  loadAccount(accountId: AccountId): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api
      .getAccountById(accountId)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (account) => {
          const tenantId = this.tenantService.tenantId();
          if (tenantId && account.tenantId && account.tenantId !== tenantId) {
            this.errorSignal.set({ status: 403, message: 'Tenant boundary violation', details: account });
            this.selectedAccountSignal.set(null);
            return;
          }
          this.selectedAccountSignal.set(account);
        },
        error: (e: ApiError) => this.errorSignal.set(e),
      });
  }
}
