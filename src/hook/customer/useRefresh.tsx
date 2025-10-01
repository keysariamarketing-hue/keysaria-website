import { AuthContextType } from "@/context/AuthProvider";
import useAuth from "../useAuth";
import { customerRefereshAPI } from "@/app/api/customerApi";

const useRefreshTooken = () => {
  const { setCustomerAuth } = useAuth() as AuthContextType;

  // call refresh token api
  const refresh = async () => {
    const res = await customerRefereshAPI();
    console.log("response of auth refresh token", res);

    setCustomerAuth((prev) => {
      return {
        ...prev,
        accessToken: res.data.accessToken,
        result: res.data.result,
      };
    });
    return res.data.accessToken;
  };

  return refresh;
};

export default useRefreshTooken;
