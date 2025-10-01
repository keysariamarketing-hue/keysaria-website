import { AxiosInstance } from "axios";
import { axiosShipRocket } from "../axios";

// Define Interfaces for API Parameters
interface OrderParams {
  privateAxios: AxiosInstance;
  status?: string;
  paymentStatus?: string;
  page?: number;
}

interface ShipRocketOrderParams {
  privateAxios: AxiosInstance;
  orderId: string;
}

interface ShipRocketTokenParams {
  privateAxios: AxiosInstance;
}

interface GenerateAWBParams {
  privateAxios: AxiosInstance;
  shipmentID: string;
  courierId: string;
  token: string;
}

interface CancelShipmentParams {
  awbs: string[];
  token: string;
}

interface CancelOrderParams {
  shipRocketOrderId: string;
  token: string;
}

interface SetShipRocketValuesParams {
  privateAxios: AxiosInstance;
  orderId: string;
  shipRocketOrderId?: string;
  shipRocketShipmentId?: string;
  shipRocketTrackId?: string;
  shipRocketCourierId?: string;
  shipRocketAWBId?: string;
}

interface ProductStatusUpdateParams {
  privateAxios: AxiosInstance;
  orderId: string;
  status: string;
}

interface CourierAvailabilityParams {
  deliveryPin: string;
  token: string;
}

interface ShipmentTrackParams {
  privateAxios: AxiosInstance;
  token: string;
  awb_code: string;
}

interface SchedulePickupParams {
  privateAxios: AxiosInstance;
  token: string;
  shipment_id: string;
  pickup_date: string;
}

interface ManifestParams {
  privateAxios: AxiosInstance;
  token: string;
  shipment_id: string;
}

// Get all orders
export const getAllOrders = async ({
  privateAxios,
  status,
  paymentStatus,
  page,
}: OrderParams) => {
  return await privateAxios.get("/admin/order/getAllOrders", {
    params: { status, paymentStatus, page },
  });
};

// Create new order for courier
export const createNewOrderForCourier = async ({
  privateAxios,
  orderId,
}: ShipRocketOrderParams) => {
  return await privateAxios.get(`/admin/order/createNewOrder/${orderId}`);
};

// Get Shiprocket token
export const adminGetShipRocketToken = async ({
  privateAxios,
}: ShipRocketTokenParams) => {
  return await privateAxios.get("/customer/myOrder/getShipRocketToken");
};

// Generate AWB and Shipment
export const generateAWBAndShipmentAPI = async ({
  privateAxios,
  shipmentID,
  courierId,
  token,
}: GenerateAWBParams) => {
  try {
    const res = await privateAxios.post(`/admin/order/createShipment`, {
      shipmentID,
      courierId,
      token,
    });
    console.log("res", res);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

// Cancel Shipment
export const adminCancelShipment = async ({
  awbs,
  token,
}: CancelShipmentParams) => {
  return await axiosShipRocket.post(
    `/external/orders/cancel/shipment/awbs`,
    { awbs },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Cancel Order
export const adminCancelOrder = async ({
  shipRocketOrderId,
  token,
}: CancelOrderParams) => {
  return await axiosShipRocket.post(
    `external/orders/cancel`,
    { ids: [shipRocketOrderId] },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Set ShipRocket values for an order
export const orderSetShipRocketValues = async ({
  privateAxios,
  orderId,
  shipRocketOrderId,
  shipRocketShipmentId,
  shipRocketTrackId,
  shipRocketCourierId,
  shipRocketAWBId,
}: SetShipRocketValuesParams) => {
  return await privateAxios.patch("/admin/order/orderSetShipRocketValues", {
    orderId,
    shipRocketOrderId,
    shipRocketShipmentId,
    shipRocketTrackId,
    shipRocketCourierId,
    shipRocketAWBId,
  });
};

// Admin Product Status Update
export const adminProductStatusUpdate = async ({
  privateAxios,
  orderId,
  status,
}: ProductStatusUpdateParams) => {
  return await privateAxios.patch(
    `/admin/order/adminProducts/productStatusUpdate`,
    {
      orderId,
      status,
    }
  );
};

// Get Courier Availability Status
export const getCourierAvailStatus = async ({
  deliveryPin,
  token,
}: CourierAvailabilityParams) => {
  return await axiosShipRocket.get(`external/courier/serviceability`, {
    params: {
      pickup_postcode: process.env.NEXT_PUBLIC_PICKUP_PINCODE,
      delivery_postcode: deliveryPin,
      weight: 2,
      cod: 0,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get Shipment Track
export const adminGetShipmentTrack = async ({
  privateAxios,
  token,
  awb_code,
}: ShipmentTrackParams) => {
  return await privateAxios.post("/admin/order/getShipmentTrack", {
    token,
    awb_code,
  });
};

// Schedule Pickup
export const schedulePickupAPI = async ({
  privateAxios,
  token,
  shipment_id,
  pickup_date,
}: SchedulePickupParams) => {
  return await privateAxios.post("/admin/order/schedulePickup", {
    token,
    shipment_id,
    pickup_date,
  });
};

// Generate Manifest
export const generateManifestAPI = async ({
  privateAxios,
  token,
  shipment_id,
}: ManifestParams) => {
  return await privateAxios.post("/admin/order/generateManifest", {
    token,
    shipment_id,
  });
};

// Print Manifest
export const printManifestAPI = async ({
  privateAxios,
  token,
  shipment_id,
}: ManifestParams) => {
  return await privateAxios.post("/admin/order/printManifest", {
    token,
    shipment_id,
  });
};

// Generate Label
export const generateLabelAPI = async ({
  privateAxios,
  token,
  shipment_id,
}: ManifestParams) => {
  return await privateAxios.post("/admin/order/generateLabel", {
    token,
    shipment_id,
  });
};
