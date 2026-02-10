import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-3 text-slate-700" role="status" aria-live="polite">
      <div class="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"></div>
      <span class="text-sm">{{ label }}</span>
    </div>
  `,
})
export class LoadingComponent {
  @Input() label = 'Loading…';
}
