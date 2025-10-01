import { BillingAddresses } from "./billingAddressType";
import { Customer } from "./customerType";
import { OrderStatus, PaymentStatus } from "./enums";
import { ProductStock } from "./productStock";
import { Product } from "./productType";
import { ShippingAddress } from "./shippingAddressType";

export interface Sandok {
  id: string;
  customerId?: string;
  status: OrderStatus;
  isDelivered: boolean;
  createdAt: Date;
  updatedAt: Date;
  Customer?: Customer;
  sandokOrder: SandokOrder[];
  sandokProduct: SandokProduct[];
}

// SandokProduct Model
export interface SandokProduct {
  id: string;
  sandokId: string;
  productId: string;
  productStockId: string;
  quantity: number;
  isSold: boolean;
  isReturned: boolean;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
  productStock: ProductStock;
  sandok: Sandok;
}

// SandokOrder Model
export interface SandokOrder {
  id: string;
  transactionId: string;
  status: OrderStatus;

  sandokId?: string;
  billingAdressesId: string;
  shippingAddressId: string;

  isCompleted: boolean;
  orderCancelRequest: boolean;

  totalSoldItems: number;
  totalReturnedItems: number;

  convenienceCharge: number;
  isConvenienceChargePaid: PaymentStatus;
  totalPaymentSoldItems?: number;

  completionTime?: Date;
  orderOn: string;
  createdAt: Date;
  updatedAt: Date;

  customerId: string;
  timeSlotId: string;
  timeSlotOrderRecordId: string;
  timeSlotDate: string;

  billingAdresses: BillingAddresses;
  customer?: Customer;
  sandok?: Sandok;
  shippingAddress: ShippingAddress;
  TimeSlot?: TimeSlot;
  timeSlotOrderRecord?: TimeSlotOrderRecord;
}

// TimeSlot Model
export interface TimeSlot {
  id: string;
  slotName: string;
  timeSlotDate?: Date;
  maxOrders: number;
  currentOrders: number;
  isAvailable: boolean;

  createdAt: Date;
  updatedAt: Date;

  timeSlotOrderRecordId?: string;
  sandokOrders: SandokOrder[];
  TimeSlotOrderRecord?: TimeSlotOrderRecord;
}

// TimeSlotOrderRecord Model
export interface TimeSlotOrderRecord {
  id: string;
  slotName: string;
  timeSlotDate?: Date;
  maxOrders: number;
  currentOrders: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  sandokOrders: SandokOrder[];
  timeSlot: TimeSlot[];
}
