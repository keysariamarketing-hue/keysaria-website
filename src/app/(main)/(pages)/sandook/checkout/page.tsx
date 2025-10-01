"use client";

import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import useAuth from "@/hook/useAuth";
import { AuthContextType } from "@/context/AuthProvider";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  availableTimeSlots,
  createSandookOrder,
  deleteSandook,
  getSandookByCustomerId,
  updateSandookPrepaidPaymentStatus,
} from "@/app/api/sandookApis/sandookAPI";
import {
  createBillingAddress,
  createShippingAddress,
  getCustomerBillingAddress,
  getCustomerShippingAddress,
} from "@/app/api/checkOut";
import { ButtonLoader } from "@/components/loaders/ButtonLoader";
import { totalSandookPriceCalculation } from "@/lib/sandookPriceCalculator";
import { SandokProduct, TimeSlot } from "@/types/sandookType";
import { sandookPincodes } from "@/lib/sandookPincodes";
import { BillingAddresses } from "@/types/billingAddressType";
import { ShippingAddress } from "@/types/shippingAddressType";
import { checkStatus, getOrderId } from "@/app/api/paymentAPI";
import { fetchSandookDataThunk } from "@/features/sandookSlice";
import { AxiosError } from "axios";
import Script from "next/script";
import { RazorpayPaymentResponse } from "@/types/razorpyResponseType";
import CustomerPersist from "@/components/auth/CustomerPersist";
import CustomerRequireAuth from "@/components/auth/CustomerRequireAuth";

const logoUrl = "/footer-logo.png";

const formatDate = (date: Date): string => {
  const indiaDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const year = indiaDate.getFullYear();
  const month = `0${indiaDate.getMonth() + 1}`.slice(-2);
  const day = `0${indiaDate.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};

interface AddressFormData {
  name: string; // Full Name
  phone: string;
  houseNo: string;
  street: string;
  landmark: string;
  address: string;
  pincode: number;
  city: string;
  state: string;
  country: string;
}

const SandookCheckoutContent = () => {
  const { customerAuth } = useAuth() as AuthContextType;
  const customerId = customerAuth.result && customerAuth.result.CustomerId;
  const customer = customerAuth && customerAuth.result;

  const router = useRouter();
  const privateAxios = useAxiosPrivate();
  const dispatch = useDispatch<AppDispatch>();

  const [sandookData, setSandookData] = useState<SandokProduct[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [sandookId, setSandookId] = useState<string>("");
  const [timeSlotId, setTimeSlotId] = useState<string>("");
  const [addressSelected, setAddressSelected] = useState<number | null>(null);
  const [discountPrice, setDiscountPrice] = useState<number>(0); // ✅ Initialize with 0

  useEffect(() => {
    if (sandookData.length > 0) {
      const { discountPrice } = totalSandookPriceCalculation(sandookData);
      setDiscountPrice(discountPrice); // ✅ Set the state
    }
  }, [sandookData]);

  const [billingAddress, setBillingAddress] = useState<BillingAddresses[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress[]>([]);
  const getSandook = { privateAxios, customerId };

  const [loader, setLoader] = useState<boolean>(false);
  const [addStatus, setAddStatus] = useState<boolean>(false);

  const today = new Date();
  const minDate = formatDate(today);

  // Add 2 days for the maxDate
  const maxDate = formatDate(new Date(today.setDate(today.getDate() + 2)));

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<AddressFormData>();

  //get sandook by Id.......................
  const getSandookById = async () => {
    const allData = { privateAxios, customerId };
    try {
      const res = await getSandookByCustomerId(allData);
      // console.log(res.data);
      if (res) {
        setSandookData(res.data.sandokProduct);
        setSandookId(res.data.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Open address form functionality............
  const openAddressForm = () => {
    return setAddStatus(!addStatus);
  };

  //create shipping address....................
  const customerCreateBillingAddress: SubmitHandler<AddressFormData> = async (
    data
  ) => {
    const allData = { privateAxios, data: { ...data, customerId: customerId } };
    try {
      const res = await createBillingAddress(allData);
      await createShippingAddress(allData);
      if (res.status === 201) {
        reset();
        customerGetBillingAddress();
        setAddStatus(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get shipping address............
  const customerGetBillingAddress = async () => {
    const allData = { privateAxios, customerId };
    try {
      const res = await getCustomerBillingAddress(allData);
      const res2 = await getCustomerShippingAddress(allData);
      if (res.status === 200) {
        console.log(res.data);

        // Assuming res.data is an array of objects with a pincode property
        const billingAddress = res.data;

        // Filter addresses where the pincode is in sandookPincodes
        const filteredBillingAddress = billingAddress.filter(
          (address: BillingAddresses) =>
            sandookPincodes.includes(Number(address.pincode)) // Convert string pincode to number
        );

        console.log("Filtered Billing Addresses:", filteredBillingAddress);

        // Set only the filtered addresses
        setBillingAddress(filteredBillingAddress);
        setShippingAddress(res2.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const quantity = sandookData && sandookData.length;

  //get available time slots..................
  const getAvailTimeSlots = async () => {
    const allData = { privateAxios };
    try {
      const res = await availableTimeSlots(allData);
      setAvailableSlots(res.data.timeSlots);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSandookById();
    customerGetBillingAddress();
    getAvailTimeSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =============== SANDOOK ORDER FLOW ====================

  //handle confirm order.............
  const handleConfirmOrder = async () => {
    console.log(addressSelected);

    if (addressSelected == null) {
      toast.error("Please select an address first");
      setLoader(false);
      return;
    }

    setLoader(true);
    const allData = {
      privateAxios,
      timeSlotId,
      date: selectedDate,
      quantity: quantity,
      sandokId: sandookId,
      billingAdressesId: billingAddress[addressSelected].id,
      shippingAddressId: shippingAddress[addressSelected].id,
    };
    try {
      const res = await createSandookOrder(allData);
      console.log(res.data.sandokOrder);

      if (res.status === 201) {
        handleCheckOut(res.data.sandokOrder.transactionId, 250);
      }
    } catch (error: unknown) {
      setLoader(false);
      console.log(error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Order creation failed");
      }
    }
  };

  //create orderId...............
  const handleCheckOut = async (
    transactionId: string,
    orderResFinalTotal: number
  ) => {
    console.log("TRANSACTION ID ==");
    console.log(transactionId);
    console.log(orderResFinalTotal);

    const receipt = Math.floor(Math.random() * (999999 - 100000) + 100000);
    const allData = {
      privateAxios,
      amount: 250 * 100,
      receipt: receipt.toString(),
    };

    console.log("ALL DATA ==");
    console.log(allData);

    try {
      // inititate razorpay instance
      const res = await getOrderId(allData);
      console.log("NEW PAYMENT");
      console.log(res);

      if (res.status === 200) {
        createPayment(res.data.id, transactionId);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      toast.error("Error while initiating payment");
    }
  };

  //make payment.................
  const createPayment = (razorpayId: string, transactionId: string) => {
    console.log("RAZORPAY CREATING PAYMENT");
    console.log("CUSTOMER");
    console.log(customer);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_ID_KEY!,
      order_id: razorpayId,
      name: "Keysaria",
      // amount: discountPrice * 100,
      amount: 250 * 100,
      description: "Total amount of your order",
      currency: "INR",
      image: logoUrl,
      prefill: {
        name: customer.CustomerName,
        email: customer.email,
        contact: customer.phone,
      },
      handler: function (response: RazorpayPaymentResponse) {
        console.log(response);
        finalSubmit(
          response.razorpay_order_id,
          response.razorpay_signature,
          response.razorpay_payment_id,
          transactionId
        );
        console.log("payment response==>", response);
      },
    };

    if (window.Razorpay) {
      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (response) {
        router.push("/failed");
        console.log("failed error", response);
      });
      rzp1.open();
    }
  };

  const finalSubmit = async (
    orderId: string,
    signature: string,
    paymentId: string,
    transactionId: string
  ) => {
    const allData = { privateAxios, orderId, signature, paymentId };
    console.log("FINAL SUBMIT");
    console.log(allData);

    try {
      setLoader(false);
      // Callback from the razorpay after successful tx
      const res = await checkStatus(allData);
      if (res.data.msg === "success") {
        await deleteSandook({ privateAxios, id: sandookId });
        dispatch(fetchSandookDataThunk(getSandook));
        router.push("/sandook/success");
      } else {
        router.push("/failed");
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
      router.push("/failed");
    }

    // Updating Payment Status as done
    await updateSandookPrepaidPaymentStatus({
      privateAxios,
      transactionId,
      status: "DONE",
    });

    // TODO - send sandook order email
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="grid min-h-screen sm:px-10 lg:py-10 pb-28 md:py-4 sm:py-4 lg:grid-cols-2 lg:px-10 xl:px-20">
        <div className="mt-10 bg-gray-50 lg:mt-0">
          <div className="nav-bg p-3 text-color rounded-tl-lg rounded-tr-lg uppercase text-xl">
            Delivery Address
          </div>
          <div className="mt-4 w-full px-4">
            {/* Address data map */}
            {billingAddress.length > 0 &&
              billingAddress.map((item, index) => (
                <div
                  key={index}
                  className="shadow-md gap-4 mt-2 p-4 w-full cursor-pointer"
                >
                  <div className="flex gap-4 p-4 w-full relative">
                    <div className="">
                      <input
                        type="radio"
                        name="radio"
                        id={item.id}
                        value={item.id}
                        radioGroup="a"
                        defaultChecked={index === addressSelected}
                        onChange={() => setAddressSelected(index)}
                        className="text-color"
                      />
                    </div>
                    <label
                      htmlFor={item.id}
                      className="flex justify-between w-full"
                    >
                      <div>
                        <p className="font-medium text-color uppercase">
                          {item.fullName}
                        </p>

                        <p>
                          <span className="font-semibold">Phone: </span>
                          {item.address}
                        </p>
                        <p>
                          <span className="font-semibold">House: </span>
                          {item.houseNo},{item.street}
                        </p>
                        <p>
                          <span className="font-semibold">City/State: </span>{" "}
                          {item.city}, {item.state}
                        </p>
                        <p>
                          <span className="font-semibold">Pincode: </span>
                          {item.pincode}
                        </p>
                        <p>
                          <span className="font-semibold">Phone: </span>
                          {item.phone}
                        </p>
                      </div>
                      <Link
                        href={"/dashboard/customer/profile"}
                        className="absolute top-0 right-0"
                      >
                        <FaEdit className="text-color text-xl" />
                      </Link>
                    </label>
                  </div>
                </div>
              ))}
          </div>

          {/* Create Address */}
          <div className="flex gap-4 mt-2 p-4 py-10 w-full">
            <button
              onClick={() => openAddressForm()}
              className="flex gap-2 items-center cta text-white py-3 px-8"
            >
              <MdAdd className="font-semibold text-2xl" /> Add New Address
            </button>
          </div>

          {/* Address Form */}
          <div
            className={`${
              addStatus !== true
                ? "hidden trasition-all duration-300"
                : "block px-4"
            }`}
          >
            <form
              onSubmit={handleSubmit(customerCreateBillingAddress)}
              className="w-full mx-auto py-4"
            >
              <div className="grid md:grid-cols-2 md:gap-4">
                <div className="relative z-0 w-full mb-5 group">
                  <div className="flex items-center input-border py-2 px-3 rounded-md">
                    <svg
                      fill="#543310"
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      id="user"
                      data-name="Flat Color"
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon flat-color"
                    >
                      <path
                        id="primary"
                        d="M21,20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2,6,6,0,0,1,6-6h6A6,6,0,0,1,21,20Zm-9-8A5,5,0,1,0,7,7,5,5,0,0,0,12,12Z"
                      ></path>
                    </svg>
                    <input
                      {...register("name", {
                        required: "Please Enter Name",
                      })}
                      className="pl-2 outline-none border-none w-full bg-transparent"
                      type="text"
                      name="name"
                      placeholder="Name"
                    />
                  </div>
                  <p className="text-red-600">
                    {errors.name?.message as string}
                  </p>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <div className="flex items-center input-border py-2 px-3 rounded-md ">
                    <svg
                      version="1.1"
                      fill="#543310"
                      id="svg2"
                      // Remove the unknown attributes
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      width="20px"
                      height="20px"
                      viewBox="0 0 1200 1200"
                      enableBackground="new 0 0 1200 1200"
                      xmlSpace="preserve"
                    >
                      <path
                        id="path16102"
                        d="M1183.326,997.842l-169.187,167.83
                  c-24.974,25.612-58.077,34.289-90.316,34.328c-142.571-4.271-277.333-74.304-387.981-146.215
                  C354.22,921.655,187.574,757.82,82.984,559.832C42.87,476.809-4.198,370.878,0.299,278.209c0.401-34.86,9.795-69.073,34.346-91.543
                  L203.831,17.565c35.132-29.883,69.107-19.551,91.589,15.257l136.111,258.102c14.326,30.577,6.108,63.339-15.266,85.188l-62.332,62.3
                  c-3.848,5.271-6.298,11.271-6.36,17.801c23.902,92.522,96.313,177.799,160.281,236.486
                  c63.967,58.688,132.725,138.198,221.977,157.021c11.032,3.077,24.545,4.158,32.438-3.179l72.51-73.743
                  c24.996-18.945,61.086-28.205,87.771-12.714h1.272l245.51,144.943C1205.373,927.619,1209.131,971.279,1183.326,997.842
                  L1183.326,997.842z"
                      />
                    </svg>
                    <input
                      {...register("phone", {
                        required: "Please Enter Phone No.",
                      })}
                      className="pl-2 outline-none border-none w-full bg-transparent"
                      type="tel"
                      maxLength={10}
                      name="phone"
                      id=""
                      placeholder="Phone"
                    />
                  </div>
                  <p className="text-red-600">
                    {errors.phone?.message as string}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-4">
                <div className="relative z-0 w-full mb-5 group">
                  <div className="flex items-center input-border py-2 px-3 rounded-md">
                    <svg
                      fill="#543310"
                      width="20px"
                      height="20px"
                      viewBox="0 0 36 36"
                      version="1.1"
                      preserveAspectRatio="xMidYMid meet"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <title>house-solid</title>
                      <path
                        className="clr-i-solid clr-i-solid-path-1"
                        d="M33,19a1,1,0,0,1-.71-.29L18,4.41,3.71,18.71a1,1,0,0,1-1.41-1.41l15-15a1,1,0,0,1,1.41,0l15,15A1,1,0,0,1,33,19Z"
                      ></path>
                      <path
                        className="clr-i-solid clr-i-solid-path-2"
                        d="M18,7.79,6,19.83V32a2,2,0,0,0,2,2h7V24h6V34h7a2,2,0,0,0,2-2V19.76Z"
                      ></path>
                      <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        fillOpacity="0"
                      />
                    </svg>
                    <input
                      {...register("houseNo", {
                        required: "Please Enter House No.",
                      })}
                      className="pl-2 outline-none border-none bg-transparent w-full"
                      type="text"
                      name="houseNo"
                      placeholder="House No."
                    />
                  </div>
                  <p className="text-red-600">
                    {errors.houseNo?.message as string}
                  </p>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <div className="flex items-center input-border py-2 px-3 rounded-md">
                    <svg
                      fill="#543310"
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7.97,2.242l-5,20A1,1,0,0,1,2,23a1.025,1.025,0,0,1-.244-.03,1,1,0,0,1-.727-1.212l5-20a1,1,0,1,1,1.94.484Zm10-.484a1,1,0,1,0-1.94.484l5,20A1,1,0,0,0,22,23a1.017,1.017,0,0,0,.243-.03,1,1,0,0,0,.728-1.212ZM12,1a1,1,0,0,0-1,1V6a1,1,0,0,0,2,0V2A1,1,0,0,0,12,1Zm0,7.912a1,1,0,0,0-1,1v4.176a1,1,0,1,0,2,0V9.912A1,1,0,0,0,12,8.912ZM12,17a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V18A1,1,0,0,0,12,17Z" />
                    </svg>
                    <input
                      {...register("street", {
                        required: "Please Enter Street",
                      })}
                      className="pl-2 outline-none border-none bg-transparent w-full"
                      type="text"
                      name="street"
                      placeholder="Street"
                    />
                  </div>
                  <p className="text-red-600">
                    {errors.street?.message as string}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-4">
                <div className="relative z-0 w-full mb-5 group">
                  <div className="flex items-center input-border py-2 px-3 rounded-md">
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#543310"
                        d="M8,0 C11.3137,0 14,2.68629 14,6 C14,7.33918 13.5613,8.57588 12.8197,9.57422 L7.99994,16 L3.1803,9.57422 C2.43873,8.57588 2,7.33918 2,6 C2,2.68629 4.68629,0 8,0 Z M8,2 C5.79086,2 4,3.79086 4,6 C4,6.89363 4.29068,7.71358 4.78334,8.37826 L7.99996,12.6668 L11.2167,8.37817 C11.7093,7.71351 12,6.89359 12,6 C12,3.79086 10.2091,2 8,2 Z M8,4 C9.10457,4 10,4.89543 10,6 C10,7.10457 9.10457,8 8,8 C6.89543,8 6,7.10457 6,6 C6,4.89543 6.89543,4 8,4 Z"
                      />
                    </svg>
                    <input
                      {...register("address", {
                        required: "Please Enter Address",
                      })}
                      className="pl-2 outline-none border-none bg-transparent w-full"
                      type="text"
                      name="address"
                      placeholder="Address"
                    />
                  </div>
                  <p className="text-red-600">
                    {errors.address?.message as string}
                  </p>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <div className="flex items-center input-border py-2 px-3 rounded-md">
                    <svg
                      fill="#543310"
                      width="25px"
                      height="25px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 7H3v1h2v9H3v1h5v-1H6zm7.75 0H10v1h3.75a.25.25 0 0 1 .25.25v3.5a.25.25 0 0 1-.25.25h-2.5A1.251 1.251 0 0 0 10 13.25v3.5A1.251 1.251 0 0 0 11.25 18H15v-1h-3.75a.25.25 0 0 1-.25-.25v-3.5a.25.25 0 0 1 .25-.25h2.5A1.251 1.251 0 0 0 15 11.75v-3.5A1.251 1.251 0 0 0 13.75 7zM22 8.25A1.251 1.251 0 0 0 20.75 7H17v1h3.75a.25.25 0 0 1 .25.25V12h-4v1h4v3.75a.25.25 0 0 1-.25.25H17v1h3.75A1.251 1.251 0 0 0 22 16.75z" />
                      <path fill="none" d="M0 0h24v24H0z" />
                    </svg>
                    <input
                      {...register("pincode", {
                        required: "Please Enter Pin Code",
                      })}
                      className="pl-2 outline-none border-none bg-transparent w-full"
                      type="number"
                      name="pincode"
                      placeholder="Pin Code"
                    />
                  </div>
                  <p className="text-red-600">
                    {errors.pincode?.message as string}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-4">
                <div className="relative z-0 w-full mb-5 group">
                  <div className="flex items-center input-border py-2 px-3 rounded-md">
                    <svg
                      fill="#543310"
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M13,9a1,1,0,0,0-1-1H3A1,1,0,0,0,2,9V22H13ZM6,20H4V18H6Zm0-4H4V14H6Zm0-4H4V10H6Zm5,8H8V18h3Zm0-4H8V14h3Zm0-4H8V10h3Zm3.5-6H6V3A1,1,0,0,1,7,2H17a1,1,0,0,1,1,1v7H15V6.5A.5.5,0,0,0,14.5,6ZM22,13v9H19.5V18h-2v4H15V13a1,1,0,0,1,1-1h5A1,1,0,0,1,22,13Z" />
                    </svg>
                    <input
                      {...register("city", {
                        required: "Please Enter City",
                      })}
                      className="pl-2 outline-none border-none bg-transparent w-full"
                      type="text"
                      name="city"
                      placeholder="City"
                    />
                  </div>
                  <p className="text-red-600">
                    {errors.city?.message as string}
                  </p>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <div className="flex items-center input-border py-2 px-3 rounded-md">
                    <svg
                      fill="#543310"
                      width="20px"
                      height="20px"
                      viewBox="0 0 15 15"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      id="city"
                    >
                      <path
                        d="M13.6368,3.9994h-1.6387V1.3608C11.99804,1.16148,11.83642,0.99994,11.6371,1l0,0h-0.278&#xA;&#x9;c-0.19932,0-0.3609,0.16158-0.3609,0.3609l0,0v2.6385H9.36c-0.19932,0-0.3609,0.16158-0.3609,0.3609l0,0l0,0v5.6381h-3.637&#xA;&#x9;c-0.20042,0-0.3629,0.16248-0.3629,0.3629v3.2745c0.00055,0.20003,0.16287,0.3619,0.3629,0.3619h8.2747&#xA;&#x9;c0.19932,0,0.3609-0.16158,0.3609-0.3609l0,0V4.36c0-0.19932-0.16158-0.3609-0.3609-0.3609l0,0L13.6368,3.9994z M6.9989,11.9981h-1&#xA;&#x9;v-1h1V11.9981z M8.9989,11.9981h-1v-1h1V11.9981z M10.9989,11.9981h-1v-1h1V11.9981z M10.9989,9.9981h-1v-1h1V9.9981z&#xA;&#x9; M10.9989,7.9981h-1v-1h1V7.9981z M10.9989,5.9981h-1v-1h1V5.9981z M12.9989,11.9971h-1v-1h1V11.9971z M12.9989,9.9971h-1v-1h1&#xA;&#x9;V9.9971z M12.9989,7.9971h-1v-1h1V7.9971z M12.9989,5.9971h-1v-1h1V5.9971z M7.9987,1.3608C7.99864,1.16152,7.83708,1,7.6378,1H5.36&#xA;&#x9;C5.16068,1,4.9991,1.16158,4.9991,1.3609l0,0V3H3.36C3.16138,3.00049,3.00049,3.16138,3,3.36l0,0v0.6394H1.3608&#xA;&#x9;C1.16164,3.99945,1.00017,4.16084,1,4.36l0,0v9.2765c0,0.19932,0.16158,0.3609,0.3609,0.3609h2.6385V8.9986h3.9993V1.3608z&#xA;&#x9; M3,11.9981H2v-1h1V11.9981z M3,9.9981H2v-1h1V9.9981z M3,7.9981H2v-1h1V7.9981z M3,5.9981H2v-1h1V5.9981z M5,7.9981H4v-1h1V7.9981z&#xA;&#x9; M5,5.9981H4v-1h1V5.9981z M7,7.9981H6v-1h1V7.9981z M7,5.9981H6v-1h1V5.9981z M7,3.9981H6V3h1v1V3.9981z"
                      />
                    </svg>
                    <input
                      {...register("state", {
                        required: "Please Enter State",
                      })}
                      className="pl-2 outline-none border-none bg-transparent w-full"
                      type="text"
                      name="state"
                      placeholder="State"
                    />
                  </div>
                  <p className="text-red-600">
                    {errors.state?.message as string}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-4">
                <div className="relative z-0 w-full mb-5 group">
                  <div className="flex items-center input-border py-2 px-3 rounded-md">
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 15.0233C18.8333 15.6877 15.6 16.722 12 15.1273C10.5 14.2968 6.8 13.0301 4 15.0234M4 21.9326V2.99656C6.8 1.00328 10.5 2.26993 12 3.10047C15.6 4.69509 18.8333 3.66084 20 2.99642V14.9561"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      {...register("country", {
                        required: "Please Enter Country Name",
                      })}
                      className="pl-2 outline-none border-none bg-transparent w-full"
                      type="text"
                      name="country"
                      placeholder="Country"
                    />
                  </div>
                  <p className="text-red-600">
                    {errors.country?.message as string}
                  </p>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <div className="flex items-center input-border py-2 px-3 rounded-md">
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 15.0233C18.8333 15.6877 15.6 16.722 12 15.1273C10.5 14.2968 6.8 13.0301 4 15.0234M4 21.9326V2.99656C6.8 1.00328 10.5 2.26993 12 3.10047C15.6 4.69509 18.8333 3.66084 20 2.99642V14.9561"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      {...register("landmark", {
                        required: "Please Enter Country Name",
                      })}
                      className="pl-2 outline-none border-none bg-transparent w-full"
                      type="text"
                      name="landmark"
                      placeholder="Landmark"
                    />
                  </div>
                  <p className="text-red-600">
                    {errors.landmark?.message as string}
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 flex justify-center mb-8 w-full rounded-md cta px-6 py-3 font-medium text-white"
              >
                {loader !== true ? " Save Address" : <ButtonLoader />}
              </button>
            </form>
          </div>

          {/* Time Picker for sandook */}
          <div className="mt-4 w-full px-4">
            <div className="shadow-md gap-4 mt-2 p-4 w-full">
              <h5>Select Date and time for home visit</h5>
              <input
                type="date"
                id="date"
                name="date"
                min={minDate}
                max={maxDate}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {selectedDate !== "" &&
                availableSlots &&
                availableSlots.map((item, index) => {
                  const currentDateTime = new Date(); // Get current date and time
                  const selectedDateTime = new Date(selectedDate); // Convert selected date to Date object

                  // Function to parse time slot (e.g., '10:00 AM-12:00 PM')
                  const parseTime = (timeString: string) => {
                    const [time, modifier] = timeString.split(" ");

                    const [hoursStr, minutesStr] = time.split(":"); // ✅ Now split hours & minutes

                    let hours = parseInt(hoursStr, 10);
                    const minutes = parseInt(minutesStr, 10); // ✅ Declare as const

                    if (modifier === "PM" && hours !== 12) {
                      hours += 12; // ✅ Convert PM times to 24-hour format
                    } else if (modifier === "AM" && hours === 12) {
                      hours = 0; // ✅ Handle midnight (12:00 AM)
                    }

                    return {
                      hours,
                      minutes,
                    };
                  };

                  // Extract start time (e.g., '10:00 AM') from the slot
                  const slotStartTime = item.slotName.split("-")[0].trim();
                  const { hours: slotStartHours, minutes: slotStartMinutes } =
                    parseTime(slotStartTime);

                  // Set the time for the selected date to the slot's start time
                  const slotDateTime = new Date(
                    selectedDateTime.setHours(
                      slotStartHours,
                      slotStartMinutes,
                      0,
                      0
                    )
                  );

                  // Check if the current time is before the time slot
                  const isSlotInPast = currentDateTime > slotDateTime;

                  return (
                    <div key={index} className="mb-4 flex items-center mt-5">
                      <input
                        type="radio"
                        className="mr-2"
                        name="time"
                        id={item.id}
                        value={item.slotName}
                        onChange={() => setTimeSlotId(item.id)}
                        disabled={isSlotInPast} // Disable if the slot is in the past
                      />
                      <label
                        htmlFor={item.id}
                        className={`${
                          isSlotInPast ? "text-gray-400" : ""
                        } cursor-pointer`} // Grayed out past slots
                      >
                        {item.slotName} {isSlotInPast && "(Past)"}
                      </label>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="px-4 pt-8">
          <div className="sticky top-20">
            {/* Header */}
            <p className="text-xl font-medium">Order Summary</p>

            {/* SubHeading */}
            <p className="text-gray-400">
              Check your items. And select a suitable shipping method.
            </p>

            {/* PRODUUCT LIST */}
            <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
              {sandookData.length > 0 &&
                sandookData.map((item, index) => (
                  <div
                    key={index}
                    className={`lg:flex object-cover bg-white sm:flex-row ${
                      index !== sandookData.length - 1
                        ? "border-b-[1px] border-gray-400"
                        : ""
                    }`}
                  >
                    <Image
                      className="m-2 lg:h-24 lg:w-28 h-24 w-20"
                      src={item.product.thumbnail}
                      alt=""
                      width={112} // Set a fixed width (28 * 4)
                      height={96} // Set a fixed height (24 * 4)
                      priority
                    />
                    <div className="flex w-full flex-col py-2">
                      <span className="font-semibold text-color">
                        {item.product.productTitle}
                      </span>
                      <div className="flex gap-4">
                        <span className=" text-color">
                          Quntity : {item.quantity}
                        </span>
                        {item.product.type == "Stitched" && (
                          <>
                            <span className=" text-color">
                              Color : {item.productStock.color}
                            </span>
                            <span className=" text-color">
                              Size : {item.productStock.size}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-lg">
                        <div className="flex gap-3">
                          <p className="flex gap-2 font-medium">
                            &#8377; {item.product.afterDiscountPrice}
                          </p>
                          <p className="text-gray-500">
                            <s>{item.product.price}</s>
                          </p>
                          <span className="px-3 text-xs font-normal bg-gray-200 leading-none flex items-center rounded text-black">
                            {item.product.discountPrice && item.product.price
                              ? `${(
                                  (item.product.discountPrice /
                                    item.product.price) *
                                  100
                                ).toFixed(2)}% OFF`
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* PRICE SUBTOTAL */}
            <div className="p-2 pt-4">
              {" "}
              {/* Total */}
              <div className="border-t border-b py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Sandook Total
                  </p>
                  <p className=" text-gray-900">
                    &#8377; {discountPrice.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Convenience Charges
                  </p>
                  <p className=" text-gray-900">&#8377; 250</p>
                </div>
                <div className="mt-2">
                  <span className="text-xs inline-block text-gray-600">
                    * A fee of Rs. 250 is charged only if no purchase is made
                    from Sandook. Otherwise, if you do buy anything from
                    Sandook, Rs. 250 will be refunded.
                  </span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  Prepaid Cost
                </p>
                <p className="text-2xl font-medium text-gray-900">
                  &#8377; 250
                </p>
              </div>
              {/* Confirm ORDER */}
              <div className="mt-6 w-full flex flex-col items-start justify-between">
                {timeSlotId === "" ? (
                  <button className="w-full gap-2 text-center cursor-not-allowed bg-gray-500 text-gray-900 py-3 px-8">
                    Confirm Order
                  </button>
                ) : (
                  <button
                    onClick={handleConfirmOrder}
                    className="w-full gap-2 text-center cta text-white py-3 px-8"
                  >
                    {loader ? <ButtonLoader /> : "Confirm Order"}
                  </button>
                )}
                {timeSlotId === "" && (
                  <div className="mt-2">
                    <span className="text-xs block text-red-600">
                      * Please choose a suitable time slot before confirming the
                      order
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SandookCheckout = () => {
  return (
    <CustomerPersist>
      <CustomerRequireAuth>
        <SandookCheckoutContent />
      </CustomerRequireAuth>
    </CustomerPersist>
  );
};

export default SandookCheckout;
