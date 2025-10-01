import Image from "next/image";
import Link from "next/link";
import React from "react";
import FooterLogo from "../../../public/footer-logo.png";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { LocateFixed, MailIcon, PhoneCallIcon } from "lucide-react";

const Footer = () => {
  return (
    <>
      <footer className="text-color footers w-full lg:text-left ">
        <div className="footer py-20 lg:px-4 pb-20 w-full md:text-left">
          <div className="grid-1 px-4 grid gap-8 grid-cols-2  md:grid-cols-2 lg:grid-cols-4">
            <div className=" col-span-2 md:col-auto">
              <Image src={FooterLogo} className="lg:w-48 w-48" alt="" />
              <div className="mt-[23px] flex">
                <div className="flex items-center gap-x-2   w-full">
                  <h5 className="font-bold text-black">Follow us on:</h5>
                  <Link
                    target="_blank"
                    href={"https://www.instagram.com/keysarialabels/"}
                  >
                    <FaInstagram color="black" className="text-3xl" />
                  </Link>
                  <Link
                    target="_blank"
                    href={"https://www.facebook.com/keysarialabels"}
                  >
                    <FaFacebook color="black" className="text-3xl" />
                  </Link>
                </div>
              </div>
              <p className="text-justify text-black text-sm mt-4 ">
                Welcome to Keysaria, where designs spin tales of luxury and
                comfort. Our fusion fashion breaks barriers, melding diverse
                styles with rich Indian textiles.
              </p>
            </div>

            <div className="lg:px-10 text-black ">
              <h6 className="mb-4 text-black flex flex-col p-2  underline font-semibold uppercase md:justify-start">
                Shop
              </h6>
              <p className="mb-4 text-sm font-semibold">
                <Link href="/" className="w-full hover:bg-mylight rounded p-2">
                  Home
                </Link>
              </p>
              <p className="mb-4 text-sm font-semibold">
                <Link
                  href="/about"
                  className="w-full hover:bg-mylight rounded p-2"
                >
                  About
                </Link>
              </p>
              <p className="mb-4 text-sm font-semibold">
                <Link
                  href="/contact"
                  className="w-full hover:bg-mylight rounded p-2"
                >
                  Contact Us
                </Link>
              </p>

              <p className="mb-4 text-sm font-semibold">
                <Link
                  href="/new-arrivals"
                  className="w-full hover:bg-mylight rounded p-2"
                >
                  New Arrivals
                </Link>
              </p>
              <p className="mb-4 text-sm font-semibold">
                <Link
                  href="/bestsellers"
                  className="w-full hover:bg-mylight rounded p-2"
                >
                  Best Sellers
                </Link>
              </p>
            </div>

            <div className="font-semibold text-black ">
              <h6 className="mb-4 text-black flex underline font-semibold p-2 uppercase md:justify-start">
                Our Company & Policies
              </h6>
              <p className="mb-4 text-sm">
                <Link
                  href="/shipping-policy"
                  className="w-full hover:bg-mylight rounded p-2"
                >
                  Shipping Policy
                </Link>
              </p>

              <p className="mb-4 text-sm">
                <Link
                  href="/exchange-policy"
                  className="w-full hover:bg-mylight rounded p-2"
                >
                  Return & Exchange
                </Link>
              </p>
              <p className="mb-4 text-sm">
                <Link
                  href="/privacy-policy"
                  className="w-full hover:bg-mylight rounded p-2"
                >
                  Privacy Policy
                </Link>
              </p>
              <p className="mb-4 text-sm">
                <Link
                  href="/terms-condition"
                  className="w-full hover:bg-mylight rounded p-2"
                >
                  Term & Condition
                </Link>
              </p>
              <p className="mb-4 text-sm">
                <Link
                  href="/faq"
                  className="w-full hover:bg-mylight rounded p-2"
                >
                  FAQ
                </Link>
              </p>
            </div>

            <div className="col-span-2 text-black  md:col-auto">
              <h6 className="mb-4 text-black flex underline   font-semibold p-2 uppercase md:justify-start">
                Help
              </h6>
              <div className="mt-[23px]  flex">
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[75%]">
                  <MailIcon className="text-2xl text-color " color="black" />
                </div>
                <div className="ml-[18px]">
                  <p className="font-Inter text-[12px] font-medium">
                    Support Email
                  </p>
                  <Link
                    href="mailto:Keysarialabels@gmail.com"
                    className="font-Inter text-[14px] font-semibold"
                  >
                    keysarialabels@gmail.com
                  </Link>
                </div>
              </div>
              <div className="mt-[23px] flex">
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[75%]">
                  <PhoneCallIcon
                    className="text-2xl text-color"
                    color="black"
                  />
                </div>
                <div className="ml-[18px]">
                  <p className="font-Inter text-[12px] font-medium ">
                    Support Number
                  </p>
                  <Link
                    href="tel:9871870405"
                    className="font-Inter text-[14px] font-semibold "
                  >
                    +91 9220478135
                  </Link>
                </div>
              </div>
              <div className="mt-[23px] flex">
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[75%]">
                  <LocateFixed className="text-3xl text-color" color="black" />
                </div>
                <div className="ml-[18px]">
                  <p className="font-Inter text-[12px] font-medium ">Address</p>
                  <p className="font-Inter text-[14px] font-semibold">
                    Anthurieum IT Park Noida -73 Office no A 436 and 438 , 4th
                    floor Pin Code-201307
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className='p-6 text-center font-semibold bg-myred text-myyellow '> */}
        <div className="p-6 text-center font-semibold bg-black text-myyellow ">
          <span>
            Copyright claim @2024 Keysaria <sup>. </sup>
            <Link href="/privacy/policy" className="">
              Privacy Policy
            </Link>
            <sup> . </sup>
            <Link href="/contact">Support</Link>
          </span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
