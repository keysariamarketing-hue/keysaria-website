"use client";

import Image from "next/image";
import { CheckCircle, Clipboard, Lock, MapPin, Ruler } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Product } from "@/types/productType";
import { Coupon } from "@/types/couponType";
import SizeChart from "../../../public/miscelleneous/size_chart.webp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { ButtonLoader } from "../loaders/ButtonLoader";
import { toast } from "react-toastify";

interface Props {
  productData: Product;
  selectedColor: string | null;
  selectedSize: string;
  productQuantity: number;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  setSelectedColor: React.Dispatch<React.SetStateAction<string | null>>;
  // setProductStockId: React.Dispatch<React.SetStateAction<number | null>>;
  selectSize: (size: string) => void;
  pincode: string;
  loader: boolean;
  sandookDelivarable: boolean;
  sandookAvail: boolean;
  handleAddToSandook: () => void;
  sandookLoader: boolean;
  checkForAvailibility: () => void;
  loaderPin: boolean;
  setPincode: (pincode: string) => void;
  coupons: Coupon[];
}

const ProductDetailsContainer: React.FC<Props> = ({
  productData,
  selectedColor,
  // selectedSize,
  productQuantity,
  handleAddToCart,
  handleBuyNow,
  increaseQuantity,
  decreaseQuantity,
  // setSelectedColor,
  // setProductStockId,
  // selectSize,
  pincode,
  loader,
  sandookDelivarable,
  sandookAvail,
  handleAddToSandook,
  sandookLoader,
  checkForAvailibility,
  loaderPin,
  setPincode,
  coupons,
}) => {
  return (
    <div className="md:flex-1 md:px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between -mb-4">
        <h2 className="text-2xl my-1 font-medium font-oswald">
          {productData?.productTitle}
        </h2>
      </div>

      {/* Line Break */}
      <hr />

      {/* Price tag */}
      <div className="flex mb-4">
        <div className="mr-4">
          <span className="text-gray-600 dark:text-gray-300 font-oswal">
            <span className="text-3xl text-black font-normal font-oswal">
              ₹{productData.afterDiscountPrice?.toFixed(0)}
            </span>
            <span className="ml-2 line-through text-md text-black font-oswal font-extralight">
              ₹{productData?.price}
            </span>
          </span>
          <p className="text-gray-600 dark:text-gray-300 font-oswal text-sm px-1">
            (Price Inclusive of all taxes.)
          </p>
        </div>
      </div>

      {/* Stock Indicator */}
      {productData?.type !== "Stitched" ? (
        <div className="flex flex-row items-center gap-4 ml-2">
          {/* Radar Indicator */}
          <div className="relative flex items-center justify-center">
            {/* Pulsating Circle */}
            <div
              className={`absolute w-4 h-4 rounded-full ${
                productData.ProductStock[0].quantity <= 10
                  ? "bg-red-400 animate-pulse"
                  : "bg-green-400 animate-pulse"
              } opacity-50`}
            ></div>
            <div
              className={`absolute w-6 h-6 rounded-full ${
                productData.ProductStock[0].quantity <= 10
                  ? "bg-red-400 animate-pulse"
                  : "bg-green-400 animate-pulse"
              } opacity-25`}
            ></div>
            {/* Center Dot */}
            <div
              className={`relative w-2 h-2 rounded-full ${
                productData.ProductStock[0].quantity <= 10
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            ></div>
          </div>

          <span className="text-lg font-normal">
            {productData.ProductStock[0].quantity <= 10
              ? `Low Stock, only ${productData.ProductStock[0].quantity} left`
              : "In stock, ready to ship"}
          </span>
        </div>
      ) : (
        // Stock indicator for stitched product
        <div className="flex flex-row items-center gap-4 ml-2">
          {/* Radar Indicator */}
          <div className="relative flex items-center justify-center">
            {/* Pulsating Circle */}
            <div
              className={`absolute w-4 h-4 rounded-full ${
                productData.ProductStock[0].quantity <= 10
                  ? "bg-red-400 animate-pulse"
                  : "bg-green-400 animate-pulse"
              } opacity-50`}
            ></div>
            <div
              className={`absolute w-6 h-6 rounded-full ${
                productData.ProductStock[0].quantity <= 10
                  ? "bg-red-400 animate-pulse"
                  : "bg-green-400 animate-pulse"
              } opacity-25`}
            ></div>
            {/* Center Dot */}
            <div
              className={`relative w-2 h-2 rounded-full ${
                productData.ProductStock[0].quantity <= 10
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            ></div>
          </div>

          <span className="text-lg font-normal">
            {productData.ProductStock[0].quantity <= 10
              ? `Low Stock, only ${productData.ProductStock[0].quantity} left`
              : "In stock, ready to ship"}
          </span>
        </div>
      )}

      {/* Description Section */}
      <div className="space-y-2 text-sm text-gray-800">
        <p>
          <strong>Style:</strong> {productData && productData.styleCode}
        </p>
        <p>
          <strong>Size:</strong> {productData && productData.size}
        </p>
        <p>
          <strong>Theme:</strong> {productData && productData.theme}
        </p>
        <p>
          <strong>Comment:</strong> {productData && productData.comment}
        </p>
        <p>
          <strong>Wash Care:</strong> {productData && productData.washcare}
        </p>
        {productData && productData.type === "Unstitched" && (
          <>
            <p>
              <strong>Top:</strong> {productData && productData.top}
            </p>
            <p>
              <strong>Bottom:</strong> {productData && productData.bottom}
            </p>
            <p>
              <strong>Dupatta:</strong> {productData && productData.dupatta}
            </p>
          </>
        )}
        {productData && productData.type === "Saree" && (
          <>
            <p>
              <strong>Length:</strong> {productData && productData.length}
            </p>
            <p>
              <strong>Blouse:</strong> {productData && productData.blouse}
            </p>
          </>
        )}
        <p>
          <strong>Description:</strong> {productData && productData.description}
        </p>
      </div>

      {/* Size Chart */}
      {productData?.type === "Unstitched" && (
        <div className="mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 text-sm font-semibold text-black hover:text-gray-600 transition">
                SIZE CHART
                <Ruler className="w-4 h-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <Image
                src={SizeChart}
                alt="Size Chart"
                className="w-full h-auto"
              />
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Quantity */}
      <div className="w-full md:w-1/2 flex items-center mt-8 gap-2">
        <label htmlFor="" className="font-medium">
          Quantity :
        </label>
        <button
          onClick={() => {
            if (
              productData?.type !== "Stitched" ||
              (productData?.type === "Stitched" && selectedColor !== null)
            ) {
              decreaseQuantity();
            }
          }}
          className="w-8 h-8 cta rounded-full text-white text-md"
        >
          -
        </button>
        <span className="font-medium">{productQuantity}</span>
        <button
          onClick={() => {
            if (
              productData?.type !== "Stitched" ||
              (productData?.type === "Stitched" && selectedColor !== null)
            ) {
              increaseQuantity();
            }
          }}
          className="w-8 h-8 cta rounded-full text-white"
        >
          +
        </button>
      </div>

      {/* Buttons */}
      <div className="flex -mx-2 mb-8">
        <div className="w-1/2 px-2">
          <button
            onClick={handleAddToCart}
            className="w-full border-[1px] border-black font-meta text-black hover:bg-blue-gray-100 py-3 px-4 font-bold"
          >
            {loader ? "Loading..." : "Add to Cart"}
          </button>
        </div>
        <div className="w-1/2 px-2">
          <button
            onClick={handleBuyNow}
            className="w-full py-3 px-4 font-meta bg-black font-semibold hover:bg-black/70 text-white"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Sandook Availability */}
      <div className="flex -mx-2 mb-4">
        <div className="w-full px-2 space-y-3">
          <div className="flex items-center border-[1px] border-[#543310] py-2 px-3">
            <MapPin />
            <input
              onChange={(e) => setPincode(e.target.value)}
              value={pincode}
              className="pl-2 outline-none border-none w-full"
              type="number"
              name="pinCode"
              placeholder="Pincode"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  checkForAvailibility();
                }
              }}
            />
            <button
              onClick={checkForAvailibility}
              className="cta px-4 py-2 text-white"
            >
              {loaderPin ? "Checking..." : "Check"}
            </button>
          </div>
        </div>
      </div>

      {/* Sandook Availability */}
      <div className="flex mb-8">
        <div className="w-full">
          {sandookDelivarable ? (
            <button
              onClick={() => handleAddToSandook()}
              className="w-full border border-black hover:bg-gray-400 font-meta py-3 px-4 font-bold"
            >
              {sandookLoader ? (
                <ButtonLoader textColor="color" />
              ) : (
                "Add to Sandook"
              )}
            </button>
          ) : sandookAvail ? (
            <button
              // onClick={handleFocus}
              className="w-full border-[1px] text-gray-700 font-meta bg-gray-400 py-3 px-4 font-bold"
            >
              Check For Sandook Availability
            </button>
          ) : (
            <button className="w-full border-[1px] text-gray-700 font-meta bg-gray-400 py-3 px-4 font-bold">
              {pincode.length !== 6
                ? "Check For Sandook Availability"
                : "Sandook Coming Soon"}
            </button>
          )}
        </div>
      </div>

      {/* Keysaria Benefits */}
      <div className="flex flex-col gap-3 mt-4">
        {/* Offer Section */}
        <div className="flex items-center gap-2">
          <CheckCircle className="text-black" />
          <span className="text-lg font-light">
            Get 5% OFF on Pre-Paid Orders
          </span>
        </div>

        {/* Payment Protection Section */}
        <div className="flex items-center gap-2">
          <Lock className="text-black" />
          <span className="text-lg font-light">100% Payment Protection</span>
        </div>
      </div>

      {/* coupons */}
      <div className="w-full max-w-xl">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-black tracking-wide">
            AVAILABLE COUPONS
          </span>
          <div className="border border-gray-300 rounded-md bg-white">
            <div
              className={`p-3 flex flex-col gap-y-[1px] border-b border-gray-300`}
            >
              <p className="font-medium text-black">Prepaid Discount</p>
              <p className="text-xs text-gray-700">
                Get 5% off on prepaid orders; Auto applied during checkout.
              </p>
            </div>
            {coupons.map(
              (coupon, index) =>
                index != 0 && (
                  <div
                    key={index}
                    className={`p-3 flex flex-col gap-y-[1px] ${
                      index !== coupons.length - 1
                        ? "border-b border-gray-300"
                        : ""
                    }`}
                  >
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:text-blue-500"
                      onClick={() => {
                        navigator.clipboard.writeText(coupon.couponCode);
                        toast.info("Coupon code copied!");
                      }}
                    >
                      <Clipboard className="w-4 h-4 text-gray-500" />
                      <p className="font-medium text-black">
                        {coupon.couponCode}
                      </p>
                    </div>
                    <p className="text-xs text-gray-700">
                      {coupon.couponTitle}
                    </p>
                  </div>
                )
            )}
          </div>
        </div>
        <div className="mt-0">
          <span className="text-xs inline-block text-gray-600">
            * Apply coupon during checkout, 1 coupon applied at a time
          </span>
        </div>
      </div>

      {/* Company Details */}
      <div className="flex flex-col gap-3 mt-4">
        {/* description */}
        <Accordion type="single" collapsible className="border border-gray-300">
          {/* Accordion Item */}
          <AccordionItem value="vendorDetails">
            {/* Trigger */}
            <AccordionTrigger className="flex justify-between items-center w-full p-4 cursor-pointer text-lg font-normal text-black focus:outline-none transition-colors group-data-[state=open]:bg-gray-100 font-meta">
              Description
            </AccordionTrigger>
            {/* Content */}
            <AccordionContent className="px-4 pb-4 pt-0 text-sm leading-relaxed">
              <div className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-2">
                  <span className="font-normal text-lg">Fabric Disclaimer</span>
                  <ul className="list-disc pl-4">
                    <li>
                      At <strong>Keysaria</strong>, we pride ourselves on using
                      premium, hand-sourced fabrics for all our collections.
                    </li>
                    <li>
                      Please note that product images are for representation
                      purposes and aim to closely resemble the actual product.
                      However, slight variations in color may occur due to
                      differences in lighting, cameras, or display screens.
                    </li>
                    <li>
                      Minimal differences in color between the visible product
                      and the actual fabric are possible and should be
                      considered part of the uniqueness of handcrafted items.
                    </li>
                    <li>
                      Our hand block prints may exhibit slight irregularities in
                      motifs and colors, which are a hallmark of authentic
                      craftsmanship. These variations stem from the human
                      involvement in the process, making every piece
                      one-of-a-kind.
                    </li>
                    <li>
                      As these fabrics are dyed using natural dyes, there may be
                      some dry rub-off or color bleeding when exposed to water
                      for the first time. This is a natural characteristic of
                      such fabrics.
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-y-2">
                  <span className="font-normal text-lg">Washing Care</span>
                  <ul className="list-disc pl-4">
                    <li>
                      Hand wash gently using a mild detergent. Avoid soaking the
                      garment or washing it alongside other clothing.
                    </li>
                    <li>
                      Dry the garment inside-out in a shaded area to preserve
                      its color and quality. While dry cleaning is ideal, hand
                      washing is also acceptable if done carefully.
                    </li>
                    <li>
                      To extend the life of your Keysaria garments, avoid using
                      washing machines or dryers.
                    </li>
                    <li>
                      Cotton fabrics may experience moderate shrinkage; handle
                      them with care.
                    </li>
                    <li>
                      Be cautious when applying fragrances to your handmade
                      garments, as some chemicals may cause staining or print
                      removal. Spray fragrances lightly in the air and walk
                      through the mist for safe application.
                    </li>
                    <li>
                      Certain fabrics, such as ikats and block-printed textiles,
                      are prone to color bleeding. In such cases, professional
                      dry cleaning is strongly recommended.
                    </li>
                    <li>
                      For other cases, hand wash gently and separately to
                      maintain the vibrancy of the fabric.
                    </li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {/* vendor details */}
        <Accordion type="single" collapsible className="border border-gray-300">
          {/* Accordion Item */}
          <AccordionItem value="vendorDetails">
            {/* Trigger */}
            <AccordionTrigger className="flex justify-between items-center w-full p-4 cursor-pointer text-lg font-normal text-black focus:outline-none transition-colors group-data-[state=open]:bg-gray-100 font-meta">
              Vendor Details
            </AccordionTrigger>

            {/* Content */}
            <AccordionContent className="px-4 pb-4 pt-0 text-sm leading-relaxed">
              <p>
                <span className="font-medium">Manufactured by:</span> Shiv
                Fabrication
              </p>
              <p>
                <span className="font-medium">Address:</span> Anthurieum IT Park
                Noida -73 Office no A 436 and 438 , 4th floor Pin Code-201307
              </p>
              <p>
                <span className="font-medium">Country of Origin:</span> India
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ProductDetailsContainer;
