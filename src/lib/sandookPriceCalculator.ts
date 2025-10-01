import { SandokProduct } from "@/types/sandookType";

export const totalSandookPriceCalculation = (sandookData: SandokProduct[]) => {
  const totalPrice = sandookData.map(
    (item) => item.product.price * item.quantity
  );
  const afterDiscountPrice = sandookData.map(
    (item) => item.product.afterDiscountPrice * item.quantity
  );
  const subTotal = totalPrice.reduce((acc, cur) => acc + cur, 0);
  const discountPrice = afterDiscountPrice.reduce((acc, cur) => acc + cur, 0);
  return { subTotal, discountPrice };
};
