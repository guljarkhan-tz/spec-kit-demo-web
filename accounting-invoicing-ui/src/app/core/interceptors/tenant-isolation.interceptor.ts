import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { TenantService } from '@core/auth/tenant.service';

export const tenantIsolationInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantService = inject(TenantService);
  const authService = inject(AuthService);
  const tenantId = tenantService.tenantId();
  const token = authService.token();

  const setHeaders: Record<string, string> = {};
  if (tenantId) setHeaders['X-Tenant-Id'] = tenantId;
  if (token) setHeaders['Authorization'] = `Bearer ${token}`;

  return next(Object.keys(setHeaders).length > 0 ? req.clone({ setHeaders }) : req);
};
