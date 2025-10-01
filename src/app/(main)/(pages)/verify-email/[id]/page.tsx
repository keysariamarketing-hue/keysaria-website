"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Link from "next/link";

const VerifyEmail = () => {
  const privateAxios = useAxiosPrivate();
  // const id = searchParams.get("id"); // ✅ Get ID from URL params
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  const verifyEmail = async () => {
    if (!id) {
      toast.error("Invalid verification link.");
      setLoading(false);
      return;
    }

    try {
      const res = await privateAxios.patch(`/customerAuth/verifyEmail/${id}`);
      if (res.status === 200) {
        setIsVerified(true);
        toast.success("Email verified successfully!");
      }
    } catch (error: unknown) {
      console.error("Login error", error);

      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      verifyEmail();
    }

    console.log(id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="bg-gray-50 py-52 flex items-center justify-center">
      <div className="text-center">
        {loading ? (
          <h1 className="text-4xl font-semibold text-gray-700">Verifying...</h1>
        ) : isVerified ? (
          <>
            <h1 className="text-6xl font-bold text-color mb-4">
              Email Verified
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Your email has been successfully verified.
            </p>
            <Link
              href="/customer/login"
              className="cta text-white px-6 py-3 rounded-full transition-colors"
            >
              Back to Login
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-6xl font-bold text-red-600 mb-4">
              Verification Failed
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Something went wrong. Please try again or contact support.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
