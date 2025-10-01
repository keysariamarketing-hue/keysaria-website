import { Customer } from "./customerType";
import { Product } from "./productType";

export interface Wishlist {
  id: string;
  customerId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  customer: Customer;
  product: Product;
}
