import { AxiosInstance } from "axios";

// Define Interfaces for API Parameters
interface CartItemParams {
  customerId?: string;
  productId: string;
  productStockId: string;
  quantity?: number;
}

interface DeleteCartItemParams {
  customerId?: string;
  productId: string;
  productStockId: string;
}

interface DeleteAllCartParams {
  privateAxios: AxiosInstance;
  customerId: string;
}

// Function to add an item to the cart
export const addToCart = async (
  privateAxios: AxiosInstance,
  allData: CartItemParams
) => {
  return await privateAxios.post("/customer/myCart/addToCart", allData);
};

// Function to decrease an item's quantity in the cart
export const decreaseCartItem = async (
  privateAxios: AxiosInstance,
  allData: CartItemParams
) => {
  return await privateAxios.put("/customer/myCart/decreaseFromCart", allData);
};

// Function to delete a specific item from the cart
export const deleteCartItem = async (
  privateAxios: AxiosInstance,
  { productId, productStockId, customerId }: DeleteCartItemParams
) => {
  return await privateAxios.delete(
    `/customer/myCart/removeFromCart/${customerId}/${productId}/${productStockId}`
  );
};

// Function to delete all items from the cart
export const deleteAllCart = async ({
  privateAxios,
  customerId,
}: DeleteAllCartParams) => {
  return await privateAxios.delete(`/customer/myCart/deleteCart/${customerId}`);
};
