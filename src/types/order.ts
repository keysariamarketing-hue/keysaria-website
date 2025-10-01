import { BillingAddresses } from "./billingAddressType";
import { Coupon } from "./couponType";
import { Customer } from "./customerType";
import { ModeOfPayment, OrderStatus, PaymentStatus } from "./enums";
import { ProductStock } from "./productStock";
import { Product } from "./productType";
import { ShippingAddress } from "./shippingAddressType";

export interface NewOrder {
  id: string;
  transactionId: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  modeOfPayment: ModeOfPayment;
  customerId: string;
  subTotal: number;
  finalTotal: number;
  orderItems: NewOrderitem[];
  couponApplied?: Coupon;
  shipRocketOrderId?: string;
  shipRocketShipmentId?: string;
  shipRocketTrackId?: string;
  shipRocketCourierId?: string;
  shipRocketAWBId?: string;
  billingAddressId: string;
  shippingAddressId: string;
  orderOn: string;
  createdAt: Date;
  updatedOn: Date;
  billingAddress: BillingAddresses;
  customer: Customer;
  shippingAddress: ShippingAddress;
  couponId?: string;
}

export interface NewOrderitem {
  id: string;
  newOrderId?: string;
  productStockId: string;
  productId: string;
  productQuantity: number;
  product: Product;
  productStock: ProductStock;
  askedForExchange: boolean;
  isProductExchanged: boolean;
  productExchangeReason?: string;
  productExchangeDesc?: string;
  productExchangeAttachment: string[];
  createdAt: Date;
  updatedOn: Date;
}
