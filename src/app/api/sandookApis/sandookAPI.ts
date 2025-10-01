import { AxiosInstance } from "axios";

// Define interfaces for API parameters
interface PrivateAxiosParam {
  privateAxios: AxiosInstance;
}

interface CustomerIdParam extends PrivateAxiosParam {
  customerId: string;
}

interface SandookProductParam extends PrivateAxiosParam {
  sandokId: string;
  productId: string;
  productStockId: string;
  quantity?: number;
}

interface SandookOrderParam extends PrivateAxiosParam {
  sandokId: string;
  billingAdressesId: string;
  shippingAddressId: string;
  date: string;
  timeSlotId: string;
}

interface PaymentStatusParam extends PrivateAxiosParam {
  transactionId: string;
  status: string;
}

interface OrderIdParam extends PrivateAxiosParam {
  orderId: string;
}

// interface ReturnProductParam extends PrivateAxiosParam {
//   orderId: string;
//   returnedProducts: any[];
// }

interface ReturnIdParam extends PrivateAxiosParam {
  returnId: string;
}

// ====================== CUSTOMER SANDOOK APIs ======================

// ✅ Get Sandook by Customer ID
export const getSandookByCustomerId = async ({
  privateAxios,
  customerId,
}: CustomerIdParam) => {
  if (!customerId) return;
  return await privateAxios.get(`/sandook/getSandokByCustomerId/${customerId}`);
};

// ✅ Create a new Sandook
export const createSandookAPI = async ({
  privateAxios,
  customerId,
}: CustomerIdParam) => {
  if (!customerId) return;
  return await privateAxios.post(`/sandook/createSandok`, { customerId });
};

// ✅ Add a Product to Sandook
export const createSandookProduct = async ({
  privateAxios,
  sandokId,
  productId,
  productStockId,
  quantity = 1,
}: SandookProductParam) => {
  return await privateAxios.post(`/sandookProduct/createSandokProduct`, {
    sandokId,
    productId,
    productStockId,
    quantity,
  });
};

// ✅ Decrease Quantity of a Product in Sandook
export const decrementSandookProductAPI = async ({
  privateAxios,
  sandokId,
  productId,
  productStockId,
}: SandookProductParam) => {
  return await privateAxios.put(
    `/sandookProduct/decreaseFromSandookProductCart`,
    {
      sandokId,
      productId,
      productStockId,
    }
  );
};

// ✅ Remove a Product from Sandook
export const removeProductFromSandook = async ({
  privateAxios,
  id,
}: {
  privateAxios: AxiosInstance;
  id: string;
}) => {
  return await privateAxios.delete(`/sandookProduct/deleteSandokProduct/${id}`);
};

// ✅ Create a Sandook Order
export const createSandookOrder = async ({
  privateAxios,
  sandokId,
  billingAdressesId,
  shippingAddressId,
  date,
  timeSlotId,
}: SandookOrderParam) => {
  return await privateAxios.post(`/sandookOrder/createSandokOrder`, {
    sandokId,
    billingAdressesId,
    shippingAddressId,
    date,
    timeSlotId,
  });
};

// ✅ Update Sandook Prepaid Payment Status
export const updateSandookPrepaidPaymentStatus = async ({
  privateAxios,
  transactionId,
  status,
}: PaymentStatusParam) => {
  return await privateAxios.post(`/sandookOrder/upadtePrepaidPaymentStatus`, {
    transactionId,
    status,
  });
};

// ✅ Delete Sandook
export const deleteSandook = async ({
  privateAxios,
  id,
}: {
  privateAxios: AxiosInstance;
  id: string;
}) => {
  return await privateAxios.delete(`/sandook/deleteSandok/${id}`);
};

// ✅ Get Available Time Slots
export const availableTimeSlots = async ({
  privateAxios,
}: PrivateAxiosParam) => {
  return await privateAxios.get(`/sandook/timeSlot/getAvailableTimeSlots`);
};

// ====================== ADMIN SANDOOK ORDER APIs ======================

// ✅ Get Sandook Orders by Customer ID
export const getSandookOrderByCustomerId = async ({
  privateAxios,
  customerId,
}: CustomerIdParam) => {
  return await privateAxios.get(
    `/sandookOrder/getSandokOrderByCustomerId/${customerId}`
  );
};

// ✅ Get Sandook Order by Sandook ID
export const getSandookOrderBySandookId = async ({
  privateAxios,
  id,
}: {
  privateAxios: AxiosInstance;
  id: string;
}) => {
  return await privateAxios.get(`/sandookOrder/getSandokOrderById/${id}`);
};

// ✅ Admin - Return Sandook Order
// export const returnSandookOrderAPI = async ({ privateAxios, orderId, returnedProducts }: ReturnProductParam) => {
//   return await privateAxios.put(`/sandookOrder/updateSandokOrder`, {
//     returnedProducts,
//     orderId,
//   });
// };

// ✅ Complete Sandook Return
export const completeReturnAPI = async ({
  privateAxios,
  returnId,
}: ReturnIdParam) => {
  return await privateAxios.patch(`/return/complete/${returnId}`);
};

// ✅ Cancel Sandook Order by Customer
export const cancelSandookOrderByCustomer = async ({
  privateAxios,
  orderId,
}: OrderIdParam) => {
  return await privateAxios.patch(`/sandookOrder/cancelSanookOrder/${orderId}`);
};

// ✅ Admin - Update Sandook Order Status
export const adminUpdateSandookOrderStatus = async ({
  privateAxios,
  orderId,
  status,
}: OrderIdParam & { status: string }) => {
  return await privateAxios.patch(`/sandookOrder/updateOrderStatus`, {
    orderId,
    status,
  });
};
