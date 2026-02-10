import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AccountStoreService } from '../services/account-store.service';
import { LoadingComponent } from '@shared/components/loading.component';
import { ErrorDisplayComponent } from '@shared/components/error-display.component';
import { asAccountId } from '@shared/models/types';
import { BreadcrumbComponent } from '@shared/components/breadcrumb.component';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, RouterLink, RouterLinkActive, RouterOutlet, LoadingComponent, ErrorDisplayComponent, BreadcrumbComponent],
  template: `
    <div class="p-6">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <app-breadcrumb
            [items]="[
              { label: 'Accounts', link: ['/accounts'] },
              { label: (store.selectedAccount()?.name ?? 'Account') }
            ]"
          />
          <h1 class="mt-2 text-xl font-semibold text-slate-900" *ngIf="store.selectedAccount() as account">
            {{ account.name }}
          </h1>
        </div>
      </div>

      <div *ngIf="store.loading()">
        <app-loading label="Loading account" />
      </div>

      <div class="mt-4" *ngIf="store.error() as err">
        <app-error-display [apiError]="err" title="Unable to load account" />
      </div>

      <div class="mt-4" *ngIf="!store.loading() && !store.error() && store.selectedAccount()">
        <nav class="flex gap-2 border-b border-slate-200">
          <a class="px-3 py-2 text-sm text-slate-700 hover:text-slate-900" [routerLink]="['summary']" routerLinkActive="border-b-2 border-slate-900 font-semibold" [routerLinkActiveOptions]="{ exact: true }">Summary</a>
          <a class="px-3 py-2 text-sm text-slate-700 hover:text-slate-900" [routerLink]="['transactions']" routerLinkActive="border-b-2 border-slate-900 font-semibold">Transactions</a>
          <a class="px-3 py-2 text-sm text-slate-700 hover:text-slate-900" [routerLink]="['invoices']" routerLinkActive="border-b-2 border-slate-900 font-semibold">Invoices</a>
        </nav>

        <div class="mt-4">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
})
export class AccountDetailComponent implements OnInit {
  readonly store = inject(AccountStoreService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const accountId = params.get('accountId');
      if (accountId) {
        this.store.loadAccount(asAccountId(accountId));
      }
    });
  }
}
