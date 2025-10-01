"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hook/useAuth";
import useRefreshTooken from "@/hook/customer/useRefresh";
import { toast } from "react-toastify";
import { AuthContextType } from "@/context/AuthProvider";
import { PersistLoader } from "../general/PersistLoader";

const CustomerPersist = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshTooken();
  const router = useRouter();
  const { customerAuth, persist } = useAuth() as AuthContextType;

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
        toast.error("Please sign in to access the page!", {
          position: "top-right",
        });
        router.replace("/customer/login");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (!customerAuth?.accessToken && persist) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{isLoading ? <PersistLoader /> : children}</>;
};

export default CustomerPersist;
