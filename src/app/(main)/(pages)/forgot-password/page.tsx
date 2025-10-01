"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { AtSign } from "lucide-react";
import { forgotPasswordAPI } from "@/app/api/customerApi";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const privateAxios = useAxiosPrivate();

  const forgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPasswordAPI({ privateAxios, email });

      if (res.status === 200) {
        toast.success("Reset link has been sent to your email!");
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error("Error Occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-8">
      <div className="overflow-hidden pb-8 mt-4" style={{ maxWidth: "800px" }}>
        <form onSubmit={forgotPassword}>
          <div className="md:flex input-border rounded-xl shadow-md items-center max-w-xl">
            <div className="w-full py-10 px-5 md:px-10">
              <div className="bg-white py-2 rounded-xl">
                <div className="space-y-4">
                  <h1 className="text-center text-2xl font-semibold font-meta text-color">
                    Forgot Password!
                  </h1>
                  <hr />

                  <h1 className="text-sm text-center pt-10 text-gray-700">
                    Enter your Registered Email!
                  </h1>
                  <div className="flex items-center input-border py-2 px-3 rounded-md mb-8">
                    <AtSign />
                    <input
                      className="pl-2 outline-none font-medium border-none w-full"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}"
                      title="Please enter a valid email address."
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  id="reset"
                  className="mt-12 w-full shadow-xl font-meta font-semibold bg-gradient-to-tr cta text-white py-2 rounded-md tracking-wide transition duration-1000"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
