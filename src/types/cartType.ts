import { ProductStock } from "./productStock";
import { Product } from "./productType";

export interface MyCartType {
  id: string;
  quantity: number;
  customerId: string;
  productId: string;
  productStockId: string;
  addedAt: Date;
  createdAt: Date;
  updatedAt: Date;
//   customer: Customer;
  product: Product;
  productStock: ProductStock;
}
