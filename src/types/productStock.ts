import { MyCartType } from "./cartType";
import { Product } from "./productType";

export interface ProductStock {
  id: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
  variantImages: string[];
  createdAt: Date;
  updatedAt: Date;
  MyCart: MyCartType[];
  product: Product;
  // sandokProduct: SandokProduct[];
  // NewOrderitem: NewOrderitem[];
  // MyOrder: MyOrder[];
}
