import { AxiosInstance } from "axios";

interface CouponDataType {
  privateAxios: AxiosInstance;
}

export const getActiveCouponsAPI = async (allData: CouponDataType) => {
  const { privateAxios } = allData;
  return await privateAxios.get(`/coupon/v2`);
};
