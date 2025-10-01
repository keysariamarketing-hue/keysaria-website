export interface Coupon {
  id: string;
  couponCode: string;
  couponTitle: string;
  discountAmount?: number;
  discountInPercent?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  minOrderValue?: number;
  usageCount: number;
  usageLimit?: number;
  applicableUsers: UserCoupon[];
  //   NewOrder: NewOrder[];
}

export interface UserCoupon {
  id: string;
  userId: string;
  couponId: string;
  usedAt: Date;
  coupon: Coupon;
  //   user: User;
}
