import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { ApiError } from '@core/services/http.service';

@Component({
  selector: 'app-error-display',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf],
  template: `
    <div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-900" role="alert">
      <div class="font-semibold">{{ title }}</div>
      <div class="mt-1 text-sm" *ngIf="message">{{ message }}</div>
      <div class="mt-1 text-sm" *ngIf="!message && apiError">HTTP {{ apiError.status }}: {{ apiError.message }}</div>
    </div>
  `,
})
export class ErrorDisplayComponent {
  @Input() title = 'Something went wrong';
  @Input() message: string | null = null;
  @Input() apiError: ApiError | null = null;
}
