import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillingContact } from '../models/invoice-metadata.model';
import { InvoiceMetadataUpdate } from '../models/invoice.model';

@Component({
  selector: 'app-invoice-metadata-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <form class="space-y-3" (ngSubmit)="submit()">
      <label class="block">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Internal Reference</span>
        <input class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" [formControl]="form.controls.internalReference" />
      </label>

      <label class="block">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Notes</span>
        <textarea rows="4" class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" [formControl]="form.controls.notes"></textarea>
      </label>

      <div class="grid gap-3 md:grid-cols-2">
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Billing Contact Name</span>
          <input class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" [formControl]="form.controls.billingName" />
        </label>
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Billing Contact Email</span>
          <input type="email" class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" [formControl]="form.controls.billingEmail" />
        </label>
      </div>

      <div class="flex gap-2">
        <button type="submit" [disabled]="form.invalid" class="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Save</button>
        <button type="button" (click)="reset()" class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800">Reset</button>
      </div>

      <div class="text-xs text-slate-500">Only non-financial metadata is editable. Amounts, line items, and payments are immutable.</div>
    </form>
  `,
})
export class InvoiceMetadataEditComponent {
  @Input() initial: InvoiceMetadataUpdate | null = null;
  @Output() save = new EventEmitter<InvoiceMetadataUpdate>();

  private readonly fb = new FormBuilder();

  readonly form = this.fb.nonNullable.group({
    internalReference: ['', [Validators.maxLength(100)]],
    notes: ['', [Validators.maxLength(2000)]],
    billingName: [''],
    billingEmail: [''],
  });

  ngOnChanges(): void {
    this.reset();
  }

  submit(): void {
    const v = this.form.getRawValue();
    const billingContact: BillingContact | undefined =
      v.billingName || v.billingEmail
        ? {
            name: v.billingName,
            email: v.billingEmail,
          }
        : undefined;

    this.save.emit({
      internalReference: v.internalReference || undefined,
      notes: v.notes || undefined,
      billingContact,
    });
  }

  reset(): void {
    this.form.reset({
      internalReference: this.initial?.internalReference ?? '',
      notes: this.initial?.notes ?? '',
      billingName: this.initial?.billingContact?.name ?? '',
      billingEmail: this.initial?.billingContact?.email ?? '',
    });
  }
}
