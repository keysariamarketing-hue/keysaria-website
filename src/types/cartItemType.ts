import { ProductStock } from "./productStock";
import { Product } from "./productType";

export interface CartItemType {
  productId: string;
  productStockId: string;
  quantity: number;
  customerId?: string;
  productStock: ProductStock;
  product: Product;
}
