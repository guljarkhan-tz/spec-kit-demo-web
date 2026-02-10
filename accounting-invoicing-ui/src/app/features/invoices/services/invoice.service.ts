import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@core/services/http.service';
import { AccountId, InvoiceId } from '@shared/models/types';
import { Invoice, InvoiceDetail, InvoiceMetadataUpdate } from '../models/invoice.model';

export interface PaginationInfo {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

export interface ListResponse<T> {
  data: T[];
  pagination?: PaginationInfo;
  summary?: unknown;
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly http = inject(HttpService);

  listInvoices(accountId: AccountId, params?: Record<string, unknown>): Observable<ListResponse<Invoice>> {
    return this.http.get<ListResponse<Invoice>>(`/accounts/${accountId}/invoices`, { params: params as any });
  }

  getInvoiceById(invoiceId: InvoiceId): Observable<InvoiceDetail> {
    return this.http.get<InvoiceDetail>(`/invoices/${invoiceId}`);
  }

  updateInvoiceMetadata(invoiceId: InvoiceId, update: InvoiceMetadataUpdate): Observable<InvoiceDetail> {
    return this.http.patch<InvoiceDetail>(`/invoices/${invoiceId}`, update);
  }
}
