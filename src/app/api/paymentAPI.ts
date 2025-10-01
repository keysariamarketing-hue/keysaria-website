import { Product } from "@/types/productType";
import { AxiosInstance } from "axios";

// Define Types
interface CreateOrderParams {
  privateAxios: AxiosInstance;
  customerId: string;
  productList: Product[]; // Replace 'any[]' with a more specific type if possible
  subTotal: number;
  billingAddressId: string;
  shippingAddressId: string;
}

interface PaymentStatusParams {
  privateAxios: AxiosInstance;
  transactionId: string;
}

interface GetOrderIdParams {
  privateAxios: AxiosInstance;
  amount: number;
  receipt: string;
}

interface CheckStatusParams {
  privateAxios: AxiosInstance;
  orderId: string;
  signature: string;
  paymentId: string;
}

// Create Order API
export const createOrderAPI = async ({
  privateAxios,
  customerId,
  productList,
  subTotal,
  billingAddressId,
  shippingAddressId,
}: CreateOrderParams) => {
  console.log(
    "Order Data:",
    customerId,
    productList,
    subTotal,
    billingAddressId,
    shippingAddressId
  );

  return await privateAxios.post("/customer/myOrder/buyNowOrder", {
    customerId,
    productList,
    subTotal,
    billingAddressId,
    shippingAddressId,
  });
};

// Update Payment Status
export const updatePaymentStatus = async ({
  privateAxios,
  transactionId,
}: PaymentStatusParams) => {
  return await privateAxios.put(
    `/customer/myOrder/upadteOrderPaymentStatus/${transactionId}`
  );
};

// Get Razorpay Order ID
export const getOrderId = async ({
  privateAxios,
  amount,
  receipt,
}: GetOrderIdParams) => {
  return await privateAxios.post("/payment/create-order", {
    amount,
    receipt,
  });
};

// Check Payment Status
export const checkStatus = async ({
  privateAxios,
  orderId: razorpay_order_id,
  signature: razorpay_signature,
  paymentId: razorpay_payment_id,
}: CheckStatusParams) => {
  return await privateAxios.post("/payment/callback", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
};
