"use client"
import { AuthContextType } from "@/context/AuthProvider";
import useLogout from "@/hook/customer/useLogout";
import useAuth from "@/hook/useAuth";
import {
  CircleUserRound,
  Heart,
  LogOut,
  Package,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

const NavCustomer = () => {
  const { customerAuth } = useAuth() as AuthContextType;

  const logout = useLogout();
  const logoutCustomer = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <>
      <ul className="flex flex-col font-meta z-50 pr-6">
        <Link href="/dashboard/customer/profile" className=" ">
          <li className="items-center flex gap-4 border-b pb-4 px-2">
            <div>
              <CircleUserRound size={35} />
            </div>
            <div className="flex flex-col">
              <h5 className="text-base  font-semibold">
                Hi, {customerAuth && customerAuth.result.CustomerName}
              </h5>
              <h5 className="text-[12px] text-myred">Edit Your Profile</h5>
            </div>
          </li>
        </Link>
        <Link href="/dashboard/customer/myorder" className="nav-hover p-2">
          <li className="items-center flex gap-5 px-1">
            <span>
              <Package className="text-3xl" />
            </span>
            <h5>My Order</h5>
          </li>
        </Link>
        <Link href="/dashboard/customer/mycart" className="nav-hover p-2">
          <li className="items-center flex gap-5 px-1">
            <span>
              <ShoppingCart className="text-3xl" />
            </span>
            <h5>My Cart</h5>
          </li>
        </Link>
        <Link href="/dashboard/customer/mywishlist" className="nav-hover p-2">
          <li className="items-center flex gap-5 px-1">
            <span>
              <Heart className="text-3xl" />
            </span>
            <h5>Wishlist</h5>
          </li>
        </Link>

        <Link onClick={logoutCustomer} href="/" className="nav-hover p-2">
          <li className="items-center flex gap-5 px-1">
            <span>
              <LogOut className="text-3xl" />
            </span>
            <h5 className="rounded-lg ">Logout</h5>
          </li>
        </Link>
      </ul>
    </>
  );
};

export default NavCustomer;
