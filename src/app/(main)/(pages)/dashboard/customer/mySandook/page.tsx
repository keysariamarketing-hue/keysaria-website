"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "@/hook/useAuth";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import { AuthContextType } from "@/context/AuthProvider";
import { AppDispatch, RootState } from "@/store/store";
import { SandokProduct } from "@/types/sandookType";
import {
  createSandookProduct,
  decrementSandookProductAPI,
  removeProductFromSandook,
} from "@/app/api/sandookApis/sandookAPI";
import { fetchSandookDataThunk } from "@/features/sandookSlice";
import Image from "next/image";
import { totalSandookPriceCalculation } from "@/lib/sandookPriceCalculator";

const MySandook = () => {
  const { customerAuth } = useAuth() as AuthContextType;
  const customerId = customerAuth?.result?.CustomerId;
  const privateAxios = useAxiosPrivate();
  const sandookData: SandokProduct[] = useSelector(
    (state: RootState) => state.sandookItem.allSandook
  );

  const minLimit = 5;
  const maxLimit = 10;
  const [limitError, setLimitError] = useState({
    maxLimitError: false,
    minLimitError: false,
  });

  const sandookProductQuantity = useRef<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    sandookProductQuantity.current = sandookData
      ?.map((item) => item.quantity)
      .reduce((acc, cur) => acc + cur, 0);

    if (sandookProductQuantity.current < minLimit) {
      setLimitError({ maxLimitError: false, minLimitError: true });
    } else if (sandookProductQuantity.current > maxLimit) {
      setLimitError({ maxLimitError: true, minLimitError: false });
    } else {
      setLimitError({ maxLimitError: false, minLimitError: false });
    }
  }, [sandookData]);

  const getSandook = { customerId, privateAxios };

  // Increase Sandook product quantity
  const incrementSandookProduct = async (data: {
    sandokId: string;
    productId: string;
    productStockId: string;
    quantity: number;
  }) => {
    try {
      const res = await createSandookProduct({ privateAxios, ...data });
      if (res.status === 200) {
        dispatch(fetchSandookDataThunk(getSandook));
      }
    } catch (error) {
      console.error("Error incrementing Sandook product:", error);
    }
  };

  // Decrease Sandook product quantity
  const decrementSandookProduct = async (data: {
    sandokId: string;
    productId: string;
    productStockId: string;
  }) => {
    try {
      const res = await decrementSandookProductAPI({ privateAxios, ...data });
      if (res.status === 200) {
        dispatch(fetchSandookDataThunk(getSandook));
      }
    } catch (error) {
      console.error("Error decrementing Sandook product:", error);
    }
  };

  // Delete product from Sandook
  const deleteSandookProduct = async (id: string) => {
    try {
      const res = await removeProductFromSandook({ privateAxios, id });
      if (res.status === 200) {
        dispatch(fetchSandookDataThunk(getSandook));
      }
    } catch (error) {
      console.error("Error deleting Sandook product:", error);
    }
  };

  const { subTotal, discountPrice } =
    sandookData?.length > 0
      ? totalSandookPriceCalculation(sandookData)
      : { subTotal: 0, discountPrice: 0 };

  useEffect(() => {
    dispatch(fetchSandookDataThunk(getSandook));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customerId]);

  return (
    <div className={`dashboard flex gap-4`}>
      <div className="col flex-[100%] ">
        <div className="flex gap-4 py-10 min-h-screen pb-0">
          <div className="col flex-[100%] lg:px-6">
            <div className="nav flex items-center text-color p-2">
              <h4 className="text-2xl">My Sandook</h4>
            </div>
            <div className="container mx-auto mt-10">
              <div className="md:flex shadow-md my-10">
                {/* Product List */}
                <div className="w-full sm:w-3/4 bg-white lg:px-10 px-4 lg:py-10">
                  <div className="flex justify-between border-b pb-8">
                    <p className="lg:text-2xl">Sandook Products</p>
                    <p className="lg:text-2xl">
                      {/* {sandookData && sandookData ? sandookData.length : 0}{' '} */}
                      Items
                    </p>
                  </div>

                  {sandookData && sandookData.length > 0 ? (
                    sandookData.map((item, index) => (
                      <div
                        key={index}
                        className="md:flex items-strech py-8 md:py-10 lg:py-8 border-t border-gray-50 "
                      >
                        <div className="md:w-2/12 2xl:w-1/4 w-full object-center object-cover">
                          <Image
                            src={item.product.thumbnail}
                            alt="Black Leather Purse"
                            className="h-full w-11/12 object-cover"
                            width={200} // Adjust width based on design
                            height={200}
                          />
                        </div>
                        <div className="md:pl-3 md:w-8/12 flex flex-col justify-center">
                          <div className="flex items-center justify-between w-full">
                            <p
                              onClick={() =>
                                router.push(
                                  `/product/details/${item.product.id}`
                                )
                              }
                              className="font-bold hover:cursor-pointer text-color hover:underline decoration-1"
                            >
                              {item.product.productTitle}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="pb-2 text-gray-600 text-sm">
                              Price: ₹{" "}
                              <span className="text-md">
                                {item.product.afterDiscountPrice.toFixed(2)}
                              </span>
                            </p>
                            <p className="pb-2 text-gray-600 text-sm">
                              ₹{" "}
                              <span className="text-md line-through">
                                {item.product.price}
                              </span>
                            </p>
                          </div>
                          {item.product.type === "Stitched" && (
                            <>
                              <div className="flex items-center gap-4">
                                <p className="pb-2 text-gray-600 text-sm">
                                  Colour:{" "}
                                  <span className="text-md">
                                    {item.productStock.color}
                                  </span>
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <p className="pb-2 text-gray-600 text-sm">
                                  Size:{" "}
                                  <span className="text-md">
                                    {item.productStock.size}
                                  </span>
                                </p>
                              </div>
                            </>
                          )}
                          <div className="w-1/2 px-2 flex items-center gap-2">
                            <button
                              className="w-8 h-8 cta rounded-full text-white text-md"
                              onClick={() =>
                                decrementSandookProduct({
                                  sandokId: item.sandokId,
                                  productId: item.product.id,
                                  productStockId: item.productStock.id,
                                })
                              }
                            >
                              -
                            </button>
                            <span className="font-bold">{item.quantity}</span>
                            <button
                              className="w-8 h-8 cta rounded-full text-white"
                              onClick={() =>
                                incrementSandookProduct({
                                  quantity: 1,
                                  sandokId: item.sandokId,
                                  productId: item.product.id,
                                  productStockId: item.productStock.id,
                                })
                              }
                            >
                              +
                            </button>
                          </div>
                          <div className="flex items-center justify-between pt-5">
                            <div className="flex items-center">
                              <p
                                onClick={() => deleteSandookProduct(item.id)}
                                className="text-xs leading-3 underline text-red-500 pl-5 cursor-pointer"
                              >
                                Remove
                              </p>
                            </div>
                            {/* <p className="text-base font-black leading-none text-gray-800"></p> */}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No Product Added</p>
                  )}

                  <Link
                    href="/"
                    className="flex w-fit font-semibold text-color text-sm mt-10"
                  >
                    <svg
                      className="fill-current mr-2 text-color w-4"
                      viewBox="0 0 448 512"
                    >
                      <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>

                {/* Order Summary */}
                {sandookData && sandookData.length > 0 ? (
                  <div
                    id="summary"
                    className="w-full sm:w-1/4 md:w-1/2 px-8 py-10"
                  >
                    <p className="text-2xl border-b pb-8">Order Summary</p>
                    <div className="bg-white rounded-lg lg:shadow-md lg:p-6">
                      <h2 className="text-lg font-semibold mb-4 border-b">
                        Price Details
                      </h2>
                      <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>&#8377; {subTotal || 0}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Sandook Convenience Charge</span>
                        <span className="flex gap-2">250</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Discount Price</span>
                        <span className="text-green-500">
                          - &#8377; {subTotal - discountPrice || 0}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Shipping Fee</span>
                        <span className="text-green-500 flex gap-2">
                          <s className="text-gray-400">40</s>Free
                        </span>
                      </div>
                      <div>
                        <span className="text-xs inline-block text-gray-600">
                          * A fee of Rs. 250 is charged only if no purchase is
                          made from Sandook. Otherwise, if you do buy from
                          Sandook, the Rs. 250 is refunded.
                        </span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold">
                          &#8377;{" "}
                          {parseFloat(discountPrice?.toFixed(2)) + 250 || 0}
                        </span>
                      </div>
                      <div className="flex justify-center text-center">
                        {limitError.maxLimitError ||
                        limitError.minLimitError ? (
                          <div className="mt-6 py-2 w-full p-2 font-medium  text-gray-700 bg-gray-400">
                            Check out
                          </div>
                        ) : (
                          <Link
                            href="/sandook/checkout"
                            className="mt-6 py-2 cta w-full p-2 font-medium text-blue-50 "
                          >
                            Check out
                          </Link>
                        )}
                      </div>
                      {limitError.maxLimitError ? (
                        <p className="text-sm text-red-600 mt-4">
                          You can add only {maxLimit} products to order sandook
                        </p>
                      ) : limitError.minLimitError ? (
                        <p className="text-sm text-red-600 mt-4">
                          Please add {minLimit - sandookProductQuantity.current}{" "}
                          more products to order sandook
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySandook;
