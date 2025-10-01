"use client";
import { getAllOrdersV2 } from "@/app/api/newOrderAPI";
import { getSandookOrderByCustomerId } from "@/app/api/sandookApis/sandookAPI";
import CustomerPersist from "@/components/auth/CustomerPersist";
import CustomerRequireAuth from "@/components/auth/CustomerRequireAuth";
import DataLoader from "@/components/loaders/DataLoader";
import { Input } from "@/components/ui/input";
import { AuthContextType } from "@/context/AuthProvider";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import useAuth from "@/hook/useAuth";
import useFilteration from "@/hook/useFilteration";
import { NewOrder } from "@/types/order";
import { SandokOrder } from "@/types/sandookType";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdPayments } from "react-icons/md";
import sandookImg from "../../../../../../../public/miscelleneous/sandookImg.jpg";
import { OrderStatus } from "@/types/enums";

const OrderPage = () => {
  const [totalPage, setTotalPage] = useState<number>(1);
  const [dataLoader, setDataLoader] = useState<boolean>(false);

  const [allOrders, setAllOrders] = useState<NewOrder[]>([]);
  const [page, setPage] = useState<number>(0);
  const [sandookOrderSuccess, setSandookOrderSuccess] = useState<SandokOrder[]>(
    []
  );

  const privateAxios = useAxiosPrivate();
  const { customerAuth } = useAuth() as AuthContextType;
  const id = customerAuth && customerAuth.result.CustomerId;

  const {
    currentPage,
    nextPage,
    previousPage,
    handleFilterChange,
    filters,
    clearFilters,
    debounce,
  } = useFilteration();

  //get my order................
  const getMyOrders = async () => {
    setDataLoader(true);
    const allData = {
      privateAxios,
      id,
      page: currentPage,
      search: debounce,
      status: filters.orderStatus,
    };
    try {
      const res = await getAllOrdersV2(allData);
      console.log(res);

      setDataLoader(false);
      if (res.status === 200) {
        setTotalPage(res.data.totalPage);
        setAllOrders(res.data.orderDetails);
      }
    } catch (error) {
      setDataLoader(false);
      console.log(error);
    }
  };

  const getSandookOrdersByCustomerId = async () => {
    const allData = { privateAxios, customerId: id };
    try {
      const res = await getSandookOrderByCustomerId(allData);
      setSandookOrderSuccess(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSandookOrdersByCustomerId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debounce, filters.orderStatus]);

  return (
    <div className={`dashboard flex gap-4 pb-20`}>
      {/* <CustomerSidebar /> */}

      <div className="w-full lg:flex lg:px-4">
        {/* FIlter */}
        <div className="group h-max lg:block hidden mt-8 p-4 border-r border-blue-gray-500 w-[25%]">
          <div className=" w-full">
            <h3 className="text-color text-2xl font-medium ">Filter</h3>
            <div className="space-y-3">
              <div>
                <p className="font-normal text-base">Order Status</p>
              </div>
              <div className="space-y-3">
                <span className="flex items-center">
                  <input
                    type="radio"
                    name="orderStatus"
                    id="way"
                    value={"INPROCESS"}
                    onChange={(e) =>
                      handleFilterChange(e.target.name, e.target.value)
                    } // ✅ Fix applied here
                    className="h-4 w-5"
                  />
                  <label htmlFor="way" className="ml-2 text-sm">
                    On the way
                  </label>
                </span>

                <span className="flex items-center">
                  <input
                    type="radio"
                    name="orderStatus"
                    id="order_confirmed"
                    value={"ORDER_CONFIRM"}
                    onChange={(e) =>
                      handleFilterChange(e.target.name, e.target.value)
                    } // ✅ Fix applied here
                    className="h-4 w-5"
                  />
                  <label htmlFor="order_confirmed" className="ml-2 text-sm">
                    Order Confirmed
                  </label>
                </span>

                <span className="flex items-center">
                  <input
                    type="radio"
                    name="orderStatus"
                    id="shipped"
                    value={"SHIPPED"}
                    onChange={(e) =>
                      handleFilterChange(e.target.name, e.target.value)
                    } // ✅ Fix applied here
                    className="h-4 w-5"
                  />
                  <label htmlFor="shipped" className="ml-2 text-sm">
                    Shipped
                  </label>
                </span>

                <span className="flex items-center">
                  <input
                    type="radio"
                    name="orderStatus"
                    id="out_for_delivery"
                    value={"OUT_FOR_DELIVERY"}
                    onChange={(e) =>
                      handleFilterChange(e.target.name, e.target.value)
                    } // ✅ Fix applied here
                    className="h-4 w-5"
                  />
                  <label htmlFor="out_for_delivery" className="ml-2 text-sm">
                    Out for delivery
                  </label>
                </span>

                <span className="flex items-center">
                  <input
                    type="radio"
                    name="orderStatus"
                    value={"DELIVERED"}
                    onChange={(e) =>
                      handleFilterChange(e.target.name, e.target.value)
                    } // ✅ Fix applied here
                    id="delivered"
                    className="h-4 w-5"
                  />
                  <label htmlFor="delivered" className="ml-2 text-sm">
                    Delivered
                  </label>
                </span>

                <span className="flex items-center">
                  <input
                    type="radio"
                    name="orderStatus"
                    value={"EXCHANGE_REQUESTED"}
                    onChange={(e) =>
                      handleFilterChange(e.target.name, e.target.value)
                    } // ✅ Fix applied here
                    id="exchangeRequested"
                    className="h-4 w-5"
                  />
                  <label htmlFor="exchangeRequested" className="ml-2 text-sm">
                    Exchange Requested
                  </label>
                </span>
                <span className="flex items-center">
                  <input
                    type="radio"
                    name="orderStatus"
                    value={"EXCHANGED"}
                    onChange={(e) =>
                      handleFilterChange(e.target.name, e.target.value)
                    } // ✅ Fix applied here
                    id="exchanged"
                    className="h-4 w-5"
                  />
                  <label htmlFor="exchanged" className="ml-2 text-sm">
                    Exchanged
                  </label>
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                clearFilters();
              }}
              className="cta py-2 rounded-md mt-4 w-full text-white"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Right side start here........................................................................... */}
        <div className="flex gap-4 py-10 min-h-screen w-full pb-0">
          <div className="col flex-[100%] lg:px-6">
            {/* Tabs */}
            <div className="lg:flex items-center justify-center md:justify-between w-full  text-color p-2">
              <div className="flex justify-center md:justify-between gap-5 font-oswald mb-4">
                <button
                  onClick={() => setPage(0)}
                  className={`text-xl h decoration-1 p-1 rounded px-2 ${
                    page === 0 && " bg-blue-gray-50 "
                  } `}
                >
                  My Order
                </button>
                <button
                  onClick={() => setPage(1)}
                  className={`text-xl  decoration-1 p-1 rounded px-2 ${
                    page === 1 && "  bg-blue-gray-50 "
                  } `}
                >
                  Sandook Orders
                </button>
              </div>
              <Input
                type="text"
                className="rounded-md lg:w-96 w-[96%] mx-auto outline-none font-normal input-border p-2"
                placeholder="Search Product Name"
                id="search"
                name="search"
                value={filters.search}
                onChange={(e) =>
                  handleFilterChange(e.target.name, e.target.value)
                } // ✅ Fix applied here
              />
            </div>

            <div className="grid pb-5 px-4">
              {dataLoader ? (
                <DataLoader />
              ) : page === 0 ? (
                allOrders && allOrders.length > 0 ? (
                  allOrders.map((item, index) => {
                    return (
                      <>
                        <Link
                          key={index}
                          href={`/dashboard/customer/myorder/detail/${item.id}`}
                          className="mt-4 rounded border w-full justify-between cursor-pointer lg:flex flex-col"
                        >
                          <div className="flex flex-col gap-2 w-full">
                            {item.orderItems.map((orderedProduct, idx) => {
                              return (
                                <div
                                  key={idx}
                                  className="flex w-full gap-2 p-4"
                                >
                                  <Image
                                    src={orderedProduct.product.thumbnail}
                                    className="w-32 h-44 object-cover rounded-lg"
                                    alt=""
                                    width={128}
                                    height={176}
                                  />
                                  <div className="space-y-2 w-full pl-2 ">
                                    <h2 className="text-xs text-gray-500">
                                      {new Date(
                                        item.orderOn
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </h2>
                                    <h6 className="text-base md:text-xl group-hover:underline font-medium font-oswald decoration-1">
                                      {orderedProduct.product.productTitle}
                                    </h6>
                                    <div className="gap-4">
                                      <p className="text-base text-black font-oswald">
                                        <span className=" text-base font-medium">
                                          ₹
                                          {orderedProduct.productQuantity *
                                            orderedProduct.product
                                              .afterDiscountPrice}
                                        </span>
                                      </p>
                                      <p className="text-myred font-semibold font-oswald mt-1">
                                        Quantity :{" "}
                                        {orderedProduct.productQuantity}
                                      </p>
                                    </div>
                                    <div>
                                      <h1
                                        className={`text-xs flex gap-x-1 items-center ${
                                          item.paymentStatus === "PENDING"
                                            ? "text-yellow-500"
                                            : item.paymentStatus === "DONE"
                                            ? "text-green-500"
                                            : item.paymentStatus === "FAILED"
                                            ? "text-red-500"
                                            : ""
                                        }`}
                                      >
                                        <MdPayments size={18} />
                                        Payment Status: {item.paymentStatus}
                                      </h1>
                                    </div>
                                    <div className="flex md:hidden gap-2 items-center font-rubik font-semibold text-xs ">
                                      {item.orderStatus ===
                                      OrderStatus.CANCELLED ? (
                                        <>
                                          <div className="h-2 w-2 bg-red-800 rounded-full"></div>{" "}
                                        </>
                                      ) : item.orderStatus ===
                                        OrderStatus.INPROCESS ? (
                                        <>
                                          <div className="h-2 w-2 bg-yellow-800 rounded-full"></div>{" "}
                                        </>
                                      ) : (
                                        <>
                                          <div className="h-2 w-2 bg-green-800 rounded-full"></div>{" "}
                                        </>
                                      )}
                                      <p>{item.orderStatus}</p>
                                    </div>
                                  </div>
                                  <div className="hidden md:block">
                                    <div className="flex border p-2 rounded border-gray-400 gap-2 items-center font-rubik font-semibold text-xs ">
                                      {item.orderStatus ===
                                      OrderStatus.CANCELLED ? (
                                        <>
                                          <div className="h-2 w-2 bg-red-800 rounded-full"></div>{" "}
                                        </>
                                      ) : item.orderStatus ===
                                        OrderStatus.INPROCESS ? (
                                        <>
                                          <div className="h-2 w-2 bg-yellow-800  rounded-full"></div>{" "}
                                        </>
                                      ) : (
                                        <>
                                          <div className="h-2 w-2 bg-green-800 animate-pulse  rounded-full"></div>{" "}
                                        </>
                                      )}
                                      <p>{item.orderStatus}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Order Summary */}
                          <div className="flex flex-col gap-2 w-full p-4">
                            {/* Subtotal */}
                            <div className="flex justify-between">
                              <span className="text-sm font-semibold text-gray-700">
                                Subtotal:
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                ₹{item.subTotal}
                              </span>
                            </div>

                            {/* Coupon Applied (Show only if a coupon is used) */}

                            <div className="flex justify-between text-green-600">
                              <span className="text-sm font-semibold">
                                Coupon Applied:
                              </span>
                              {item.couponApplied ? (
                                <span className="text-sm font-medium">
                                  {item.couponApplied.couponCode}
                                </span>
                              ) : (
                                <span className="text-sm font-medium">NA</span>
                              )}
                            </div>

                            {item.couponId && (
                              <div className="flex justify-between text-green-600">
                                <span className="text-sm font-semibold">
                                  Coupon Discount:
                                </span>
                                {item.couponId ? (
                                  <span className="text-sm font-medium">
                                    - ₹{item.subTotal - item.finalTotal}
                                  </span>
                                ) : (
                                  <span className="text-sm font-medium">
                                    NA
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Final Total */}
                            {
                              // item.couponId &&
                              <div className="flex justify-between border-t pt-2 mt-2">
                                <span className="text-base font-semibold text-gray-800">
                                  Final Total:
                                </span>
                                <span className="text-lg font-bold text-gray-900">
                                  ₹{item.finalTotal}
                                </span>
                              </div>
                            }
                          </div>
                        </Link>
                      </>
                    );
                  })
                ) : (
                  <>
                    <h4>No orders</h4>
                    <Link href={"/"} className="underline text-color">
                      Order Something
                    </Link>
                  </>
                )
              ) : sandookOrderSuccess && sandookOrderSuccess.length > 0 ? (
                sandookOrderSuccess.map((item, index) => {
                  return (
                    <Link
                      key={index}
                      className="hover:scale-[1.02] hover:shadow-lg transition-all"
                      href={`/dashboard/customer/mySandook/detail/${item.id}`}
                    >
                      <div className="justify-between mt-4 card-background overflow-hidden rounded-lg  lg:flex gap-20">
                        <div className="flex gap-2">
                          <Image
                            src={sandookImg}
                            className="lg:w-[130px] lg:h-[160px] w-[60px] h-[70px] object-cover"
                            alt=""
                            width={130}
                            height={160}
                          />
                          <div className="p-6 space-y-2">
                            <h6 className="text-xl font-medium">
                              Sandook {index + 1}
                            </h6>
                            <div className="flex gap-4">
                              <p className="text-sm font-normal ">
                                Ordered on:{" "}
                                {item.orderOn
                                  .split("T")[0]
                                  .split("-")
                                  .reverse()
                                  .join("-")}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex lg:mr-10 items-center">
                          {item.isCompleted ? (
                            <>
                              <div className="h-2 w-2 bg-green-800 rounded-full"></div>{" "}
                            </>
                          ) : (
                            <>
                              <div className="h-2 w-2 bg-yellow-800 rounded-full"></div>{" "}
                            </>
                          )}
                          <p>{item.status}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                  <Image
                    src={"/buy.png"}
                    alt=""
                    className="w-48 h-48 mx-auto"
                    width={192}
                    height={192}
                  />
                  <h4 className="text-center">No orders</h4>
                  <Link
                    href={"/"}
                    className=" text-center bg-myred font-erstoria text-sm  rounded p-2 px-3 w-fit  text-white"
                  >
                    Order Something
                  </Link>
                </div>
              )}
            </div>

            {/* pagintion */}
            <nav
              className="px-5 mt-6 flex justify-end"
              aria-label="Page navigation example"
            >
              <ul className="inline-flex -space-x-px text-base h-10">
                <li>
                  <button
                    onClick={previousPage}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center px-2 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Previous
                  </button>
                </li>
                <li className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  {currentPage}
                </li>
                <li className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  OF
                </li>
                <li className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  {" "}
                  {totalPage}
                </li>

                <li>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPage}
                    className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyOrder = () => {
  return (
    <CustomerPersist>
      <CustomerRequireAuth>
        <OrderPage />
      </CustomerRequireAuth>
    </CustomerPersist>
  );
};

export default MyOrder;
