export interface BillingContact {
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface InvoiceAuditInfo {
  generatedBy: string;
  generatedAt: string;
  lastMetadataUpdate: string;
  lastMetadataUpdateBy?: string;
}
