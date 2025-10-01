import { CartItemType } from "@/types/cartItemType";
import { ModeOfPayment } from "@/types/enums";
import { AxiosInstance } from "axios";

// Define Types
interface OrderParams {
  privateAxios: AxiosInstance;
  id: string;
  page?: number;
  search?: string;
  status?: string;
}

interface OrderByIdParams {
  privateAxios: AxiosInstance;
  orderId: string;
}

interface CreateOrderParams {
  privateAxios: AxiosInstance;
  customerId: string;
  orderItems: CartItemType[]; // Replace 'any[]' with a more specific type if possible
  subTotal: number;
  couponCode?: string; // Optional if coupon is not always used
  billingAddressId: string;
  shippingAddressId: string;
  modeOfPayment: ModeOfPayment;
}

interface PaymentStatusParams {
  privateAxios: AxiosInstance;
  transactionId: string;
}

// Get All Orders
export const getAllOrdersV2 = async ({
  privateAxios,
  id,
  page,
  search,
  status,
}: OrderParams) => {
  return await privateAxios.get(
    `/customer/myOrderV2/customerOrderDetails/${id}`,
    {
      params: { page, search, status },
    }
  );
};

// Get Order by ID
export const getOrderByIdV2 = async ({
  privateAxios,
  orderId,
}: OrderByIdParams) => {
  return await privateAxios.get(`/customer/myOrderV2/getBuyOrder/${orderId}`);
};

// Create Order API
export const createOrderAPIV2 = async ({
  privateAxios,
  customerId,
  orderItems,
  subTotal,
  couponCode,
  billingAddressId,
  shippingAddressId,
  modeOfPayment,
}: CreateOrderParams) => {
  console.log(
    "Creating Order:",
    customerId,
    orderItems,
    subTotal,
    couponCode,
    billingAddressId,
    shippingAddressId,
    modeOfPayment
  );

  return await privateAxios.post("/customer/myOrderV2/buyNowOrder", {
    customerId,
    orderItems,
    subTotal,
    couponCode,
    billingAddressId,
    shippingAddressId,
    modeOfPayment,
  });
};

// Update Payment Status
export const updatePaymentStatusV2 = async ({
  privateAxios,
  transactionId,
}: PaymentStatusParams) => {
  return await privateAxios.put(
    `/customer/myOrderV2/upadteOrderPaymentStatus/${transactionId}`
  );
};
