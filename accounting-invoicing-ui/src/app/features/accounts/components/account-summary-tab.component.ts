import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { AccountStoreService } from '../services/account-store.service';
import { AccountSummaryComponent } from './account-summary.component';

@Component({
  selector: 'app-account-summary-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, AccountSummaryComponent],
  template: `
    <ng-container *ngIf="store.selectedAccount() as account">
      <app-account-summary [account]="account" [summary]="account.summary ?? null" />
    </ng-container>
  `,
})
export class AccountSummaryTabComponent {
  readonly store = inject(AccountStoreService);
}
