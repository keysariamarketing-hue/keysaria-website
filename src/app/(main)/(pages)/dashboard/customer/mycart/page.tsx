"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "@/hook/useAuth";
import { AuthContextType } from "@/context/AuthProvider";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import { AppDispatch, RootState } from "@/store/store";
import { addWishlistDataThunk } from "@/features/wishlistSlice";
import { fetchCartDataThunk } from "@/features/cartSlice";
import { addToCart, decreaseCartItem, deleteCartItem } from "@/app/api/cartAPI";
import { toast } from "react-toastify";
import Image from "next/image";
import EmptyCart from "../../../../../../../public/miscelleneous/empty-cart.png";
import { CartItemType } from "@/types/cartItemType";
import { totalCartPriceCalculation } from "@/lib/cartPriceCalculator";

const MyCart = () => {
  const { customerAuth } = useAuth() as AuthContextType;
  const id = customerAuth && customerAuth.result?.CustomerId;

  const cartData: CartItemType[] = useSelector(
    (state: RootState) => state.cartItem.allCart as CartItemType[]
  );
  const [checkOutOfStock, setCheckOutOfStock] = useState<boolean>(false);
  const privateAxios = useAxiosPrivate();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [, setCartData] = useState<CartItemType[]>([]);

  useEffect(() => {
    if (cartData?.length > 0) {
      const check = cartData.some((item) => item.productStock?.quantity === 0);
      setCheckOutOfStock(check);
    }
  }, [cartData]);

  const { subTotal, discountPrice } =
    cartData?.length > 0
      ? totalCartPriceCalculation(cartData)
      : { subTotal: 0, discountPrice: 0 };

  const getCart = { customerId: id, privateAxios };

  // Function to increase quantity
  const incrementCart = async (allData: {
    quantity: number;
    customerId?: string;
    productId: string;
    productStockId: string;
  }) => {
    if (id) {
      try {
        const res = await addToCart(privateAxios, allData);
        if (res.status === 200) {
          dispatch(fetchCartDataThunk(getCart));
        }
      } catch (error) {
        console.error("Error incrementing cart:", error);
      }
    } else {
      //If not logged in handle cart data in local storage
      try {
        // get the existing cart data from local storage
        const cartFromStorage =
          JSON.parse(localStorage.getItem("cartData") || "") || [];

        const productIndex = cartFromStorage.findIndex(
          (item: CartItemType) =>
            item.productId === allData.productId &&
            item.productStockId === allData.productStockId
        );
        console.log(productIndex);
        if (productIndex !== -1) {
          //If the product exist increase the quantity by 1
          cartFromStorage[productIndex].quantity += 1;
        }

        setCartData(cartFromStorage);

        // Update the local storage and state
        localStorage.setItem("cartData", JSON.stringify(cartFromStorage));

        // dispatch to update any Redux state
        dispatch(fetchCartDataThunk(getCart));
      } catch (error) {
        console.error("Error increasing quantity:", error);
        toast.error("Couldn't increase the quantity. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  // Function to decrease quantity
  const decrementCart = async (allData: {
    customerId?: string;
    productId: string;
    productStockId: string;
  }) => {
    if (id) {
      try {
        const res = await decreaseCartItem(privateAxios, allData);
        if (res.status === 200) {
          dispatch(fetchCartDataThunk(getCart));
        }
      } catch (error) {
        console.error("Error decrementing cart:", error);
      }
    } else {
      //If not logged in handle cart data in local storage
      try {
        // get the existing cart data from local storage
        const cartFromStorage =
          JSON.parse(localStorage.getItem("cartData") || "") || [];

        const productIndex = cartFromStorage.findIndex(
          (item: CartItemType) =>
            item.productId === allData.productId &&
            item.productStockId === allData.productStockId
        );
        console.log(productIndex);
        if (productIndex !== -1) {
          //Check quantity if it is greater than or equal to 1 to avoid negative quantity
          if (cartFromStorage[productIndex].quantity > 1) {
            //If the product exist decrease the quantity by 1
            cartFromStorage[productIndex].quantity -= 1;
          }
        }

        setCartData(cartFromStorage);

        // Update the local storage and state
        localStorage.setItem("cartData", JSON.stringify(cartFromStorage));

        // dispatch to update any Redux state
        dispatch(fetchCartDataThunk(getCart));
      } catch (error) {
        console.error("Error decreasing quantity:", error);
        toast.error("Couldn't decrease the quantity. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  // Function to delete item from cart
  const deleteCart = async (allData: {
    customerId?: string;
    productId: string;
    productStockId: string;
  }) => {
    if (id) {
      try {
        const res = await deleteCartItem(privateAxios, allData);
        if (res.status === 200) {
          dispatch(fetchCartDataThunk(getCart));
          toast.success("Product removed from cart successfully!");
        }
      } catch (error) {
        console.log(error);
        toast.error("Couldn't remove product from cart. Please try again.");
      }
    } else {
      try {
        const cartFromStorage =
          JSON.parse(localStorage.getItem("cartData") || "") || [];

        const updatedCart = cartFromStorage.filter(
          (item: CartItemType) =>
            !(
              item.productId === allData.productId &&
              item.productStockId === allData.productStockId
            )
        );

        setCartData(cartFromStorage);

        // Update the local storage and state
        localStorage.setItem("cartData", JSON.stringify(updatedCart));

        // dispatch to update any Redux state
        dispatch(fetchCartDataThunk(getCart));

        toast.success("Product removed from cart successfully!", {
          position: "top-right",
        });
      } catch (error) {
        console.error("Error removing item from cart:", error);
        toast.error("Couldn't remove product from cart. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  // Function to add item to wishlist
  const addToWishlist = async (productId: string, productStockId: string) => {
    try {
      await dispatch(
        addWishlistDataThunk({
          customerId: id,
          privateAxios,
          productId,
        })
      );
      deleteCart({
        customerId: id,
        productId,
        productStockId,
      });
      dispatch(fetchCartDataThunk(getCart));
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
    }
  };

  return (
    <div className={`dashboard flex gap-4`}>
      <div className="col flex-[100%]">
        <div className="flex gap-4 py-10 min-h-screen pb-0">
          <div className="col flex-[100%] lg:px-6">
            <div className="nav flex items-center text-color p-2">
              <h4 className="text-2xl text-black">My Cart</h4>
            </div>
            <div className="container mx-auto mt-10">
              <div className={`md:flex shadow-md my-10`}>
                <div className="w-full sm:w-3/4 bg-white lg:px-10 px-4 lg:py-10">
                  <div className="flex justify-between border-b pb-8">
                    <p className="lg:text-2xl">Shopping Cart</p>
                    <p className="lg:text-2xl">
                      {cartData ? cartData.length : 0} Items
                    </p>
                  </div>

                  {cartData && cartData.length > 0 ? (
                    cartData.map((cartItems, index) => (
                      <div
                        key={index}
                        className="md:flex items-strech py-8 md:py-10 lg:py-8 border-t border-gray-50"
                      >
                        <div className="md:w-2/12 2xl:w-1/4 w-full object-center object-cover">
                          <Image
                            src={cartItems.product.productImage[0]}
                            alt={cartItems.product.productTitle}
                            className="h-full w-11/12 object-cover"
                            width={200} // Adjust width based on design
                            height={200} // Adjust height based on design
                          />
                        </div>
                        <div className="md:pl-3 md:w-8/12 flex flex-col justify-center">
                          <div className="flex items-center justify-between w-full">
                            <p
                              onClick={() =>
                                router.push(
                                  `/product/details/${cartItems.product.id}`
                                )
                              }
                              className="hover:cursor-pointer hover:underline decoration-1 font-bold text-black"
                            >
                              {cartItems.product.productTitle}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="pb-2 text-gray-600 text-sm">
                              Price: ₹{" "}
                              <span className="text-md">
                                {cartItems.product.afterDiscountPrice.toFixed(
                                  2
                                )}
                              </span>
                            </p>
                            <p className="pb-2 text-gray-600 text-sm">
                              ₹{" "}
                              <span className="text-md line-through">
                                {cartItems.product.price}
                              </span>
                            </p>
                          </div>
                          {cartItems.productStock?.quantity === 0 ? (
                            <span className="text-red-500">Out of Stock</span>
                          ) : (
                            <div className="w-1/2 px-2 flex items-center gap-2">
                              <button
                                className="w-8 h-8 cta rounded-full text-white"
                                onClick={() =>
                                  decrementCart({
                                    customerId: cartItems.customerId,
                                    productId: cartItems.productId,
                                    productStockId: cartItems.productStockId,
                                  })
                                }
                              >
                                -
                              </button>
                              <span className="font-bold">
                                {cartItems.quantity}
                              </span>
                              <button
                                className="w-8 h-8 cta rounded-full text-white"
                                onClick={() =>
                                  incrementCart({
                                    quantity: 1,
                                    customerId: cartItems.customerId,
                                    productId: cartItems.productId,
                                    productStockId: cartItems.productStockId,
                                  })
                                }
                              >
                                +
                              </button>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-5">
                            <p
                              onClick={() =>
                                addToWishlist(
                                  cartItems.product.id,
                                  cartItems.productStock.id
                                )
                              }
                              className="text-xs underline text-gray-800 cursor-pointer"
                            >
                              Add to WishList
                            </p>
                            <p
                              onClick={() =>
                                deleteCart({
                                  customerId: id,
                                  productId: cartItems.productId,
                                  productStockId: cartItems.productStockId,
                                })
                              }
                              className="text-xs underline text-red-500 cursor-pointer"
                            >
                              Remove
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="md:pb-0 pb-5">
                      <div className="flex items-center justify-center flex-col">
                        <div>
                          <Image
                            className="md:w-[400px] w-[250px]"
                            src={EmptyCart}
                            alt="empty-cart"
                          />
                        </div>
                        <h3 className="font-[400] text-[20px]">
                          Your cart is empty!
                        </h3>
                        <p className="text-center md:text-l text-[14px]">
                          Looks like you have not added anything to your cart.
                          Go ahead & explore top categories..
                        </p>
                        <Link
                          href="/"
                          className="mt-10 bg-black text-white py-3 px-5 rounded-[10px] hover:cursor-pointer"
                        >
                          Continue Shopping
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                {cartData && cartData.length > 0 && (
                  <div className="w-full sm:w-1/4 md:w-1/2 px-8 py-10">
                    <p className="text-2xl border-b pb-8">Order Summary</p>
                    <div className="bg-white rounded-lg lg:shadow-md lg:p-6">
                      <h2 className="text-lg font-semibold mb-4 border-b">
                        Price Details
                      </h2>
                      <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>&#8377; {subTotal?.toFixed(2) || 0}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Discount Price</span>
                        <span className="text-green-500">
                          - &#8377;{" "}
                          {(subTotal - discountPrice)?.toFixed(2) || 0}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Shipping Fee</span>
                        <span className="text-green-500 flex gap-2">
                          <s className="text-gray-400">40</s>Free
                        </span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold">
                          &#8377; {discountPrice?.toFixed(2) || 0}
                        </span>
                      </div>
                      <div className="flex justify-center text-center">
                        <Link
                          href="/product/checkout"
                          className="mt-6 py-2 cta w-full p-2 font-medium text-blue-50"
                        >
                          Check out
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                {checkOutOfStock && (
                  <div>
                    <p className="text-red-500">
                      Selected item is out of stock
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCart;
