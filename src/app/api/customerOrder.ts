import { AxiosInstance } from "axios";

// Define Order Query Parameters Interface
interface OrderQueryParams {
  privateAxios: AxiosInstance;
  id: string;
  page?: number;
  search?: string;
  status?: string;
}

// Define Order ID Parameter Interface
interface OrderIdParams {
  privateAxios: AxiosInstance;
  orderId: string;
}

// Define Order Return Request Interface
interface ReturnRequestParams {
  privateAxios: AxiosInstance;
  orderId: string;
  reason: string;
  description: string;
  customerId: string;
}

interface EmailProductType {
  productId: string;
  quantity: number;
}

// Define Order Confirmation Email Interface
interface OrderEmailParams {
  privateAxios: AxiosInstance;
  products: EmailProductType[];
  customerEmail: string;
}

// Get Orders by Customer ID
export const getAllOrders = async ({
  privateAxios,
  id,
  page,
  search,
  status,
}: OrderQueryParams) => {
  return await privateAxios.get(
    `/customer/myOrder/customerOrderDetails/${id}`,
    {
      params: { page, search, status },
    }
  );
};

// Get Order by Order ID
export const getOrderById = async ({
  privateAxios,
  orderId,
}: OrderIdParams) => {
  return await privateAxios.get(`/customer/myOrder/getBuyOrder/${orderId}`);
};

// Submit Order Return Request
export const customerReturnRequestAPI = async ({
  privateAxios,
  orderId,
  reason,
  description,
  customerId,
}: ReturnRequestParams) => {
  return await privateAxios.post("/customer/myOrder/orderReturnRequest", {
    orderId,
    reason,
    description,
    customerId,
  });
};

// Send Order Confirmation Email to Customer
export const sendOrderConfirmMail = async ({
  privateAxios,
  products,
  customerEmail,
}: OrderEmailParams) => {
  return await privateAxios.post("/sendEmail/send-order-email", {
    products,
    customerEmail,
  });
};
