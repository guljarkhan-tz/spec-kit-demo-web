import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment';

export const auditLoggingInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.enableAuditLogging) {
    return next(req);
  }

  const start = performance.now();
  return next(req).pipe(
    finalize(() => {
      const elapsedMs = Math.round(performance.now() - start);
      // Intentionally minimal: avoids logging payloads that could include sensitive data.
      console.info('[AUDIT]', req.method, req.urlWithParams, `${elapsedMs}ms`);
    })
  );
};
