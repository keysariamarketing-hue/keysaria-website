import { customerLogOut } from "@/app/api/customerApi";
import useAuth from "../useAuth";
import { AuthContextType } from "@/context/AuthProvider";
import useAxiosPrivate from "./useAxiosPrivate";

const useLogout = () => {
  const privateAxios = useAxiosPrivate();
  const { setCustomerAuth, setPersist, setHeader } =
    useAuth() as AuthContextType;

  const logout = async () => {
    const allData = { privateAxios };
    setCustomerAuth({
      accessToken: undefined,
      result: {
        CustomerName: "",
        email: "",
        phone: "",
        gender: null,
        CustomerId: "",
        profileImage: null,
      },
    });
    setPersist(false);
    setHeader(false);
    try {
      await customerLogOut(allData);
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
