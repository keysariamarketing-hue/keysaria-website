export interface ShippingAddress {
    id: string;
    fullName: string;
    email?: string;
    phone: string;
    houseNo?: string;
    street?: string;
    address: string;
    landmark?: string;
    pincode: string;
    city: string;
    state: string;
    type?: string;
    customerId: string;
    createdAt: Date;
    updatedOn: Date;
    // MyOrder: MyOrder[];
    // SandokOrder: SandokOrder[];
    // customer: Customer;
    // NewOrder: NewOrder[];
  }