import { Injectable, inject } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NavigationHistoryService {
  private readonly location = inject(Location);

  back(): void {
    this.location.back();
  }

  forward(): void {
    this.location.forward();
  }
}
