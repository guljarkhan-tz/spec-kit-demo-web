import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: any[];
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgIf, RouterLink],
  template: `
    <nav aria-label="Breadcrumb" *ngIf="items?.length" class="text-sm">
      <ol class="flex flex-wrap items-center gap-2 text-slate-600">
        <li *ngFor="let item of items; let last = last">
          <ng-container *ngIf="item.link && !last; else plain">
            <a class="text-blue-700 hover:underline" [routerLink]="item.link">{{ item.label }}</a>
            <span class="mx-2">/</span>
          </ng-container>
          <ng-template #plain>
            <span class="text-slate-700" [class.font-semibold]="last">{{ item.label }}</span>
            <span class="mx-2" *ngIf="!last">/</span>
          </ng-template>
        </li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
