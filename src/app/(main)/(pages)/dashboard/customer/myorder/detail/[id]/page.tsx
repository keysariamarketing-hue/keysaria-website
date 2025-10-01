"use client";

import { generateInvoice } from "@/app/api/customerApi";
import { getOrderByIdV2 } from "@/app/api/newOrderAPI";
import CustomerPersist from "@/components/auth/CustomerPersist";
import CustomerRequireAuth from "@/components/auth/CustomerRequireAuth";
import ProductRatingDialogueBox from "@/components/reviews/ProductRatingDialogueBox";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import { NewOrder } from "@/types/order";
import { Modal, Upload, UploadFile } from "antd";
import { AxiosError } from "axios";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();

  //   const { customerAuth } = useAuth() as AuthContextType;
  const privateAxios = useAxiosPrivate();

  const [data, setData] = useState<NewOrder>();
  //   const [comment, setComment] = useState("");
  const [token] = useState("");
  //   const [loader, setLoader] = useState(false);
  const [, setAwb_code] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [productIdForReview, setProductIdForReview] = useState<string>("");

  const [productForExchange, setProductForExchange] = useState<string | null>(
    null
  );

  //   //get shiprocket token......................
  //   const getShipRocketToken = async () => {
  //     const allData = { privateAxios };
  //     try {
  //       const res = await adminGetShipRocketToken(allData);
  //       setToken(res.data);
  //       getShimentTrack(res.data);
  //     } catch (error) {
  //       console.log(error);
  //       setLoader(false);
  //     }
  //   };

  //   useEffect(() => {
  //     getShipRocketToken();
  //   }, [awb_code]);

  //get shipment track......................
  //   const [trackData, setTrackData] = useState();
  //   const [trackActivity, setTrackActivity] = useState([]);
  //   const [trackURL, setTrackUrl] = useState("");

  //   const getShimentTrack = async (token: string) => {
  //     const allData = { privateAxios, token, awb_code };
  //     try {
  //       const res = await adminGetShipmentTrack(allData);
  //       setTrackUrl(res.data.response.tracking_data.track_url);
  //       setTrackActivity(
  //         res.data.response.tracking_data.shipment_track_activities
  //       );
  //       setTrackData(res.data.response.tracking_data.shipment_track);
  //       setLoader(false);
  //       console.log("res", res);
  //     } catch (error) {
  //       setLoader(false);
  //       console.log(error);
  //     }
  //   };

  // get order by orderId
  const getOrderByOrderId = async () => {
    if (!id) return;

    const allData = { privateAxios, orderId: id! };
    try {
      const res = await getOrderByIdV2(allData);
      console.log(res);

      if (res.status === 200) {
        setData(res.data);
        console.log(res.data);
        setAwb_code(res.data.shipRocketAWBId);
      }
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderByOrderId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //download invoice...............
  const downloadInvoice = async (orderId: string) => {
    const allData = { privateAxios, orderId, token };
    try {
      const res = await generateInvoice(allData);
      if (res.status == 200) {
        const pdfUrl = res.data.response.invoice_url;
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "invoice.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Error while downloading invoice`);
    }
  };

  // exchange request
  // Exchange Modal State
  const [returnDialog, setReturnDialog] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Submit Exchange Request
  const submitExchangeRequest = async () => {
    if (!productForExchange) {
      toast.error("Please pick the product to be exchanged.");
      return;
    }

    if (!reason) {
      toast.error("Please select a reason for the exchange.");
      return;
    }

    if (fileList.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("reason", reason);
    formData.append("description", comment);
    formData.append("orderItemId", productForExchange);

    console.log("File List:");
    console.log(fileList);

    // ✅ Ensure that only File objects are appended
    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append(`productImage[]`, file.originFileObj);
      }
    });

    console.log("Final FormData:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value); // ✅ Should log each file properly
    }

    try {
      const response = await privateAxios.post(
        "/customer/exchange/request-exchange",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Exchange request submitted successfully!");
        setReturnDialog(false);
        setFileList([]);
        setReason("");
        setComment("");
        getOrderByOrderId();
      }
    } catch (error: unknown) {
      console.error("Error submitting exchange request:", error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit exchange request.");
      }
    }
  };

  // Function to Reset Exchange Modal Fields
  const resetExchangeModal = () => {
    setReturnDialog(false);
    setReason("");
    setComment("");
    setFileList([]);
  };

  return (
    <>
      {/* Exchange Modal */}
      <Modal
        centered
        open={returnDialog}
        onCancel={resetExchangeModal}
        footer={null}
        width={500}
      >
        <div className="w-full">
          <h3 className="text-center">Exchange Product</h3>
          <div className="flex flex-col gap-2">
            {/* Reason Dropdown */}
            <select
              className="input-border w-full px-4 py-2 focus:outline-none rounded-md"
              onChange={(e) => setReason(e.target.value)}
              value={reason}
            >
              <option value="">Select Reason</option>
              <option value="Product Defect or Damage">
                Product Defect or Damage
              </option>
              <option value="Wrong Product Delivered">
                Wrong Product Delivered
              </option>
            </select>

            {/* Description Input */}
            <textarea
              className="input-border w-full px-4 py-2 focus:outline-none rounded-md"
              placeholder="Description"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {/* Upload Images */}
            <div className="border-2 border-red-600 flex items-center justify-center rounded-md">
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                multiple={true}
                fileList={fileList}
                onChange={({ fileList }) => {
                  if (fileList.length <= 8) {
                    setFileList(fileList);
                  } else {
                    toast.error("You can only upload up to 8 images.");
                  }
                }}
              >
                {fileList.length < 8 && <UploadCloud />}
              </Upload>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-x-4 mt-5">
              <button
                onClick={submitExchangeRequest}
                className="cta rounded-md px-4 py-2 text-white"
              >
                Submit
              </button>
              <button
                onClick={() => setReturnDialog(false)}
                className="cta rounded-md px-4 py-2 text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Review Rating Modal */}
      {isOpen && (
        <ProductRatingDialogueBox
          productId={productIdForReview}
          setIsOpen={setIsOpen}
        />
      )}

      {/* Main content */}
      {data && (
        <div className={`flex px-4 lg:px-20 py-6 lg:py-10 gap-4 border`}>
          <div className="w-full lg:px-6">
            <div className="flex items-center text-color">
              <h4 className="text-2xl">My Order Detail</h4>
            </div>

            {/* Delivery address */}
            {data && (
              <div className="mt-4 border w-full card-background rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.2)] lg:flex gap-20">
                <div className="flex gap-2 py-4 px-4">
                  <div className="space-y-2">
                    <h4 className="">Delivery Address</h4>
                    <div className="space-y-3">
                      <p className="font-bold uppercase text-color">
                        {data.billingAddress.fullName}
                      </p>
                      <p className="text-sm">
                        {data.billingAddress.houseNo}{" "}
                        {data.billingAddress.address},{<br />}
                        {data.billingAddress.street}, {data.billingAddress.city}
                        ,{<br />}
                        {data.billingAddress.state}
                        {<br />}
                        {data.billingAddress.pincode}
                      </p>
                      <div className="">
                        <h4 className="">Phone Number</h4>
                        <p className="text-sm">{data.billingAddress.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 📌 Order Overview */}
            <div className="grid pb-10">
              {data && (
                <>
                  {/* Product Details */}
                  {data.orderItems.map((orderedProduct, idx) => (
                    <div
                      key={idx}
                      className="mt-4 card-background lg:flex justify-between gap-4 rounded-lg hover:shadow-[0_0_10px_rgba(0,0,0,0.2)] p-4"
                    >
                      {/* Product Image & Info */}
                      <div className="flex gap-2 lg:w-96">
                        <Image
                          src={orderedProduct.product.thumbnail}
                          className="w-[100px] h-[120px] object-cover rounded-lg"
                          alt={orderedProduct.product.productTitle}
                          width={100}
                          height={120}
                        />
                        <div className="space-y-2">
                          <h6 className="text-lg hover:underline decoration-1">
                            <Link
                              href={`/product/details/${orderedProduct.product.id}`}
                            >
                              {orderedProduct.product.productTitle}
                            </Link>
                          </h6>
                          <div className="flex gap-4">
                            <p className="text-sm">
                              Price: ₹
                              {orderedProduct.product.afterDiscountPrice}
                            </p>
                            <p className="text-sm">
                              Quantity: {orderedProduct.productQuantity}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ====================== 📌Order Actions =================*/}
                      <div className="flex gap-x-4">
                        {/* Rating */}
                        <div className="w-32 flex justify-center items-center min-h-12 h-full">
                          <button
                            onClick={() => {
                              setIsOpen(true);
                              setProductIdForReview(orderedProduct.id);
                            }}
                            className="rounded-full text-white px-4 py-1 cta"
                          >
                            Give Rating
                          </button>
                        </div>

                        {/* Exchange Logic */}
                        {data.orderStatus === "DELIVERED" &&
                          (orderedProduct.askedForExchange ? (
                            <div className="flex justify-center items-center min-h-12 h-full">
                              <h5>
                                {orderedProduct.isProductExchanged
                                  ? "Exchanged"
                                  : "Exchange Requested"}
                              </h5>
                            </div>
                          ) : (
                            <div className="w-32 flex justify-center items-center min-h-12 h-full">
                              <button
                                onClick={() => {
                                  setProductForExchange(orderedProduct.id);
                                  setReturnDialog(true);
                                }}
                                className="rounded-full text-white px-4 py-1 cta"
                              >
                                Exchange
                              </button>
                            </div>
                          ))}

                        {/* Delivery Status */}
                        <div className="flex justify-center items-center h-full min-h-12">
                          <h5 className="text-sm">{data.orderStatus}</h5>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* ======================================================================================================= */}

                  {/* 📌 Order Summary */}
                  <div className="flex flex-col gap-2 w-full border p-4 bg-gray-50 rounded-lg mt-4">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        Subtotal:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ₹{data.subTotal}
                      </span>
                    </div>

                    {/* Coupon Applied */}
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm font-semibold">
                        Coupon Applied:
                      </span>
                      {data.couponApplied ? (
                        <span className="text-sm font-medium">
                          {data.couponApplied.couponCode}
                        </span>
                      ) : (
                        <span className="text-sm font-medium">NA</span>
                      )}
                    </div>

                    {data.couponId && (
                      <div className="flex justify-between text-green-600">
                        <span className="text-sm font-semibold">
                          Coupon Discount:
                        </span>
                        {data.couponId ? (
                          <span className="text-sm font-medium">
                            - ₹{data.subTotal - data.finalTotal}
                          </span>
                        ) : (
                          <span className="text-sm font-medium">NA</span>
                        )}
                      </div>
                    )}

                    {/* Final Total */}
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-base font-semibold text-gray-800">
                        Final Total:
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{data.finalTotal}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Generate Invoice */}
            <div className="w-full flex items-center justify-center">
              <button
                onClick={() =>
                  data.shipRocketOrderId &&
                  downloadInvoice(data.shipRocketOrderId)
                }
                className="rounded-full text-white px-4 py-1 cta"
              >
                Generate Invoice
              </button>
            </div>

            {/* Order Status */}
            <div className="flex gap-2 mb-10">
              {/* <OrderStatus
                  trackURL={trackURL}
                  trackActivity={trackActivity}
                /> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MyOrderDetails = () => {
  return (
    <CustomerPersist>
      <CustomerRequireAuth>
        <OrderDetails />
      </CustomerRequireAuth>
    </CustomerPersist>
  );
};

export default MyOrderDetails;
