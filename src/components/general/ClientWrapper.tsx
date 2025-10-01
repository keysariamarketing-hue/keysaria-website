"use client";
import { AuthContextType } from "@/context/AuthProvider";
import useAuth from "@/hook/useAuth";
import { useEffect, useState } from "react";
import ScrollToTop from "./ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCircleArrowUp } from "react-icons/fa6";
import WhatsappIcon from "../../../public/whatsapp.png";
import Image from "next/image";
import PreHeader from "./PreHeader";
import Footer from "./Footer";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import Navbar from "../navbar/Navbar";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchCartDataThunk } from "@/features/cartSlice";
import { fetchWishlistDataThunk } from "@/features/wishlistSlice";
import { fetchSandookDataThunk } from "@/features/sandookSlice";

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const [orderPopup, setOrderPopup] = useState(false);
  const { header, customerAuth } = useAuth() as AuthContextType;

  const privateAxios = useAxiosPrivate();
  const id = customerAuth.result?.CustomerId;

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  const dispatch = useDispatch<AppDispatch>();

  const getCart = { customerId: id, privateAxios };
  const getWishlist = { customerId: id, privateAxios };
  const getSandook = { customerId: id, privateAxios };

  useEffect(() => {
    dispatch(fetchCartDataThunk(getCart));
    dispatch(fetchWishlistDataThunk(getWishlist));
    dispatch(fetchSandookDataThunk(getSandook));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  return (
    <>
      <ScrollToTop />
      {!header ? (
        <>
          <PreHeader />
          <Navbar handleOrderPopup={handleOrderPopup} />
        </>
      ) : null}

      {/* Main Content */}
      <main>{children}</main>

      {!header ? (
        <>
          <Footer />
          <div
            style={{
              position: "fixed",
              right: "10px",
              bottom: "80px",
              textAlign: "right",
              zIndex: "999",
              width: "45px",
              height: "45px",
              borderRadius: "100%",
            }}
            className="whatsapp flex justify-center items-center"
          >
            <a
              target="_blank"
              href="https://wa.me/919220478135"
              rel="noreferrer"
              className=""
            >
              <Image
                src={WhatsappIcon}
                className="text-3xl text-color"
                alt="whatsapp-keysaria"
              />
            </a>
          </div>
          <div
            style={{
              position: "fixed",
              right: "10px",
              bottom: "20px",
              textAlign: "right",
              zIndex: "999",
              width: "50px",
              height: "50px",
              borderRadius: "100%",
              background: "#ececec",
            }}
            className="whatsapp flex justify-center items-center"
          >
            <button onClick={() => window.scrollTo(0, 0)} className="">
              <FaCircleArrowUp className="text-3xl text-color" />
            </button>
          </div>
        </>
      ) : null}
      <ToastContainer />
    </>
  );
};

export default ClientWrapper;
