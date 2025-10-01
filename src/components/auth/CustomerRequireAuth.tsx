"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hook/useAuth";
import { AuthContextType } from "@/context/AuthProvider";

const CustomerRequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { customerAuth } = useAuth() as AuthContextType;
  const router = useRouter();

  useEffect(() => {
    if (!customerAuth?.accessToken) {
      router.replace("/customer/login");
    }
  }, [customerAuth?.accessToken, router]);

  return customerAuth?.accessToken ? children : null;
};

export default CustomerRequireAuth;
