"use client";
import { AuthContextType } from "@/context/AuthProvider";
import useRefreshTooken from "./useRefresh";
import { useEffect } from "react";
import { axiosPrivate } from "@/app/api/axios";
import useAuth from "../useAuth";

const useAxiosPrivate = () => {
  const refresh = useRefreshTooken();
  const { customerAuth } = useAuth() as AuthContextType;

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers[
            "Authorization"
          ] = `Bearer ${customerAuth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    // console.log("requestIntercept =>",requestIntercept);
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );
    // console.log("responseIntercept==>",responseIntercept)

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [customerAuth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
