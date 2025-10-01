import { AxiosInstance } from "axios";

// Define a type for the function parameters
interface AllData {
  privateAxios: AxiosInstance;
  search?: string;
  page?: number;
  active?: boolean;
  maxPrice?: string;
  minPrice?: string;
  minDiscount?: string;
  minRating?: string;
  type?: string;
  pageSize?: number;
  id?: string;
  productId?: string;
  rating?: number;
}

// Public get all categories API function
export const publicAllCategories = async ({
  privateAxios,
  search,
  page,
  active,
}: AllData) => {
  return await privateAxios.get(`/public/category/AllCategories`, {
    params: { search, page, active: active ?? null },
  });
};

// Public get bestseller products API function
export const getBestsellerProducts = async ({
  privateAxios,
  maxPrice,
  minPrice,
  minDiscount,
  minRating,
  type,
  pageSize,
}: AllData) => {
  return await privateAxios.get(`/public/weartype/getBestsellers`, {
    params: {
      type: type === "" ? null : type,
      maxPrice,
      minPrice,
      minDiscount,
      minRating,
      pageSize,
    },
  });
};

// Public get festive wear products API function
export const getFestiveWearProducts = async ({
  privateAxios,
  maxPrice,
  minPrice,
  minDiscount,
  minRating,
  type,
  pageSize,
}: AllData) => {
  return await privateAxios.get(`/public/weartype/getFestivewear`, {
    params: {
      type: type === "" ? null : type,
      maxPrice,
      minPrice,
      minDiscount,
      minRating,
      pageSize,
    },
  });
};

// Public get daily wear products API function
export const getDailyWearProducts = async ({
  privateAxios,
  maxPrice,
  minPrice,
  minDiscount,
  minRating,
  type,
  pageSize,
}: AllData) => {
  return await privateAxios.get(`/public/weartype/getDailywear`, {
    params: {
      type: type === "" ? null : type,
      maxPrice,
      minPrice,
      minDiscount,
      minRating,
      pageSize,
    },
  });
};

// Public get occasion wear products API function
export const getOccasionWearProducts = async ({
  privateAxios,
  maxPrice,
  minPrice,
  minDiscount,
  minRating,
  type,
  pageSize,
}: AllData) => {
  return await privateAxios.get(`/public/weartype/getOccasionwear`, {
    params: {
      type: type === "" ? null : type,
      maxPrice,
      minPrice,
      minDiscount,
      minRating,
      pageSize,
    },
  });
};

// Public get product by category ID API function
export const getProductByCategoryId = async ({
  privateAxios,
  id,
  maxPrice,
  minPrice,
  minDiscount,
  minRating,
  type,
  pageSize,
}: AllData) => {
  return await privateAxios.get(
    `/public/category/getProductByCategoryId/${id}`,
    {
      params: {
        type: type === "" ? null : type,
        maxPrice,
        minPrice,
        minDiscount,
        minRating,
        pageSize,
      },
    }
  );
};

// Public get product by collection ID API function
export const getProductByCollectionId = async ({
  privateAxios,
  id,
  maxPrice,
  minPrice,
  minDiscount,
  minRating,
  pageSize,
  page,
}: AllData) => {
  return await privateAxios.get(`/public/collection/${id}/products`, {
    params: {
      maxPrice,
      minPrice,
      minDiscount,
      minRating,
      pageSize,
      page,
    },
  });
};

// Public get product by ID API function
export const getProductById = async ({ privateAxios, productId }: AllData) => {
  return await privateAxios.get(`/public/category/getProductById/${productId}`);
};

// Get product list
export const getProductList = async ({ privateAxios, search }: AllData) => {
  return await privateAxios.get(`/public/category/getProduct`, {
    params: { search },
  });
};

// Get reviews
export const getReviews = async ({ privateAxios }: AllData) => {
  return await privateAxios.get(`/public/category/getReviews`);
};

// Get featured products
export const getFeaturedProducts = async ({
  privateAxios,
  pageSize,
  maxPrice,
  minPrice,
  minDiscount,
  minRating,
  page,
}: AllData) => {
  return await privateAxios.get(`/public/product/getFeaturedProducts`, {
    params: { pageSize, maxPrice, minPrice, minDiscount, minRating, page },
  });
};
