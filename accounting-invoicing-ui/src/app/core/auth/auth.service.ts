import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'aiui.jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(this.loadInitialToken());

  readonly token = computed(() => this.tokenSignal());
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  setToken(token: string | null): void {
    const next = token && token.trim().length > 0 ? token.trim() : null;
    this.tokenSignal.set(next);

    if (next) {
      sessionStorage.setItem(STORAGE_KEY, next);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  clear(): void {
    this.setToken(null);
  }

  private loadInitialToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEY);
  }
}
