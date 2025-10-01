"use client";
import { deleteFromWishlist } from "@/app/api/wishlistAPI";
import CustomerPersist from "@/components/auth/CustomerPersist";
import CustomerRequireAuth from "@/components/auth/CustomerRequireAuth";
import { AuthContextType } from "@/context/AuthProvider";
import { fetchWishlistDataThunk } from "@/features/wishlistSlice";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import useAuth from "@/hook/useAuth";
import { AppDispatch, RootState } from "@/store/store";
import { Wishlist } from "@/types/wishlistType";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const WishlistContent = () => {
  const { customerAuth } = useAuth() as AuthContextType;
  const customerId = customerAuth && customerAuth.result.CustomerId;
  const privateAxios = useAxiosPrivate();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const allWishlist: Wishlist[] = useSelector(
    (state: RootState) => state.wishlistItem.allWishlist
  );
  const getWishlist = { privateAxios, customerId };

  const removeFromWishlist = async (productId: string) => {
    const allData = { privateAxios, productId, customerId };
    try {
      const res = await deleteFromWishlist(allData);
      if (res.status === 200) {
        dispatch(fetchWishlistDataThunk(getWishlist));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(fetchWishlistDataThunk(getWishlist));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  return (
    <div className={`dashboard flex gap-4 justify-center`}>
      <div className="col flex-[100%] max-w-4xl">
        <div className="flex gap-4 py-10 min-h-screen pb-0">
          <div className="col flex-[100%] px-6">
            <div className="nav flex items-center text-color p-2">
              <h4 className="text-2xl font-oswald">My WishList</h4>
            </div>
            <div className="grid pb-20  px-2">
              {allWishlist && allWishlist.length > 0 ? (
                allWishlist
                  .slice(0)
                  .reverse()
                  .map((value, index) => {
                    return (
                      <div
                        key={index}
                        className="mt-4 group  rounded border w-full justify-between cursor-pointer lg:flex "
                      >
                        <div className="flex w-full gap-2 p-4">
                          <Image
                            src={value.product.productImage[0]}
                            className="w-[100px] h-24 object-cover rounded-lg"
                            alt=""
                            width={100}
                            height={96}
                            onClick={() =>
                              router.push(
                                `/product/details/${value.product.id}`
                              )
                            }
                          />
                          <div className="space-y-1 w-full pl-2">
                            <h6
                              className="text-lg group-hover:underline font-meta font-semibold decoration-1"
                              onClick={() =>
                                router.push(
                                  `/product/details/${value.product.id}`
                                )
                              }
                            >
                              {value.product.productTitle}
                            </h6>
                            <div className="gap-4">
                              {/* Price */}
                              <p className="text-base text-black">
                                <span className="text-gray-600 dark:text-gray-300">
                                  <span className="text-lg text-black font-semibold">
                                    ₹
                                    {value &&
                                      value.product.afterDiscountPrice.toFixed(
                                        0
                                      )}
                                  </span>
                                  <span className="ml-2 line-through font-semibold text-md text-gray-500  ">
                                    ₹{value && value.product.price}
                                  </span>
                                </span>
                              </p>
                              {/* Comment */}
                              <p className="text-myred font-meta font-medium">
                                {value.product.comment}
                              </p>
                            </div>
                          </div>
                          <div className="cross">
                            <button
                              onClick={() =>
                                removeFromWishlist(value.product.id)
                              }
                              className=""
                            >
                              <p className="text-base text-red-400 font-semibold flex gap-x-1 items-center  border-none md:border-2">
                                <Trash size={20} />
                              </p>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="mt-6 w-full flex flex-col gap-y-6 items-center">
                  <span className="font-normal text-xl w-full items-center text-center">
                    No Products Found
                  </span>
                  <div className="w-full flex">
                    <Link
                      href="/"
                      className="flex font-normal text-color text-sm mt-10"
                    >
                      <svg
                        className="fill-current mr-2 text-color w-4"
                        viewBox="0 0 448 512"
                      >
                        <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
                      </svg>
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyWishList = () => {
  return (
    <CustomerPersist>
      <CustomerRequireAuth>
        <WishlistContent />
      </CustomerRequireAuth>
    </CustomerPersist>
  );
};

export default MyWishList;
