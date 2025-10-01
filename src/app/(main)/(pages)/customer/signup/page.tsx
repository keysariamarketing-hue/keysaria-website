"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { usePathname } from "next/navigation";
import { FaUser, FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { MdOutlinePassword } from "react-icons/md";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import useAuth from "@/hook/useAuth";
import { customerSignUp } from "@/app/api/customerApi";
import { AuthContextType } from "@/context/AuthProvider";
import { ButtonLoader } from "@/components/loaders/ButtonLoader";

// interface SignUpProps {
//   setPageType: (type: string) => void;
//   setSignIn: (state: boolean) => void;
//   signIn: boolean;
// }

interface SignUpFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

const SignUp = () => {
  const { setCustomerAuth } = useAuth() as AuthContextType;
  const router = useRouter();
  const pathname = usePathname(); // ✅ Correct way to get current route in Next.js
  const privateAxios = useAxiosPrivate();
  const [loader, setLoader] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  // Customer Register API
  const customerRegister: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      setLoader(true);
      const res = await customerSignUp({ privateAxios, data: { ...data } });
      console.log(res);

      if (res.status === 200) {
        toast.success(res.data.message);
        setLoader(false);
        setCustomerAuth(res.data);
        router.push("/");
      }
    } catch (error: unknown) {
      setLoader(false);
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message || "Registration failed",
          {
            position: "top-right",
          }
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full overflow-hidden mt-4 max-w-2xl">
        <div className="md:flex w-full justify-center">
          <div className="w-full px-5 md:px-10">
            <div className="bg-white py-6 rounded-xl">
              <form
                autoComplete="off"
                onSubmit={handleSubmit(customerRegister)}
              >
                <div className="space-y-6">
                  <h1 className="text-center text-2xl font-medium font-oswald tracking-wide text-black">
                    Register Now
                  </h1>
                  <hr />

                  {/* Full Name Input */}
                  <div>
                    <div className="flex items-center input-border py-2 px-3 rounded">
                      <FaUser />
                      <input
                        {...register("fullName", {
                          required: "Please enter Full Name!",
                        })}
                        className="pl-2 outline-none border-none font-base w-full"
                        type="text"
                        placeholder="Full Name"
                      />
                    </div>
                    <p className="text-red-600 text-sm">
                      {errors.fullName?.message}
                    </p>
                  </div>

                  {/* Email Input */}
                  <div>
                    <div className="flex items-center input-border py-2 px-3 rounded">
                      <IoMail />
                      <input
                        {...register("email", {
                          required: "Please enter email!",
                          pattern: {
                            value: /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/,
                            message: "Invalid email format!",
                          },
                        })}
                        className="pl-2 outline-none border-none w-full"
                        type="email"
                        placeholder="Email"
                      />
                    </div>
                    <p className="text-red-600 text-sm">
                      {errors.email?.message}
                    </p>
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <div className="flex items-center input-border py-2 px-3 rounded">
                      <FaPhoneAlt />
                      <input
                        {...register("phone", {
                          required: "Please enter Phone number!",
                        })}
                        className="pl-2 outline-none border-none w-full"
                        type="tel"
                        placeholder="Phone"
                      />
                    </div>
                    <p className="text-red-600 text-sm">
                      {errors.phone?.message}
                    </p>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center input-border py-2 px-3 rounded">
                      <MdOutlinePassword />
                      <input
                        {...register("password", {
                          required: "Please enter a valid password!",
                          pattern: {
                            value:
                              /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
                            message:
                              "Must contain at least 1 number, 1 uppercase & lowercase letter, and 6+ characters",
                          },
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

                {/* Submit Button */}
                <button
                  type="submit"
                  className="mt-6 w-full shadow-xl bg-gradient-to-tr cta text-white py-2 rounded text-lg tracking-wide transition duration-1000"
                >
                  {loader ? <ButtonLoader /> : "Sign Up"}
                </button>
              </form>
              <hr />

              {/* Login Redirect */}
              <div className="flex justify-center items-center mt-4">
                <p className="inline-flex items-center text-color font-medium text-xs text-center">
                  <span className="ml-2">
                    You already have an account?
                    <button
                      onClick={() => {
                        if (pathname === "/customer/signup") {
                          router.push("/customer/login");
                        }
                      }}
                      className="text-xs ml-2 text-blue-500 font-semibold"
                    >
                      Sign In now &rarr;
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

export default SignUp;
