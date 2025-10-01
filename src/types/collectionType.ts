import { Categories } from "./categoryType";
import { Product } from "./productType";

export interface Collection {
  id: string;
  collectionName: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoriesId: string;
  category: Categories;
  product: Product[];
}
