"use client";
import { getFeaturedProducts } from "@/app/api/publicApis/publicCategories";
import { AuthContextType } from "@/context/AuthProvider";
import { fetchWishlistDataThunk } from "@/features/wishlistSlice";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import useAuth from "@/hook/useAuth";
import { AppDispatch } from "@/store/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ProductGrid from "../general/ProductGrid";
import { BriefProductData } from "@/types/homeProductType";

const NewArrivals = () => {
  //   const [, setIsAddedToWishlist] = useState([]);
  const [productData, setProductData] = useState<BriefProductData[]>([]);
  const privateAxios = useAxiosPrivate();
  const { customerAuth } = useAuth() as AuthContextType;
  const id = customerAuth && customerAuth?.result?.CustomerId;

  const getAllProducts = async () => {
    const allData = { privateAxios, pageSize: 4 };
    try {
      const res = await getFeaturedProducts(allData);
      console.log(res.data.featuredProducts);

      setProductData(res.data.featuredProducts);
    } catch (error) {
      console.log(error);
    }
  };

  const getWishlist = { privateAxios, customerId: id };
  const dispatch = useDispatch<AppDispatch>();
  //   const allWishlist = useSelector(
  //     (state: RootState) => state.wishlistItem.allWishlist
  //   );

  useEffect(() => {
    if (id) {
      dispatch(fetchWishlistDataThunk(getWishlist));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch]);

  //   useEffect(() => {
  //     setIsAddedToWishlist(
  //       allWishlist?.length > 0
  //         ? allWishlist.map(
  //             (item: { product: { id: string } }) => item.product.id
  //           )
  //         : []
  //     );
  //   }, [allWishlist]);

  useEffect(() => {
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="sm:p-0 md:p-12 lg:p-5 space-y-2 md:space-y-4 lg:space-y-6">
        {/* header */}
        <div className="flex justify-between items-center bg-white px-2 lg:px-10">
          <Link href="/new-arrivals">
            <span className="lg:text-3xl text-lg text-center font-oswald flex gap-x-2 tracking-widest font-semibold text-black items-center">
              New Arrivals
            </span>
          </Link>

          <Link
            href="/new-arrivals"
            className="flex items-center gap-[2px] border-[1px] border-gray-600 text-black
                   hover:bg-black hover:text-white transition-colors 
                   duration-200 rounded-none md:rounded px-2 md:px-3 leading-[1] py-1 md:py-2"
          >
            <span className="text-xs md:text-sm">View All</span>
          </Link>
        </div>
        {/* Body section */}
        <div className="w-full lg:px-10 px-2">
          {productData && productData.length > 0 && (
            <ProductGrid products={productData} showWishlist={false} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
