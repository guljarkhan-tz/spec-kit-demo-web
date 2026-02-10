import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

export type QueryValue = string | number | boolean | null | undefined;

@Injectable({ providedIn: 'root' })
export class HttpService {
  private readonly http = inject(HttpClient);

  get<T>(path: string, options?: { params?: Record<string, QueryValue>; headers?: HttpHeaders }): Observable<T> {
    return this.http
      .get<T>(this.toUrl(path), {
        params: this.toParams(options?.params),
        headers: options?.headers,
      })
      .pipe(catchError((e) => this.handleError(e)));
  }

  post<T>(path: string, body: unknown, options?: { params?: Record<string, QueryValue>; headers?: HttpHeaders }): Observable<T> {
    return this.http
      .post<T>(this.toUrl(path), body, {
        params: this.toParams(options?.params),
        headers: options?.headers,
      })
      .pipe(catchError((e) => this.handleError(e)));
  }

  patch<T>(path: string, body: unknown, options?: { params?: Record<string, QueryValue>; headers?: HttpHeaders }): Observable<T> {
    return this.http
      .patch<T>(this.toUrl(path), body, {
        params: this.toParams(options?.params),
        headers: options?.headers,
      })
      .pipe(catchError((e) => this.handleError(e)));
  }

  getBlob(path: string, options?: { params?: Record<string, QueryValue>; headers?: HttpHeaders }): Observable<Blob> {
    return this.http
      .get(this.toUrl(path), {
        params: this.toParams(options?.params),
        headers: options?.headers,
        responseType: 'blob',
      })
      .pipe(catchError((e) => this.handleError(e)));
  }

  private toUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const base = environment.apiUrl.replace(/\/$/, '');
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `${base}${clean}`;
  }

  private toParams(params?: Record<string, QueryValue>): HttpParams | undefined {
    if (!params) return undefined;
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue;
      httpParams = httpParams.set(key, String(value));
    }
    return httpParams;
  }

  private handleError(error: unknown): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      const apiError: ApiError = {
        status: error.status,
        message: error.error?.message ?? error.message ?? 'Request failed',
        details: error.error,
      };
      return throwError(() => apiError);
    }

    return throwError((): ApiError => ({ status: 0, message: 'Unknown error', details: error }));
  }
}
