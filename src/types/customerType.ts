import { BillingAddresses } from "./billingAddressType";
import { MyCartType } from "./cartType";
import { NewOrder } from "./order";
import { Payment } from "./paymentType";
import { ProductRatingType } from "./reviewType";
import { Sandok, SandokOrder } from "./sandookType";
import { ShippingAddress } from "./shippingAddressType";
import { Wishlist } from "./wishlistType";

export interface Customer {
  id: string;
  fullName: string;
  gender?: string;
  dob?: Date;
  phone: string;
  email: string;
  address?: string;
  houseNo?: string;
  street?: string;
  landmark?: string;
  pincode?: number;
  city?: string;
  state?: string;
  password: string;
  refreshToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  isActive: boolean;
  isVerifiedEmail: boolean;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;

  BillingAddresses: BillingAddresses[];
  mycart: MyCartType[];
  ReviewAndRating: ProductRatingType[];
  sandok: Sandok[];
  sandokOrder: SandokOrder[];
  ShippingAddress: ShippingAddress[];
  Wishlist: Wishlist[];
  payment: Payment[];
  NewOrder: NewOrder[];
}
