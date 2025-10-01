import { AxiosInstance } from "axios";

interface RatingData {
  rating: number;
  comment: string;
  productId: string;
  customerId: string;
}

export const submitRating = async (
  privateAxios: AxiosInstance,
  allData: RatingData
) => {
  return await privateAxios.post(
    "/reviewAndRating/createReviewRating",
    allData
  );
};
