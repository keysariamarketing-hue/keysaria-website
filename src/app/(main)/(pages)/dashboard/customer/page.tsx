"use client";

import Link from "next/link";
import { FiPackage } from "react-icons/fi";
import { FaCartShopping, FaRegHeart } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { ReactNode } from "react";
import CustomerPersist from "@/components/auth/CustomerPersist";
import CustomerRequireAuth from "@/components/auth/CustomerRequireAuth";

// ✅ Define TypeScript Interface for Card Data
interface DashboardCardType {
  title: string;
  totalLogin: string;
  icon: ReactNode;
  link: string;
  background: string;
}

const CustomerDashboardContent = () => {
  const statisticsCardsData: DashboardCardType[] = [
    {
      title: "My Profile",
      totalLogin: "0",
      icon: <ImProfile className="text-4xl" />,
      link: "/dashboard/customer/profile",
      background: "#9F3E29",
    },
    {
      title: "My Cart",
      totalLogin: "0",
      icon: <FaCartShopping className="text-4xl" />,
      link: "/dashboard/customer/mycart",
      background: "#AC7B2A",
    },
    {
      title: "My Order",
      totalLogin: "0",
      icon: <FiPackage className="text-4xl" />,
      link: "/dashboard/customer/myorder",
      background: "#414B93",
    },
    {
      title: "Wishlist",
      totalLogin: "0",
      icon: <FaRegHeart className="text-4xl" />,
      link: "/dashboard/customer/mywishlist",
      background: "#744781",
    },
  ];

  return (
    <div>
      <div className="dashboard w-full h-full my-8 md:my-52 flex gap-4">
        {/* Main Right Side */}
        <div className="col flex-[100%] md:px-28 px-6">
          <div className="mt-4">
            <div className="grid py-4 gap-6 md:gap-10 md:grid-cols-2 xl:grid-cols-4">
              {statisticsCardsData.map((val, index) => (
                <Link href={val.link} key={index}>
                  <div
                    style={{ backgroundColor: val.background }}
                    className="flex hover:shadow-xl text-white transition-all duration-200 items-center p-4 border border-gray-500 rounded-lg shadow-xs cursor-pointer"
                  >
                    <div className="p-3 mr-4 text-textColor bg-cta rounded-full">
                      {val.icon}
                    </div>
                    <div>
                      <p className="mb-2 text-md font-bold">{val.title}</p>
                      {/* <p className="text-md ">{val.totalLogin}</p> */}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerDashboard = () => {
  return (
    <CustomerPersist>
      <CustomerRequireAuth>
        <CustomerDashboardContent />
      </CustomerRequireAuth>
    </CustomerPersist>
  );
};

export default CustomerDashboard;
