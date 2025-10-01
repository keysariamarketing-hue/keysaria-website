import { Customer } from "./customerType";

export interface Payment {
  id: string;
  paymentId: string;
  orderId: string;
  signature: string;
  paymentStatus: boolean;
  paymentAmount?: number;
  paymentMethod?: string;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
  email?: string;
  contact?: string;
  token_id?: string;
  fee?: number;
  tax?: number;
  rrn?: string;
  upiTransactionId?: string;
  customerId?: string;
  Customer?: Customer;
}
