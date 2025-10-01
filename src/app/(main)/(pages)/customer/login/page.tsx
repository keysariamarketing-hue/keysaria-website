"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { IoMail } from "react-icons/io5";
import { MdOutlinePassword } from "react-icons/md";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import useAuth from "@/hook/useAuth";
import { AuthContextType } from "@/context/AuthProvider";
import { customerLogIn } from "@/app/api/customerApi";
import { AxiosError } from "axios";
import { ButtonLoader } from "@/components/loaders/ButtonLoader";

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn = () => {
  const router = useRouter();
  const { setCustomerAuth } = useAuth() as AuthContextType;
  const privateAxios = useAxiosPrivate();
  const [loader, setLoader] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const customerSignIn: SubmitHandler<SignInFormData> = async (data) => {
    try {
      setLoader(true);
      const res = await customerLogIn({ privateAxios, data });
      setLoader(false);
      setCustomerAuth(res.data);
      toast.success("Login successful!", { position: "top-right" });
      router.push("/");
    } catch (error: unknown) {
      // Type the error as `unknown`
      console.error("Login error", error);

      if (error instanceof AxiosError && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed");
      }

      setLoader(false);
    }
  };

  return (
    <div className="flex pb-10 justify-center">
      <div className="w-full overflow-hidden justify-center mt-4">
        <div className="md:flex w-full justify-center">
          <div className="w-full md:max-w-2xl py-10 px-5 md:px-10">
            <div className="bg-white py-2 rounded-xl">
              <form onSubmit={handleSubmit(customerSignIn)}>
                <div className="space-y-8">
                  <h1 className="text-center text-2xl font-medium font-oswald tracking-wide text-black">
                    Welcome Back to Login!
                  </h1>
                  <hr />
                  {/* Email Input */}
                  <div>
                    <div className="flex items-center input-border py-2 px-3 rounded-sm">
                      <IoMail />
                      <input
                        {...register("email", {
                          required: "Please enter email!",
                          pattern: {
                            value: /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/,
                            message: "Invalid email format!",
                          },
                        })}
                        autoComplete="off"
                        className="pl-2 outline-none border-none w-full"
                        type="email"
                        placeholder="Email"
                      />
                    </div>
                    <p className="text-red-600 text-sm">
                      {errors.email?.message}
                    </p>
                  </div>
                  {/* Password Input */}
                  <div>
                    <div className="flex items-center input-border py-2 px-3 rounded">
                      <MdOutlinePassword />
                      <input
                        {...register("password", {
                          required: "Please enter password!",
                        })}
                        className="pl-2 outline-none border-none w-full"
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Password"
                      />
                      {isPasswordVisible ? (
                        <Eye onClick={() => setIsPasswordVisible(false)} />
                      ) : (
                        <EyeOff onClick={() => setIsPasswordVisible(true)} />
                      )}
                    </div>
                    <p className="text-red-600 text-sm">
                      {errors.password?.message}
                    </p>
                  </div>
                </div>
                {/* Forgot Password */}
                <div className="flex justify-end items-center mt-8">
                  <p className="inline-flex items-center text-color font-medium text-xs text-center">
                    <span
                      onClick={() => router.push("/forgot-password")}
                      className="text-xs ml-2 text-blue-500 font-semibold cursor-pointer"
                    >
                      Forgot Password &rarr;
                    </span>
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="mt-6 w-full shadow-xl bg-gradient-to-tr cta text-white py-2 rounded text-lg tracking-wide transition duration-1000"
                >
                  {loader ? <ButtonLoader /> : "Sign In"}
                </button>
                <hr />
              </form>
              {/* Signup Navigation */}
              <div className="flex justify-center items-center mt-4">
                <p className="inline-flex items-center text-color font-medium text-xs text-center">
                  <span>
                    You don&apos;t have an account?
                    <button
                      onClick={() => {
                        if (pathname === "/customer/login") {
                          router.push("/customer/signup");
                        }
                      }}
                      className="text-xs ml-2 text-blue-500 font-semibold"
                    >
                      Sign Up now &rarr;
                    </button>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
