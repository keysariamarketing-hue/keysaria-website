"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { getCustomerById, updateCustomerProfile } from "@/app/api/customerApi";
import useAuth from "@/hook/useAuth";
import { ButtonLoader } from "@/components/loaders/ButtonLoader";
import { Calendar, CloudUpload, Mail, MapPin, Phone, User } from "lucide-react";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import Image from "next/image";
import { AuthContextType } from "@/context/AuthProvider";
import CustomerPersist from "@/components/auth/CustomerPersist";
import CustomerRequireAuth from "@/components/auth/CustomerRequireAuth";

const defaultProfileImg = "/default_profile_img.png";

// ✅ Define Type for Customer Data
interface CustomerData {
  fullName: string;
  address: string;
  email: string;
  phone: string;
  profileImage: string; // Stored as URL in DB
  dob: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const CustomerProfileContent = () => {
  const [loader, setLoader] = useState(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: "",
    address: "",
    email: "",
    phone: "",
    profileImage: "", // Initially empty string (URL will be fetched)
    dob: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { customerAuth } = useAuth() as AuthContextType;
  const privateAxios = useAxiosPrivate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ✅ Fetch customer details
  const getCustomerDetails = async () => {
    if (!id) return;
    try {
      const res = await getCustomerById({ privateAxios, id });

      setCustomerData({
        fullName: res?.data?.fullName || "",
        address: res?.data?.address || "",
        email: res?.data?.email || "",
        phone: res?.data?.phone || "",
        profileImage: res?.data?.profileImage || "", // ✅ URL from DB
        dob: res?.data?.dob || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSelectedFile(null); // Reset selected file when fetching new data
    } catch (error) {
      console.error("Error fetching customer details:", error);
      toast.error("Failed to fetch customer details");
    }
  };

  // ✅ Handle input changes with Type Safety
  const handleChange = (key: keyof CustomerData, value: string) => {
    setCustomerData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // ✅ Handle profile image change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file); // ✅ Store the selected file
      setCustomerData((prevData) => ({
        ...prevData,
        profileImage: URL.createObjectURL(file), // ✅ Show preview of new image
      }));
    }
  };

  // ✅ Update customer profile
  const updateProfile = async () => {
    if (!id) return;

    setLoader(true);
    try {
      const formData = new FormData();
      formData.append("fullName", customerData.fullName);
      formData.append("address", customerData.address);
      formData.append("email", customerData.email);
      formData.append("phone", customerData.phone);
      formData.append("dob", customerData.dob);

      // ✅ If a new file is selected, append it
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const res = await updateCustomerProfile({
        privateAxios,
        id,
        ...formData,
      });

      setLoader(false);
      if (res.status === 201 || res.status === 200) {
        getCustomerDetails();
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      setLoader(false);
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  useEffect(() => {
    if (customerAuth?.result?.CustomerId) {
      setId(customerAuth.result.CustomerId);
    }
  }, [customerAuth]);

  useEffect(() => {
    if (id) getCustomerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="dashboard flex justify-center items-start min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl bg-white mt-6 shadow-lg rounded-lg p-6 space-y-8">
        <h2 className="text-2xl font-bold text-center">My Profile</h2>

        {/* Section 1: Personal Information */}
        <div className="space-y-6 border-b pb-6">
          <h3 className="text-xl font-semibold">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: "Name",
                key: "fullName",
                type: "text",
                icon: <User />,
              },
              {
                label: "Email",
                key: "email",
                type: "email",
                icon: <Mail />,
              },
              {
                label: "Phone",
                key: "phone",
                type: "tel",
                icon: <Phone />,
              },
              {
                label: "DOB",
                key: "dob",
                type: "text",
                icon: <Calendar />,
              },
              {
                label: "Address",
                key: "address",
                type: "textarea",
                icon: <MapPin />,
              },
            ].map(({ label, key, type, icon }) => (
              <div key={key} className="flex items-center space-x-2">
                {icon}
                {type === "textarea" ? (
                  <textarea
                    className="flex-grow border rounded-lg p-2"
                    value={customerData[key as keyof CustomerData]}
                    onChange={(e) =>
                      handleChange(key as keyof CustomerData, e.target.value)
                    }
                    placeholder={label}
                  />
                ) : (
                  <input
                    type={type}
                    className="flex-grow border rounded-lg p-2"
                    value={customerData[key as keyof CustomerData]}
                    onChange={(e) =>
                      handleChange(key as keyof CustomerData, e.target.value)
                    }
                    placeholder={label}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Change Profile Picture */}
        <div className="space-y-6 text-center">
          <h3 className="text-xl font-semibold">Change Profile Picture</h3>
          <Image
            src={
              selectedFile
                ? URL.createObjectURL(selectedFile) // ✅ Show new image preview
                : customerData.profileImage || defaultProfileImg
            }
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto object-cover"
            width={128}
            height={128}
            priority
          />
          <label className="flex justify-center items-center space-x-2 cursor-pointer bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg p-4">
            <CloudUpload />
            <span className="text-sm font-medium text-gray-600">
              Upload New Picture
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Save Changes Button */}
        <button
          onClick={updateProfile}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold"
        >
          {loader ? <ButtonLoader /> : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

const CustomerProfile = () => {
  return (
    <CustomerPersist>
      <CustomerRequireAuth>
        <CustomerProfileContent />
      </CustomerRequireAuth>
    </CustomerPersist>
  );
};

export default CustomerProfile;
