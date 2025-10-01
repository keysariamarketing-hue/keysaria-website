"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { resetPasswordAPI } from "@/app/api/customerApi";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";

const ResetNewPassword: React.FC = () => {
  const router = useRouter();
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const privateAxios = useAxiosPrivate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPasswordAPI({
        privateAxios,
        password,
        token: token || "", // Ensure token is always a string
      });

      setSuccess(true);
      setTimeout(() => router.push("/customer/login"), 3000); // Redirect to login page after 3 seconds
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(axiosError.response?.data?.message || "Something went wrong");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex justify-center py-8">
      <div
        className="input-border overflow-hidden rounded-xl mt-4"
        style={{ maxWidth: "1200px" }}
      >
        <div className="md:flex items-center w-full">
          <div className="w-full py-10 px-5 md:px-10">
            <div className="bg-white py-2 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                <h1 className="text-center text-2xl font-meta font-semibold text-color">
                  New Password!
                </h1>
                <hr />

                {/* Error & Success Messages */}
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-green-500 text-sm text-center">
                    Password reset successfully. Redirecting to login...
                  </div>
                )}

                {/* New Password Input */}
                <div className="flex items-center input-border py-2 px-3 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-color"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    className="pl-2 outline-none border-none w-full"
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Confirm Password Input */}
                <div className="flex items-center input-border py-2 px-3 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-color"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    className="pl-2 outline-none border-none w-full"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="mt-12 w-full shadow-xl font-meta font-semibold bg-gradient-to-tr cta text-white py-2 rounded-md text-sm tracking-wide transition duration-1000"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetNewPassword;
