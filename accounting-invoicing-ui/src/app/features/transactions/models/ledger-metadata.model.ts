export interface SourceDetails {
  rideId?: string;
  paymentId?: string;
  method?: string;
  referenceNumber?: string;
}

export interface LedgerMetadata {
  postedBy?: string;
  notes?: string;
  sourceDetails?: SourceDetails;
  relatedInvoiceNumber?: string;
}
