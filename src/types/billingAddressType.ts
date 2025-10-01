export interface BillingAddresses {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  houseNo?: string;
  street?: string;
  landmark?: string;
  address?: string;
  pincode: string;
  city: string;
  state: string;
  type?: string;
  customerId: string;
  createdAt: Date;
  updatedOn: Date;
  // customer: Customer;
  // MyOrder: MyOrder[];
  // SandokOrder: SandokOrder[];
  // NewOrder: NewOrder[];
}
