import { FinancialAmount } from '@shared/models/financial-amount';

export interface BillingPeriod {
  startDate: string;
  endDate: string;
  description: string;
}

export interface InvoiceLineItem {
  rideId: string;
  serviceDate: string;
  fare: FinancialAmount;
  description: string;
  passengerName?: string;
  routeDescription?: string;
}

export interface AppliedPayment {
  paymentId: string;
  amount: FinancialAmount;
  appliedDate: string;
  paymentMethod: string;
  referenceNumber?: string;
}
