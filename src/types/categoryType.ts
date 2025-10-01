import { Collection } from "./collectionType";
import { Product } from "./productType";

export interface Categories {
  id: string;
  catName: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  collection: Collection[];
  product: Product[];
}
