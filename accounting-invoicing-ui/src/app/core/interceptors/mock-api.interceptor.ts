import { HttpHeaders, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { amountFromCents } from '@shared/models/financial-amount';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs';
import { environment } from '../../../environments/environment';

type MockListResponse<T> = {
  data: T[];
  pagination?: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
  summary?: unknown;
};

const MOCK_LATENCY_MS = 200;

const tenantId = '550e8400-e29b-41d4-a716-446655440000';

const accounts = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    tenantId,
    name: 'City General Hospital',
    type: 'ORGANIZATION',
    currentBalance: amountFromCents(238_420),
    lastInvoiceDate: '2026-01-31',
    status: 'ACTIVE',
    createdAt: '2025-06-15T10:30:00Z',
    updatedAt: '2026-02-09T14:22:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    tenantId,
    name: 'Sunrise Senior Living',
    type: 'ORGANIZATION',
    currentBalance: amountFromCents(-52_990),
    lastInvoiceDate: '2026-01-15',
    status: 'ACTIVE',
    createdAt: '2025-09-02T12:10:00Z',
    updatedAt: '2026-02-08T09:05:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    tenantId,
    name: 'Jane Doe',
    type: 'INDIVIDUAL',
    currentBalance: amountFromCents(12_300),
    lastInvoiceDate: null,
    status: 'SUSPENDED',
    createdAt: '2025-11-20T08:00:00Z',
    updatedAt: '2026-02-01T16:30:00Z',
  },
] as const;

const accountDetailsById: Record<string, any> = {
  [accounts[0].id]: {
    ...accounts[0],
    metadata: {
      organizationDetails: {
        taxId: '12-3456789',
        contactPerson: 'A. Rivera',
        departmentName: 'Patient Transport',
      },
      communicationPreferences: {
        emailNotifications: true,
        paperStatements: false,
      },
    },
    summary: {
      totalLedgerEntries: 127,
      totalInvoices: 12,
      currentBalance: accounts[0].currentBalance,
      lastActivityDate: '2026-02-08',
    },
  },
  [accounts[1].id]: {
    ...accounts[1],
    metadata: {
      organizationDetails: {
        taxId: '98-7654321',
        contactPerson: 'M. Chen',
        departmentName: 'Operations',
      },
    },
    summary: {
      totalLedgerEntries: 52,
      totalInvoices: 6,
      currentBalance: accounts[1].currentBalance,
      lastActivityDate: '2026-02-07',
    },
  },
  [accounts[2].id]: {
    ...accounts[2],
    metadata: {
      individualDetails: {
        dateOfBirth: '1986-04-11',
        guardianName: null,
      },
      communicationPreferences: {
        emailNotifications: true,
        paperStatements: false,
      },
    },
    summary: {
      totalLedgerEntries: 8,
      totalInvoices: 0,
      currentBalance: accounts[2].currentBalance,
      lastActivityDate: '2026-01-30',
    },
  },
};

const ledgerEntriesByAccountId: Record<string, any[]> = {
  [accounts[0].id]: Array.from({ length: 250 }).map((_, idx) => {
    const debit = idx % 3 === 0 ? amountFromCents(5_000 + (idx % 10) * 250) : amountFromCents(0);
    const credit = idx % 3 !== 0 ? amountFromCents(3_500 + (idx % 10) * 200) : amountFromCents(0);
    const running = amountFromCents(238_420 - idx * 125);
    const isRide = idx % 2 === 0;
    const invoiceId = idx % 11 === 0 ? '650e8400-e29b-41d4-a716-446655440010' : null;
    return {
      id: `750e8400-e29b-41d4-a716-44665544${String(idx).padStart(4, '0')}`,
      accountId: accounts[0].id,
      tenantId,
      postingDate: new Date(Date.now() - idx * 86_400_000).toISOString().slice(0, 10),
      sourceType: isRide ? 'RIDE' : 'PAYMENT',
      sourceReferenceId: isRide ? `ride_${1000 + idx}` : `pay_${1000 + idx}`,
      debitAmount: debit,
      creditAmount: credit,
      runningBalance: running,
      description: isRide ? 'Ride charge' : 'Payment received',
      linkedInvoiceId: invoiceId,
      metadata: {
        postedBy: 'system',
        notes: idx % 17 === 0 ? 'Manual review required' : undefined,
        sourceDetails: isRide ? { rideId: `ride_${1000 + idx}` } : { paymentId: `pay_${1000 + idx}`, method: 'ACH' },
        relatedInvoiceNumber: invoiceId ? 'INV-10010' : undefined,
      },
      readonly: true,
      createdAt: new Date(Date.now() - idx * 86_400_000).toISOString(),
      auditTrail: { createdBy: 'system', createdAt: new Date(Date.now() - idx * 86_400_000).toISOString() },
    };
  }),
  [accounts[1].id]: [],
  [accounts[2].id]: [],
};

const invoicesByAccountId: Record<string, any[]> = {
  [accounts[0].id]: [
    {
      id: '650e8400-e29b-41d4-a716-446655440010',
      number: 'INV-10010',
      accountId: accounts[0].id,
      tenantId,
      billingPeriod: { startDate: '2026-01-01', endDate: '2026-01-31' },
      frequency: 'MONTHLY',
      totalAmount: amountFromCents(125_000),
      amountPaid: amountFromCents(50_000),
      outstandingAmount: amountFromCents(75_000),
      status: 'ISSUED',
      generatedBy: 'billing-service',
      generatedAt: '2026-02-01T00:05:00Z',
      lastMetadataUpdate: '2026-02-02T12:00:00Z',
    },
  ],
  [accounts[1].id]: [],
  [accounts[2].id]: [],
};

const invoiceDetailsById: Record<string, any> = {
  ['650e8400-e29b-41d4-a716-446655440010']: {
    ...invoicesByAccountId[accounts[0].id][0],
    lineItems: [
      { description: 'Transport rides', quantity: 50, unitPrice: amountFromCents(2_000), total: amountFromCents(100_000) },
      { description: 'After-hours surcharge', quantity: 5, unitPrice: amountFromCents(5_000), total: amountFromCents(25_000) },
    ],
    appliedPayments: [{ amount: amountFromCents(50_000), appliedAt: '2026-02-05T10:00:00Z', reference: 'PAY-20441' }],
    notes: 'Net 30',
    internalReference: 'OPS-REF-1234',
    billingContact: { name: 'Accounts Payable', email: 'ap@citygeneral.example', phone: '555-0100' },
    auditInfo: { createdAt: '2026-02-01T00:05:00Z', createdBy: 'billing-service', lastUpdatedAt: '2026-02-02T12:00:00Z' },
  },
};

const getPathname = (rawUrl: string): string => {
  try {
    return new URL(rawUrl).pathname;
  } catch {
    return rawUrl;
  }
};

const normalizePath = (pathname: string): string => {
  const clean = pathname.replace(/\/+$/, '');
  return clean.startsWith('/v1') ? clean.slice(3) : clean;
};

const notFound = (message: string) =>
  throwError(() => ({ status: 404, message, details: { mock: true } }));

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMockApi) {
    return next(req);
  }

  const pathname = normalizePath(getPathname(req.url));

  const isPotentialApiCall =
    pathname.startsWith('/accounts') ||
    pathname.startsWith('/ledger-entries') ||
    pathname.startsWith('/invoices') ||
    req.url.includes('api.accounting.example.com') ||
    req.url.includes('staging-api.accounting.example.com');

  if (!isPotentialApiCall) {
    return next(req);
  }

  // Accounts
  if (req.method === 'GET' && pathname === '/accounts') {
    const status = req.params.get('status');
    const type = req.params.get('type');
    const limit = Number(req.params.get('limit') ?? 50);
    const offset = Number(req.params.get('offset') ?? 0);

    let filtered = [...accounts];
    if (status) filtered = filtered.filter((a) => a.status === status);
    if (type) filtered = filtered.filter((a) => a.type === type);

    const total = filtered.length;
    const page = filtered.slice(offset, offset + limit);
    const body: MockListResponse<any> = {
      data: page,
      pagination: { limit, offset, total, hasMore: offset + limit < total },
    };

    return of(
      new HttpResponse({
        status: 200,
        body,
        headers: new HttpHeaders({ 'X-Total-Count': String(total) }),
      })
    ).pipe(delay(MOCK_LATENCY_MS));
  }

  const accountDetailMatch = pathname.match(/^\/accounts\/([^/]+)$/);
  if (req.method === 'GET' && accountDetailMatch) {
    const accountId = accountDetailMatch[1];
    const detail = accountDetailsById[accountId];
    if (!detail) return notFound('Account not found').pipe(delay(MOCK_LATENCY_MS));
    return of(new HttpResponse({ status: 200, body: detail })).pipe(delay(MOCK_LATENCY_MS));
  }

  // Ledger entries
  const ledgerListMatch = pathname.match(/^\/accounts\/([^/]+)\/ledger-entries$/);
  if (req.method === 'GET' && ledgerListMatch) {
    const accountId = ledgerListMatch[1];
    const limit = Number(req.params.get('limit') ?? 100);
    const offset = Number(req.params.get('offset') ?? 0);
    const sourceType = req.params.get('sourceType');

    let entries = ledgerEntriesByAccountId[accountId] ?? [];
    if (sourceType) entries = entries.filter((e) => e.sourceType === sourceType);

    const total = entries.length;
    const page = entries.slice(offset, offset + limit);

    const body: MockListResponse<any> = {
      data: page,
      pagination: { limit, offset, total, hasMore: offset + limit < total },
      summary: {
        totalEntries: total,
      },
    };

    return of(
      new HttpResponse({
        status: 200,
        body,
        headers: new HttpHeaders({ 'X-Total-Count': String(total), 'X-Performance-Time': '12' }),
      })
    ).pipe(delay(MOCK_LATENCY_MS));
  }

  const ledgerDetailMatch = pathname.match(/^\/ledger-entries\/([^/]+)$/);
  if (req.method === 'GET' && ledgerDetailMatch) {
    const entryId = ledgerDetailMatch[1];
    const entry = Object.values(ledgerEntriesByAccountId)
      .flat()
      .find((e) => e.id === entryId);
    if (!entry) return notFound('Ledger entry not found').pipe(delay(MOCK_LATENCY_MS));
    return of(new HttpResponse({ status: 200, body: entry })).pipe(delay(MOCK_LATENCY_MS));
  }

  // Invoices
  const invoiceListMatch = pathname.match(/^\/accounts\/([^/]+)\/invoices$/);
  if (req.method === 'GET' && invoiceListMatch) {
    const accountId = invoiceListMatch[1];
    const limit = Number(req.params.get('limit') ?? 50);
    const offset = Number(req.params.get('offset') ?? 0);
    const status = req.params.get('status');

    let list = invoicesByAccountId[accountId] ?? [];
    if (status) list = list.filter((i) => i.status === status);

    const total = list.length;
    const page = list.slice(offset, offset + limit);

    const body: MockListResponse<any> = {
      data: page,
      pagination: { limit, offset, total, hasMore: offset + limit < total },
      summary: {
        totalInvoices: total,
      },
    };

    return of(
      new HttpResponse({
        status: 200,
        body,
        headers: new HttpHeaders({ 'X-Total-Count': String(total), 'X-Performance-Time': '9' }),
      })
    ).pipe(delay(MOCK_LATENCY_MS));
  }

  const invoiceDetailMatch = pathname.match(/^\/invoices\/([^/]+)$/);
  if (req.method === 'GET' && invoiceDetailMatch) {
    const invoiceId = invoiceDetailMatch[1];
    const detail = invoiceDetailsById[invoiceId];
    if (!detail) return notFound('Invoice not found').pipe(delay(MOCK_LATENCY_MS));
    return of(new HttpResponse({ status: 200, body: detail })).pipe(delay(MOCK_LATENCY_MS));
  }

  if (req.method === 'PATCH' && invoiceDetailMatch) {
    const invoiceId = invoiceDetailMatch[1];
    const existing = invoiceDetailsById[invoiceId];
    if (!existing) return notFound('Invoice not found').pipe(delay(MOCK_LATENCY_MS));

    const update = (req.body ?? {}) as any;
    const nextDetail = {
      ...existing,
      notes: update.notes ?? existing.notes,
      internalReference: update.internalReference ?? existing.internalReference,
      billingContact: update.billingContact ?? existing.billingContact,
      lastMetadataUpdate: new Date().toISOString(),
      auditInfo: {
        ...(existing.auditInfo ?? {}),
        lastUpdatedAt: new Date().toISOString(),
      },
    };

    invoiceDetailsById[invoiceId] = nextDetail;

    return of(new HttpResponse({ status: 200, body: nextDetail })).pipe(delay(MOCK_LATENCY_MS));
  }

  const invoicePdfMatch = pathname.match(/^\/invoices\/([^/]+)\/pdf$/);
  if (req.method === 'GET' && invoicePdfMatch) {
    const invoiceId = invoicePdfMatch[1];
    const exists = invoiceDetailsById[invoiceId];
    if (!exists) return notFound('Invoice not found').pipe(delay(MOCK_LATENCY_MS));

    const blob = new Blob([`Mock PDF for invoice ${invoiceId}`], { type: 'application/pdf' });
    return of(
      new HttpResponse({
        status: 200,
        body: blob,
        headers: new HttpHeaders({ 'Content-Type': 'application/pdf' }),
      })
    ).pipe(delay(MOCK_LATENCY_MS));
  }

  return notFound(`Mock endpoint not implemented: ${req.method} ${pathname}`).pipe(delay(MOCK_LATENCY_MS));
};
