"use client";
import { AuthContextType } from "@/context/AuthProvider";
import { fetchSandookDataThunk } from "@/features/sandookSlice";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import useAuth from "@/hook/useAuth";
import { AppDispatch } from "@/store/store";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const SandookOrderSuccess = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customerAuth } = useAuth() as AuthContextType;
  const privateAxios = useAxiosPrivate();
  const customerId = customerAuth && customerAuth.result.CustomerId;
  useEffect(() => {
    dispatch(fetchSandookDataThunk({ customerId, privateAxios }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customerId]);

  return (
    <div className="w-full lg:py-28 py-10 flex justify-center items-center">
      <div className="md:w-2/4 rounded-lg h-auto p-10 lg:shadow-[0_0px_20px_1px_rgba(0,0,0,0.3)] text-center  space-y-6">
        <div className="flex justify-center">
          <svg
            fill="green"
            xmlns="http://www.w3.org/2000/svg"
            width="60px"
            height="60px"
            viewBox="0 0 52 52"
            enableBackground="new 0 0 52 52"
            xmlSpace="preserve"
          >
            <path
              d="M26,2C12.7,2,2,12.7,2,26s10.7,24,24,24s24-10.7,24-24S39.3,2,26,2z M39.4,20L24.1,35.5
	c-0.6,0.6-1.6,0.6-2.2,0L13.5,27c-0.6-0.6-0.6-1.6,0-2.2l2.2-2.2c0.6-0.6,1.6-0.6,2.2,0l4.4,4.5c0.4,0.4,1.1,0.4,1.5,0L35,15.5
	c0.6-0.6,1.6-0.6,2.2,0l2.2,2.2C40.1,18.3,40.1,19.3,39.4,20z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h3 className="text-green-500">Sandook Ordered Successfully</h3>
          <p>Thank you for shopping with us</p>
          <p>We will deliver your order as soon as possible</p>
          <p className="font-bold py-4">Thank you!</p>
          <Link href={"/"} className="underline font-normal text-gray-600">
            Continue Shopping...
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SandookOrderSuccess;
