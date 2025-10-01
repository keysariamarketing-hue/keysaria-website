"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdAdd } from "react-icons/md";
import useAuth from "@/hook/useAuth";
import { AuthContextType } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import {
  createBillingAddress,
  createShippingAddress,
  getCustomerBillingAddress,
  getCustomerShippingAddress,
} from "@/app/api/checkOut";
import { BillingAddresses } from "@/types/billingAddressType";
import { ShippingAddress } from "@/types/shippingAddressType";
import { createOrderAPIV2, updatePaymentStatusV2 } from "@/app/api/newOrderAPI";
import { deleteAllCart } from "@/app/api/cartAPI";
import { fetchCartDataThunk } from "@/features/cartSlice";
import { checkStatus, getOrderId } from "@/app/api/paymentAPI";
import { useDispatch } from "react-redux";
import { ModeOfPayment } from "@/types/enums";
import { CartItemType } from "@/types/cartItemType";
import { sendOrderConfirmMail } from "@/app/api/customerOrder";
import Image from "next/image";
import { ButtonLoader } from "@/components/loaders/ButtonLoader";
import {
  Building,
  Flag,
  HomeIcon,
  LocateFixed,
  MapPin,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import CustomerPersist from "@/components/auth/CustomerPersist";
import CustomerRequireAuth from "@/components/auth/CustomerRequireAuth";
import OrderCheckoutModal from "@/components/checkout/OrderCheckoutModal";
import { RazorpayPaymentResponse } from "@/types/razorpyResponseType";
import Script from "next/script";
import { totalCartPriceCalculation } from "@/lib/cartPriceCalculator";
import { AxiosError } from "axios";

const logoUrl = "/footer-logo.png";

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

const ProductCheckOutContent = () => {
  const [addressSelected, setAddressSelected] = useState(0);
  const { customerAuth } = useAuth() as AuthContextType;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const customerId = customerAuth && customerAuth.result.CustomerId;
  const customer = customerAuth && customerAuth.result;
  const customerEmail = customerAuth && customerAuth.result.email;

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<AddressFormData>();

  const cartData: CartItemType[] = useSelector(
    (state: RootState) => state.cartItem.allCart as CartItemType[]
  );
  const privateAxios = useAxiosPrivate();
  const getCart = { privateAxios, customerId };

  const { discountPrice = 0 } = totalCartPriceCalculation(cartData);
  console.log(totalCartPriceCalculation(cartData));

  const [billingAddress, setBillingAddress] = useState<BillingAddresses[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress[]>([]);

  const [loader, setLoader] = useState<boolean>(false);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [addStatus, setAddStatus] = useState<boolean>(false);

  const [couponCode, setCouponCode] = useState<string | undefined>(undefined); // User-entered coupon code
  const [couponDiscount, setCouponDiscount] = useState(0); // Discount amount
  const [finalTotal, setFinalTotal] = useState(discountPrice); // Final amount after discount
  const [couponMessage, setCouponMessage] = useState<string | null>(null); // Success message
  const [couponError, setCouponError] = useState<string | null>(null); // Error message

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setFinalTotal(discountPrice);
  }, [discountPrice]);

  useEffect(() => {
    if (customerId) {
      customerGetBillingAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  //create billing address....................
  const customerCreateBillingAddress: SubmitHandler<AddressFormData> = async (
    data
  ) => {
    setLoader(true);
    const allData = { privateAxios, data: { ...data, customerId: customerId } };
    try {
      setLoader(true);
      const res = await createBillingAddress(allData);
      if (res.status === 201) {
        reset();
        customerCreateShippingAddress(data);
        customerGetBillingAddress();
        setAddStatus(false);
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };
  //create shipphing address....................
  const customerCreateShippingAddress: SubmitHandler<AddressFormData> = async (
    data
  ) => {
    const allData = { privateAxios, data: { ...data, customerId: customerId } };

    try {
      const res = await createShippingAddress(allData);
      if (res.status === 201) {
        reset();
        customerGetBillingAddress();
        setAddStatus(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get billing & shipping addresses
  const customerGetBillingAddress = async () => {
    const allData = { privateAxios, customerId };
    try {
      const res = await getCustomerBillingAddress(allData);
      const res2 = await getCustomerShippingAddress(allData);
      if (res.status === 200) {
        setBillingAddress(res.data);
        setShippingAddress(res2.data);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // Apply Coupon
  const validateCoupon = async () => {
    if (!couponCode) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    console.log("CARTDATA", cartData);

    try {
      const res = await privateAxios.post(`/coupon/v2/validate/${couponCode}`, {
        couponCode,
        userId: customerId,
        orderAmount: discountPrice,
        itemCount: cartData.length,
      });

      if (res.status === 200) {
        const { discount, finalTotal, couponInfo } = res.data;
        setCouponDiscount(discount);
        setFinalTotal(finalTotal);
        setCouponMessage(`Coupon Applied: ${couponInfo.couponTitle}`);
        setCouponError(null);
      } else {
        setCouponError("Invalid coupon code.");
        setCouponMessage(null);
      }
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        setCouponError(error.response.data.message);
      } else {
        setCouponError("Invalid or expired coupon.");
      }
      setCouponMessage(null);
    }
  };

  // Create Order
  const createOrder = async (paymentMode: ModeOfPayment) => {
    if (!billingAddress[addressSelected] || !shippingAddress[addressSelected]) {
      toast.error("Please select a valid address.");
      setButtonLoader(false);
      return;
    }
    setButtonLoader(true);

    // If it's a PREPAID order, apply a 5% discount if no coupon is applied
    if (paymentMode === "PREPAID") {
      if (!couponCode) {
        setCouponCode("PREPAID");
        toast.success("Prepaid 5% discount applied!");
      }
    }

    const allData = {
      privateAxios,
      customerId,
      orderItems: cartData,
      subTotal: finalTotal,
      couponCode:
        paymentMode === "PREPAID"
          ? couponCode
            ? couponCode
            : "PREPAID"
          : couponCode,
      billingAddressId: billingAddress[addressSelected]?.id,
      shippingAddressId: shippingAddress[addressSelected]?.id,
      modeOfPayment: paymentMode,
    };

    console.log(allData);

    try {
      const res = await createOrderAPIV2(allData);
      if (res.status === 201 || res.status === 200) {
        if (paymentMode === "PREPAID") {
          handleCheckOut(
            res.data.order.transactionId,
            res.data.order.finalTotal
          );
        } else {
          toast.success("Order placed successfully!");
          await deleteAllCart({ privateAxios, customerId });
          dispatch(fetchCartDataThunk(getCart));
          router.push("/success");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while placing the order");
    } finally {
      setButtonLoader(false);
    }
  };

  // Razorpay Checkout
  const handleCheckOut = async (transactionId: string, orderTotal: number) => {
    try {
      const res = await getOrderId({
        privateAxios,
        amount: orderTotal * 100,
        receipt: String(Date.now()),
      });

      if (res.status === 200) {
        console.log("Create Order Res", res);

        createPayment(res.data.id, transactionId, orderTotal);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while initiating payment");
    }
  };

  // Payment Handler
  const createPayment = (
    razorpayId: string,
    transactionId: string,
    orderTotal: number
  ) => {
    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_ID_KEY!,
        order_id: razorpayId,
        name: "Keysaria",
        currency: "INR",
        amount: orderTotal * 100,
        description: "Total amount of your order",
        image: logoUrl,
        prefill: {
          name: customer?.CustomerName,
          email: customer?.email,
          contact: customer?.phone,
        },
        handler: async function (response: RazorpayPaymentResponse) {
          await finalSubmit(
            response.razorpay_order_id,
            response.razorpay_signature,
            response.razorpay_payment_id,
            transactionId
          );
        },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (response) {
        router.push("/failed");
        console.log("failed error", response);
      });
      rzp1.open();
    } catch {
      router.push("/failed");
      toast.error("Error while making payment");
    }
  };

  // Final Payment Submission
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
      setButtonLoader(false);
      // Callback from the razorpay after successful tx
      const res = await checkStatus(allData);
      if (res.data.msg === "success") {
        //delete whole cart...............
        const data = { privateAxios, customerId };
        await deleteAllCart(data);

        // redux for clearing cart
        dispatch(fetchCartDataThunk(getCart));

        router.push("/success");
      } else {
        router.push("/failed");
      }
    } catch (error) {
      setButtonLoader(false);
      console.log(error);
      router.push("/failed");
    }

    await updatePaymentStatusV2({ privateAxios, transactionId });

    // sending success email
    console.log(customerEmail);

    const products = cartData.map((item) => {
      return { productId: item.productId, quantity: item.quantity };
    });

    await sendOrderConfirmMail({ privateAxios, customerEmail, products });
  };

  // Open Payment Modal
  const handlePayNow = () => {
    setIsModalOpen(true);
  };

  // Proceed with Payment
  const handleProceedPayment = (method: ModeOfPayment) => {
    setIsModalOpen(false);
    console.log(method);
    createOrder(method);
  };

  //Open address form functionality............
  const openAddressForm = () => {
    return setAddStatus(!addStatus);
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div
        className="grid
             min-h-screen lg:py-10 pb-28 md:py-4 sm:py-4 lg:grid-cols-2 lg:px-10 xl:px-20"
      >
        <div className="mt-10 bg-gray-50 lg:mt-0">
          <div className="nav-bg p-3 text-color rounded-tl-lg rounded-tr-lg uppercase text-xl">
            Delivery Address
          </div>

          {/* Biling Address mapping */}
          <div className="mt-4 w-full px-4">
            {/* Address data map............................................................... */}
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

                        <p>{item.address}</p>
                        <p>
                          {item.houseNo},{item.street}
                        </p>
                        <p>
                          {item.city}, {item.state}
                        </p>
                        <p>{item.phone}</p>
                      </div>
                      {/* <Link
                        // onClick={editAddress}
                        className="absolute top-0 right-0"
                      >
                        <FaEdit className="text-color text-xl" />
                      </Link> */}
                    </label>
                  </div>
                </div>
              ))}
          </div>

          {/* Add new address btn */}
          <div className="flex gap-4 mt-2 p-4 py-10 w-full">
            <button
              onClick={() => openAddressForm()}
              className="flex gap-2 items-center cta text-white py-3 px-8"
            >
              <MdAdd className="font-semibold text-2xl" /> Add New Address
            </button>
          </div>

          {/* ADD NEW ADDRESS */}
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
                    <UserIcon />
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
                    <PhoneIcon />
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
                    <HomeIcon />
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
                    <LocateFixed />
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
                    <MapPin />
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
                    <MapPin />
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
                    <MapPin />
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
                    <Building />
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
                    <Flag />
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
                    <Flag />
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
        </div>

        {/* ORDER SUMMARY */}
        <div className="px-4 pt-8">
          <div className="sticky top-20">
            <p className="text-xl font-medium">Order Summary</p>
            <p className="text-gray-400">
              Check your items. And select a suitable shipping method.
            </p>

            {/* product list */}
            <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
              {cartData &&
                cartData.length > 0 &&
                cartData.map((item, index) => (
                  <div
                    key={index}
                    className={`lg:flex object-cover bg-white sm:flex-row ${
                      index !== cartData.length - 1
                        ? "border-b-[1px] border-gray-400"
                        : ""
                    }`}
                  >
                    <Image
                      className="m-2 lg:h-24 lg:w-28 h-24 w-20"
                      src={item.product.productImage[0]}
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
                          Quantity : {item.quantity}
                        </span>
                        {item.product.type == "Stitched" && (
                          <div className="flex gap-4">
                            <span className="text-color">
                              Color : {item.productStock.color}
                            </span>
                            <span className="text-color">
                              Size : {item.productStock.size}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-lg">
                        <div className="flex gap-3 items-center">
                          <p className="flex gap-2 font-medium">
                            &#8377; {item.product.afterDiscountPrice}
                          </p>
                          <p className="text-gray-500">
                            <s>{item.product.price}</s>
                          </p>
                          <span className="px-3 text-xs font-normal bg-gray-200 py-1 rounded text-black">
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

            {/* Coupan Section */}
            <div className="p-2 pt-4">
              <form
                className="flex gap-[10px]"
                onSubmit={(e) => {
                  e.preventDefault();
                  validateCoupon();
                }}
              >
                <input
                  className="w-[80%] p-[5px] border focus:outline-none"
                  type="text"
                  placeholder="Discount Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-[20%] bg-black text-white px-[5px]"
                >
                  Apply
                </button>
              </form>

              {/* Show validation messages */}
              {couponMessage && (
                <p className="text-green-600 mt-2">{couponMessage}</p>
              )}
              {couponError && (
                <p className="text-red-600 text-sm font-medium mt-2">
                  *{couponError}
                </p>
              )}
            </div>

            {/* PRICE SUBTOTAL */}
            <div className="p-2 pt-4">
              {" "}
              {/* Total */}
              <div className="border-t border-b py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Subtotal</p>
                  <p className=" text-gray-900">
                    &#8377; {discountPrice.toFixed(2)}
                  </p>
                </div>
                {couponDiscount != 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Coupon Discount
                    </p>
                    <p className=" text-gray-900">&#8377; {couponDiscount}</p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Shipping</p>
                  <p className=" text-gray-900">&#8377; 0.0</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-2xl font-medium text-gray-900">
                  &#8377; {finalTotal.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="w-full border">
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => {
                    handlePayNow();
                  }}
                  className="flex items-center justify-center w-full uppercase cta text-white py-2 px-10"
                >
                  {buttonLoader ? <ButtonLoader /> : "Pay Now"}
                </button>
                <OrderCheckoutModal
                  isVisible={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onProceed={handleProceedPayment}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ProductCheckOut = () => {
  return (
    <CustomerPersist>
      <CustomerRequireAuth>
        <ProductCheckOutContent />
      </CustomerRequireAuth>
    </CustomerPersist>
  );
};

export default ProductCheckOut;
