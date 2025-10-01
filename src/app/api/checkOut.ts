import { AxiosInstance } from "axios";

// Define Interfaces for Address Data
interface AddressData {
  customerId: string;
  name: string; // Renamed to fullName in API request
  phone: string;
  houseNo: string;
  street: string;
  landmark: string;
  address: string;
  pincode: number;
  city: string;
  state: string;
}

interface APIParams {
  privateAxios: AxiosInstance;
  data: AddressData;
}

interface CustomerIdParams {
  privateAxios: AxiosInstance;
  customerId: string;
}

// Create Billing Address
export const createBillingAddress = async ({
  privateAxios,
  data,
}: APIParams) => {
  const {
    customerId,
    name: fullName,
    phone,
    houseNo,
    street,
    landmark,
    address,
    pincode,
    city,
    state,
  } = data;

  return await privateAxios.post("/customer/checkout/createBillingAddress", {
    customerId,
    fullName,
    phone,
    houseNo,
    street,
    landmark,
    address,
    pincode,
    city,
    state,
  });
};

// Get Billing Address
export const getCustomerBillingAddress = async ({
  privateAxios,
  customerId,
}: CustomerIdParams) => {
  return await privateAxios.get(
    `/customer/checkout/getBillingAddressByCustomerId/${customerId}`
  );
};

// Create Shipping Address
export const createShippingAddress = async ({
  privateAxios,
  data,
}: APIParams) => {
  const {
    customerId,
    name: fullName,
    phone,
    houseNo,
    street,
    landmark,
    address,
    pincode,
    city,
    state,
  } = data;

  return await privateAxios.post("/customer/checkout/createShippingAddress", {
    customerId,
    fullName,
    phone,
    houseNo,
    street,
    landmark,
    address,
    pincode,
    city,
    state,
  });
};

// Get Shipping Address
export const getCustomerShippingAddress = async ({
  privateAxios,
  customerId,
}: CustomerIdParams) => {
  return await privateAxios.get(
    `/customer/checkout/getShippingAddressByCustomerId/${customerId}`
  );
};
