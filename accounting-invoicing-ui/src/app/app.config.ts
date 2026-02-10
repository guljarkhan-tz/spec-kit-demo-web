import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { tenantIsolationInterceptor } from '@core/interceptors/tenant-isolation.interceptor';
import { auditLoggingInterceptor } from '@core/interceptors/audit-logging.interceptor';
import { errorHandlingInterceptor } from '@core/interceptors/error-handling.interceptor';
import { mockApiInterceptor } from '@core/interceptors/mock-api.interceptor';

const httpInterceptors = [
  ...(environment.useMockApi ? [mockApiInterceptor] : []),
  tenantIsolationInterceptor,
  ...(environment.enableAuditLogging ? [auditLoggingInterceptor] : []),
  errorHandlingInterceptor,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors(httpInterceptors)),
  ]
};
