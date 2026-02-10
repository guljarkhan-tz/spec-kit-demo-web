import { Injectable, computed, signal } from '@angular/core';
import { TenantId, asTenantId } from '@shared/models/types';

const STORAGE_KEY = 'aiui.tenantId';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly tenantIdSignal = signal<TenantId | null>(this.loadInitialTenantId());

  readonly tenantId = computed(() => this.tenantIdSignal());

  setTenantId(value: string | null): void {
    const next = value && value.trim().length > 0 ? asTenantId(value.trim()) : null;
    this.tenantIdSignal.set(next);

    if (next) {
      sessionStorage.setItem(STORAGE_KEY, next);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  private loadInitialTenantId(): TenantId | null {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? asTenantId(stored) : null;
  }
}
