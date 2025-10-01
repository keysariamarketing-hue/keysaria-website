"use client";
import { CustomerAuth } from "@/types/customerAuth";
import { createContext, ReactNode, useState } from "react";

export interface AuthContextType {
  customerAuth: CustomerAuth;
  setCustomerAuth: React.Dispatch<React.SetStateAction<CustomerAuth>>;
  nav: boolean;
  setNav: React.Dispatch<React.SetStateAction<boolean>>;
  header: boolean;
  setHeader: React.Dispatch<React.SetStateAction<boolean>>;
  persist: boolean;
  setPersist: React.Dispatch<React.SetStateAction<boolean>>;
}

// Initialize context with undefined or a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [nav, setNav] = useState(false);
  const [header, setHeader] = useState(false);
  const [customerAuth, setCustomerAuth] = useState<CustomerAuth>({
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

  const [persist, setPersist] = useState(true);

  console.log("Customer Auth Result : ", customerAuth);

  return (
    <AuthContext.Provider
      value={{
        customerAuth,
        setCustomerAuth,
        nav,
        setNav,
        header,
        setHeader,
        persist,
        setPersist,
      }}
    >
      <>{children}</>
    </AuthContext.Provider>
  );
};

export default AuthContext;
