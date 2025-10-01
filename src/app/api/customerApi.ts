import { AxiosResponse } from "axios";
import { axiosPrivate } from "./axios";

// Define types for customer data
interface CustomerData {
  email?: string;
  password?: string;
  fullName?: string;
  profileImage?: File;
  address?: string;
  dob?: string;
  phone?: string;
  id?: string;
}

interface AuthData {
  privateAxios: typeof axiosPrivate;
  data?: Record<string, unknown>;
  email?: string;
  password?: string;
  token?: string;
  id?: string;
  orderId?: string;
  rating?: number;
  comment?: string;
  productId?: string;
  customerId?: string;
}

interface SignInFormData {
  privateAxios: typeof axiosPrivate;
  data: {
    email: string;
    password: string;
  };
}

//customer signIn API
export const customerLogIn = async (
  allData: SignInFormData
): Promise<AxiosResponse> => {
  const { privateAxios, data } = allData;
  return await privateAxios.post("/customerAuth/login", data);
};

//customer signUp API
export const customerSignUp = async (
  allData: AuthData
): Promise<AxiosResponse> => {
  const { privateAxios, data } = allData;
  return await privateAxios.post("/customerAuth/register", data);
};

//customer refresh API
export const customerRefereshAPI = async (): Promise<AxiosResponse> => {
  return await axiosPrivate.get(`/customerAuth/loginRefresh`, {
    withCredentials: true,
  });
};

//customer logout API
export const customerLogOut = async (
  allData: AuthData
): Promise<AxiosResponse> => {
  const { privateAxios } = allData;
  return await privateAxios.get(`/customerAuth/logout`, {
    withCredentials: true,
  });
};

//get customer by ID
export const getCustomerById = async (
  allData: AuthData
): Promise<AxiosResponse> => {
  const { privateAxios, id } = allData;
  return await privateAxios.get(`/public/category/getCustomerId/${id}`);
};

//update customer profile
export const updateCustomerProfile = async (
  allData: CustomerData & { privateAxios: typeof axiosPrivate; id: string }
): Promise<AxiosResponse> => {
  const {
    privateAxios,
    fullName,
    profileImage,
    address,
    dob,
    phone,
    email,
    id,
  } = allData;

  console.log("Working with:", {
    fullName,
    profileImage,
    address,
    dob,
    phone,
    email,
    id,
  });

  const formData = new FormData();
  formData.append("fullName", fullName || "");
  formData.append("profileImage", profileImage || "");
  formData.append("address", address || "");
  formData.append("dob", dob || "");
  formData.append("phone", phone || "");
  formData.append("email", email || "");

  console.log("FormData entries:");
  for (const pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }

  try {
    const response = await privateAxios.patch(
      `/public/category/updateCustomer/${id}`,
      formData
    );
    console.log("Response from server:", response);
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in updateCustomerProfile:", error.response || error);
    throw error;
  }
};

//forgot password API
export const forgotPasswordAPI = async (
  allData: AuthData
): Promise<AxiosResponse> => {
  const { privateAxios, email } = allData;
  return await privateAxios.post(`/customerAuth/forgot-password`, { email });
};

//reset password API
export const resetPasswordAPI = async (
  allData: AuthData
): Promise<AxiosResponse> => {
  const { privateAxios, password, token } = allData;
  console.log({ password, token });
  return await privateAxios.patch(`/customerAuth/reset-password/${token}`, {
    password,
  });
};

//give review and rating API
export const reviewRatingAPI = async (
  allData: AuthData
): Promise<AxiosResponse> => {
  const { privateAxios, rating, comment, productId, customerId } = allData;
  return await privateAxios.post(`/reviewAndRating/createReviewRating`, {
    rating,
    comment,
    productId,
    customerId,
  });
};

//generate invoice API
export const generateInvoice = async (
  allData: AuthData
): Promise<AxiosResponse> => {
  const { privateAxios, orderId, token } = allData;
  return await privateAxios.post(`/customer/myOrder/generateInvoice`, {
    orderId,
    token,
  });
};
