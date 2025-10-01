"use client";

import { getSandookOrderBySandookId } from "@/app/api/sandookApis/sandookAPI";
import CustomerPersist from "@/components/auth/CustomerPersist";
import CustomerRequireAuth from "@/components/auth/CustomerRequireAuth";
import DataLoader from "@/components/loaders/DataLoader";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import { SandokOrder } from "@/types/sandookType";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const SandookOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const privateAxios = useAxiosPrivate();

  const [data, setData] = useState<SandokOrder | null>(null);
  const [dataLoader, setDataLoader] = useState(false);
  //   const [cancelDialog, setCancelDialog] = useState(false);

  const getSandookById = async () => {
    setDataLoader(true);
    const allData = { privateAxios, id };
    try {
      const res = await getSandookOrderBySandookId(allData);
      setDataLoader(false);
      setData(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  //   const cancelSandookOrder = async () => {
  //     const allData = { privateAxios, orderId: id };
  //     try {
  //       const res = await cancelSandookOrderByCustomer(allData);
  //       if (res.status == 200) {
  //         setCancelDialog(false);
  //         getSandookById();
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  useEffect(() => {
    getSandookById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={`dashboard flex gap-4 pb-20`}>
        <div className="col flex-[100%]">
          <div className="flex gap-4 py-10 min-h-screen pb-0">
            <div className="col flex-[100%] lg:px-6 px-2">
              <div className="nav flex items-center text-color p-2">
                <h4 className="text-2xl">My Sandook Detail</h4>
              </div>
              {dataLoader ? (
                <DataLoader />
              ) : (
                data && (
                  <>
                    <div className="mt-4 card-background rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.2)] lg:flex gap-20">
                      <div className="flex w-full gap-2 p-4">
                        <div className="space-y-2 w-full px-4 flex justify-between items-center">
                          <div>
                            <h4 className="">Delivery Expected Date</h4>
                            <div className="flex gap-1 space-y-3">
                              Date:
                              <p className="font-bold uppercase text-color">
                                {data.timeSlotDate
                                  .split("T")[0]
                                  .split("-")
                                  .reverse()
                                  .join("/")}
                              </p>
                            </div>
                          </div>

                          {/* Order Actions */}
                          {/* <div>
                            {!data.isCompleted ? (
                              data.orderCancelRequest ? (
                                <h5 className="text-red-600 font-medium">
                                  Order Cancel Requested
                                </h5>
                              ) : (
                                <button
                                  onClick={() => setCancelDialog(true)}
                                  className="rounded-full text-white px-4 py-1 cta"
                                >
                                  Cancel
                                </button>
                              )
                            ) : data.status === "DELIVERED" ? (
                              <h5 className="text-green-600 font-medium">
                                Delivered
                              </h5>
                            ) : data.status === "CANCELLED" ? (
                              <h5 className="text-red-600 font-medium">
                                Cancelled
                              </h5>
                            ) : null}
                          </div> */}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 card-background rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.2)] lg:flex gap-20">
                      <div className="flex gap-2 p-4">
                        <div className="space-y-2 px-4">
                          <h4 className="">Delivery Address</h4>
                          <div className="space-y-3">
                            <p className="font-bold uppercase text-color">
                              {data.billingAdresses.fullName}
                            </p>
                            <p className="text-sm">
                              {data.billingAdresses.houseNo}{" "}
                              {data.billingAdresses.address},{<br />}
                              {data.billingAdresses.street},{" "}
                              {data.billingAdresses.city},{<br />}
                              {data.billingAdresses.state}
                              {<br />}
                              {data.billingAdresses.pincode}
                            </p>
                            <div className="">
                              <h4 className="">Phone Number</h4>
                              <p className="text-sm">
                                {data.billingAdresses.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )
              )}
              <div className="grid pb-20">
                {data?.sandok &&
                  data.sandok.sandokProduct.map((item, index) => (
                    <div
                      key={index}
                      className="mt-4 card-background lg:flex justify-between gap-4 rounded-lg hover:shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                    >
                      <div className="flex gap-2  p-4 lg:w-96">
                        <Image
                          src={item.product.thumbnail}
                          className="w-[100px] h-[120px] object-cover"
                          alt=""
                          width={100}
                          height={120}
                        />
                        <div className="space-y-2">
                          <h6 className="text-lg hover:underline decoration-1">
                            <Link href={`/product/details/${item.product.id}`}>
                              {item.product.productTitle}
                            </Link>
                          </h6>
                          <div className="flex gap-4">
                            <p className="text-sm">
                              Price: &#8377;
                              {item.product.afterDiscountPrice}
                            </p>
                            <p className="text-sm">Quantity: {item.quantity}</p>
                            <p className="text-sm">
                              Total Price:{" "}
                              {item.quantity * item.product.afterDiscountPrice}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex"></div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const MySandookOrderDetail = () => {
  return (
    <CustomerPersist>
      <CustomerRequireAuth>
        <SandookOrderDetail />
      </CustomerRequireAuth>
    </CustomerPersist>
  );
};

export default MySandookOrderDetail;
