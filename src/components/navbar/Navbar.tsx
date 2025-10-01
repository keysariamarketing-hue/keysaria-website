"use client";
import { AuthContextType } from "@/context/AuthProvider";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import useAuth from "@/hook/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import useRefreshTooken from "@/hook/customer/useRefresh";
import useLogout from "@/hook/customer/useLogout";
import { FaBars } from "react-icons/fa6";
import Image from "next/image";
import compressedTreasureChest from "../../../public/miscelleneous/animationCompressed.gif";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Logo from "../../../public/footer-logo.png";
import {
  CurationOfKeysaria,
  Saree,
  StitchedCollection,
  UnstitchedSuits,
} from "@/lib/navitem";
import { Heart, ShoppingCart, User } from "lucide-react";
import NavCustomer from "./NavCustomer";
import { fetchCartDataThunk } from "@/features/cartSlice";
import MobileDrawer from "./MobileDrawer";
import { fetchWishlistDataThunk } from "@/features/wishlistSlice";
import { fetchSandookDataThunk } from "@/features/sandookSlice";
import InstaImg from "../../../public/insta.png";

type Props = {
  handleOrderPopup: () => void;
};

const Navbar = ({ handleOrderPopup }: Props) => {
  const { customerAuth, persist } = useAuth() as AuthContextType;
  const privateAxios = useAxiosPrivate();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const allCart = useSelector((state: RootState) => state.cartItem.allCart);
  const allWishlist = useSelector(
    (state: RootState) => state.wishlistItem.allWishlist
  );
  const allSandook = useSelector(
    (state: RootState) => state.sandookItem.allSandook
  );

  const id = customerAuth.result && customerAuth.result.CustomerId;

  // const getCart: { customerId: string; privateAxios: AxiosInstance } = {
  //   customerId: id || "", // Ensure it is always a string
  //   privateAxios,
  // };

  // const getWishlist: { customerId: string; privateAxios: AxiosInstance } = {
  //   customerId: id || "", // Ensure it is always a string
  //   privateAxios,
  // };
  // const getSandook = { customerId: id, privateAxios };

  // const [showAnimation, setShowAnimation] = useState(false);
  // const [gifKey, setGifKey] = useState(0);

  const getCart = useMemo(
    () => ({
      customerId: id || "",
      privateAxios,
    }),
    [id, privateAxios]
  );

  const getWishlist = useMemo(
    () => ({
      customerId: id || "",
      privateAxios,
    }),
    [id, privateAxios]
  );

  const getSandook = useMemo(
    () => ({
      customerId: id || "",
      privateAxios,
    }),
    [id, privateAxios]
  );

  useEffect(() => {
    dispatch(fetchCartDataThunk(getCart));
    dispatch(fetchWishlistDataThunk(getWishlist));
    dispatch(fetchSandookDataThunk(getSandook));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCart, getWishlist, dispatch]);

  // const openAnimation = () => {
  //   setGifKey(gifKey + 1);
  //   setShowAnimation(true);
  // };

  // const navigateToSandook = () => {
  //   setShowAnimation(false);
  //   router.push("/dashboard/customer/mySandook");
  // };

  const [open, setOpen] = useState<boolean>(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  // Logout Logic
  const logout = useLogout();
  const logoutCustomer = async () => {
    await logout();
    window.location.reload();
  };

  // ======================= ACCESS TOKEN LOGIC ===========================
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const refresh = useRefreshTooken();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (!customerAuth?.accessToken && persist) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="sticky top-0 z-50 w-full">
        <div className="shadow-md bg-black duration-200 relative z-40">
          {/* upper Navbar */}
          <div className="lg:py-2 py-2 px-2">
            <div className="flex justify-between items-center lg:px-8 gap-2 lg:gap-10 px-2 ">
              {/* logo */}
              <div className={`flex items-center gap-2 justify-center`}>
                <Link href="/" className="">
                  <Image src={Logo} alt="Logo" className="max-w-24 h-16" />
                </Link>
              </div>

              {/* links */}
              <div className=" flex justify-start gap-5 font-body">
                <ul className="lg:flex hidden items-center font-meta font-medium lg:gap-6 gap-2 w-full text-white">
                  <li>
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className="font-normal text-lg p-0 hover:text-gray-400">
                            Unstitched Suits
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className={"py-2 px-3"}>
                            {UnstitchedSuits &&
                              UnstitchedSuits.map((item, index) => (
                                <Link
                                  key={index}
                                  href={`/collection/${item.name}/${item.id}`}
                                >
                                  <NavigationMenuLink className="text-black flex w-[200px] cursor-pointer px-2 py-1">
                                    {item.name}
                                  </NavigationMenuLink>
                                </Link>
                              ))}
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </li>
                  <li>
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className="font-normal text-lg hover:bg-transparent p-0 hover:text-gray-400">
                            Saree
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className={"py-2 px-3"}>
                            {Saree &&
                              Saree.map((item, index) => (
                                <Link
                                  key={index}
                                  href={`/collection/${item.name}/${item.id}`}
                                >
                                  <NavigationMenuLink
                                    className="text-black flex w-[200px] cursor-pointer px-2 py-1"
                                    key={index}
                                  >
                                    {item.name}
                                  </NavigationMenuLink>
                                </Link>
                              ))}
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </li>
                  <li>
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className="font-normal text-lg hover:bg-transparent p-0 hover:text-gray-400">
                            Stitched
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className={"py-2 px-3"}>
                            {StitchedCollection &&
                              StitchedCollection.map((item, index) => (
                                <Link key={index} href={`/coming-soon`}>
                                  <NavigationMenuLink
                                    className="text-black flex w-[200px] cursor-pointer px-2 py-1"
                                    key={index}
                                  >
                                    {item.name}
                                  </NavigationMenuLink>
                                </Link>
                              ))}
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </li>
                  <li>
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className="font-normal text-lg hover:bg-transparent p-0 hover:text-gray-400">
                            Curation of Keysaria
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className={"py-2 px-3"}>
                            {CurationOfKeysaria &&
                              CurationOfKeysaria.map((item, index) => (
                                <Link key={index} href={item.link}>
                                  <NavigationMenuLink className="text-black flex w-[200px] cursor-pointer px-2 py-1">
                                    {item.name}
                                  </NavigationMenuLink>
                                </Link>
                              ))}
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </li>
                  <li>
                    <Link
                      href="/bestsellers"
                      className="text-lg flex gap-2 font-normal hover:text-gray-400 duration-200 text-white"
                    >
                      <span>Best Sellers</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/reviews"
                      className="text-lg flex gap-2 font-normal hover:text-gray-400 duration-200 text-white"
                    >
                      <span>Reviews</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* icons */}
              <div className="flex border-0 border-red justify-end items-center lg:gap-4 gap-8">
                {/* sandook icon */}
                <div className="hidden lg:flex mr-2">
                  <button
                    // onClick={openAnimation}
                    onClick={() => {
                      router.push("/dashboard/customer/mySandook");
                    }}
                    role="button"
                    className="relative hidden lg:flex items-center justify-center gap-2"
                  >
                    <Image
                      src={compressedTreasureChest}
                      className="w-8 h-8 drop-shadow-sm cursor-pointer"
                      alt={""}
                    />
                    <span className="absolute text-center -top-2 -right-3 nav-strip rounded-full h-5 w-5 top right p-1 m-0 text-black font-medium font-mono text-xs leading-none">
                      {allSandook && allSandook.length > 0
                        ? allSandook.length
                        : 0}
                    </span>
                  </button>
                </div>

                {/* profile | search | wishlist | cart */}
                <div
                  onClick={() => handleOrderPopup()}
                  className="transition-all duration-200 h-full rounded-full flex items-center lg:gap-5 gap-4"
                >
                  {/* Profile */}
                  <li className="list-none md:block hidden relative cursor-pointer transition-all duration-200 group">
                    <div className="flex hover:text-gray-400 duration-200 items-center gap-[2px]">
                      <User className="text-2xl drop-shadow-sm cursor-pointer text-white" />
                    </div>
                    <div className="absolute -left-28 z-[9999] hidden group-hover:block w-max rounded-md px-4 py-4 transition-all duration-700 bg-white text-black shadow-md">
                      {customerAuth.accessToken === undefined ? (
                        <div className="flex flex-col items-start">
                          <h3 className="uppercase font-bold tracking-wider">
                            My Account
                          </h3>
                          <p className="text-xs mt-2 uppercase">
                            LogIn to Access your Account
                          </p>
                          <ul className="mt-4">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <button
                                  onClick={() => {
                                    router.push("/customer/login");
                                  }}
                                  className="border-[2px] border-black py-[6px] px-4 rounded text-black "
                                >
                                  Sign In
                                </button>
                              </div>
                              <div>
                                <button
                                  onClick={() => {
                                    router.push("/customer/signup");
                                  }}
                                  className="bg-black rounded text-white py-2 px-4"
                                >
                                  Sign Up
                                </button>
                              </div>
                            </div>
                          </ul>
                        </div>
                      ) : (
                        <NavCustomer />
                      )}
                    </div>
                  </li>

                  {/* Wishlist */}
                  <li className="hidden lg:inline-block lg:mt-0 align-middle text-white hover:text-gray-400">
                    <Link
                      href="/dashboard/customer/mywishlist"
                      role="button"
                      className="relative flex"
                    >
                      <Heart className="text-2xl drop-shadow-sm cursor-pointer text-white" />
                      <span className="absolute text-center -top-2 -right-3 nav-strip rounded-full h-5 w-5 top right p-1 m-0 text-black font-medium font-mono text-xs leading-none">
                        {(allWishlist && allWishlist.length) || 0}
                      </span>
                    </Link>
                  </li>

                  {/* insta cart */}
                  <li className="block lg:inline-block lg:mt-0 align-middle text-white hover:text-gray-400">
                    <Link
                      href="https://www.instagram.com/keysarialabels/"
                      role="button"
                      className="relative flex"
                      target="_blank"
                    >
                      <Image
                        src={InstaImg}
                        className="w-10 h-1-0 md:min-w-12 md:h-12 drop-shadow-sm cursor-pointer"
                        alt={"keysaria-sandook"}
                      />{" "}
                    </Link>
                  </li>

                  {/* cart */}
                  <li className="block lg:inline-block lg:mt-0 align-middle text-white hover:text-gray-400">
                    <Link
                      href="/dashboard/customer/mycart"
                      role="button"
                      className="relative flex"
                    >
                      <ShoppingCart className="text-2xl drop-shadow-sm cursor-pointer text-white" />
                      <span className="absolute text-center -top-2 -right-3 nav-strip rounded-full h-5 w-5 top right p-1 m-0 text-black font-medium font-mono text-xs leading-none">
                        {(allCart && allCart.length) || 0}
                      </span>
                    </Link>
                  </li>

                  {/* sandook */}
                  <li
                    // onClick={openAnimation}
                    onClick={() => {
                      router.push("/dashboard/customer/mySandook");
                    }}
                    role="button"
                    className="relative block lg:hidden items-center justify-center gap-2"
                  >
                    <Image
                      src={compressedTreasureChest}
                      className="w-10 h-10 md:min-w-12 md:h-12 drop-shadow-sm cursor-pointer"
                      alt={"keysaria-sandook"}
                    />
                    <span className="absolute text-center nav-strip rounded-full h-5 w-5 top-0 right-0 p-1 m-0 text-black font-medium font-mono text-xs leading-none">
                      {allSandook && allSandook.length > 0
                        ? allSandook.length
                        : 0}
                    </span>
                  </li>

                  {/* mobile view sidebar btn */}
                  <li className="flex items-center lg:hidden">
                    <button onClick={openDrawer} className="">
                      <FaBars className="text-2xl text-white" />
                    </button>
                  </li>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileDrawer
        open={open}
        closeDrawer={closeDrawer}
        customerAuth={customerAuth}
        logoutCustomer={logoutCustomer}
        tokenLoader={isLoading}
      />
    </>
  );
};

export default Navbar;
