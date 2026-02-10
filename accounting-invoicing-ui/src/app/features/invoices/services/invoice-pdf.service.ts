import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { InvoiceId } from '@shared/models/types';

@Injectable({ providedIn: 'root' })
export class InvoicePdfService {
  private readonly http = inject(HttpService);

  downloadPdf(invoiceId: InvoiceId, fileName: string): Observable<Blob> {
    return this.http.getBlob(`/invoices/${invoiceId}/pdf`).pipe(
      tap((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      })
    );
  }
}
