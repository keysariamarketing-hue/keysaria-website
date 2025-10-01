export interface CustomerAuth {
  accessToken: string | undefined;
  result: {
    CustomerName: string;
    email: string;
    phone: string;
    gender: string | null;
    CustomerId: string;
    profileImage: string | null;
  };
}
