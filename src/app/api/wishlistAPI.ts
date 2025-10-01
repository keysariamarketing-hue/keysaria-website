import { AxiosInstance } from "axios";

interface WishlistData {
  privateAxios: AxiosInstance;
  productId: string;
  customerId: string;
}

// Create wishlist
export const createWishlist = async ({
  privateAxios,
  productId,
  customerId,
}: WishlistData) => {
  return await privateAxios.post("/wishlist/createWishlistItem", {
    productId,
    customerId,
  });
};

// Get wishlist
export const getWishlist = async ({
  privateAxios,
  customerId,
}: Omit<WishlistData, "productId">) => {
  return await privateAxios.get(
    `/wishlist/getWishlistByCustomer/${customerId}`
  );
};

// Delete from wishlist
export const deleteFromWishlist = async ({
  privateAxios,
  productId,
  customerId,
}: WishlistData) => {
  return await privateAxios.delete(
    `/wishlist/deleteWishlistItem/${productId}/${customerId}`
  );
};
