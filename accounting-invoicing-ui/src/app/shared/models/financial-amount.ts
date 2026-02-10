export type CurrencyCode = 'USD' | (string & {});

export interface FinancialAmount {
  value: number;
  cents: number;
  formatted: string;
  currency: CurrencyCode;
}

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const amountFromCents = (cents: number, currency: CurrencyCode = 'USD'): FinancialAmount => {
  if (!Number.isInteger(cents)) {
    throw new Error('FinancialAmount cents must be an integer');
  }
  const value = cents / 100;
  const formatted = currency === 'USD' ? usdFormatter.format(value) : `${value.toFixed(2)} ${currency}`;
  return { cents, currency, value, formatted };
};

export const amountFromDollars = (value: number, currency: CurrencyCode = 'USD'): FinancialAmount => {
  if (!Number.isFinite(value)) {
    throw new Error('FinancialAmount value must be finite');
  }
  return amountFromCents(Math.round(value * 100), currency);
};

export const amountAdd = (a: FinancialAmount, b: FinancialAmount): FinancialAmount => {
  if (a.currency !== b.currency) {
    throw new Error('Currency mismatch');
  }
  return amountFromCents(a.cents + b.cents, a.currency);
};

export const amountSub = (a: FinancialAmount, b: FinancialAmount): FinancialAmount => {
  if (a.currency !== b.currency) {
    throw new Error('Currency mismatch');
  }
  return amountFromCents(a.cents - b.cents, a.currency);
};

export const amountIsZero = (a: FinancialAmount): boolean => a.cents === 0;

export const amountFormat = (a: FinancialAmount): string => {
  return a.formatted;
};

export const normalizeAmount = (a: FinancialAmount): FinancialAmount => amountFromCents(a.cents, a.currency);
