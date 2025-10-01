import { CartItemType } from "@/types/cartItemType";

export const totalCartPriceCalculation = (data: CartItemType[]) => {
  const totalPrice = data.map((item) => item.product.price * item.quantity);
  const afterDiscountPrice = data.map(
    (item) => item.product.afterDiscountPrice * item.quantity
  );
  const subTotal = totalPrice.reduce((acc, cur) => acc + cur, 0);
  const discountPrice = afterDiscountPrice.reduce((acc, cur) => acc + cur, 0);
  return { subTotal, discountPrice };
};
