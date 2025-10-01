export interface ReviewCustomer {
  fullName: string;
  profileImage?: string | null;
}

export interface ProductRatingType {
  id: string;
  rating: number;
  comment: string;
  productId: string;
  customerId: string;
  customer: ReviewCustomer;
}

// export interface ReviewAndRating {
//   id: string;
//   rating: number;
//   comment?: string;
//   productId: string;
//   customerId: string;
//   customer: Customer;
//   product: Product;
// }