"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import { getBestsellerProducts } from "@/app/api/publicApis/publicCategories";
import ProductGrid from "../general/ProductGrid";

// ✅ Dynamically import DataLoader (prevents unnecessary SSR execution)
const DataLoader = dynamic(() => import("@/components/loaders/DataLoader"), {
  ssr: false,
});

// ✅ Define Product Type
interface Product {
  id: string;
  thumbnail: string;
  productTitle: string;
  afterDiscountPrice: number;
  price: number;
}

// ✅ Bestsellers Component
export const Bestsellers: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [productCatData, setProductCatData] = useState<Product[]>([]);
  const privateAxios = useAxiosPrivate();

  // ✅ Fetch Bestselling Products
  const getProductByCategory = async () => {
    setLoading(true);
    const allData = { privateAxios, pageSize: 4 };

    try {
      const res = await getBestsellerProducts(allData);
      if (res.status === 200) {
        setProductCatData(res.data.bestSellerProducts);
      }
    } catch (error) {
      console.error("Error fetching bestsellers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductByCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sm:p-0 md:p-12 lg:p-5 space-y-2 md:space-y-4 lg:space-y-6">
      {/* Header Title */}
      <div className="flex justify-between items-center bg-white px-2 lg:px-10">
        <Link href="/bestsellers">
          <span className="lg:text-3xl text-lg text-center font-oswald flex gap-x-2 tracking-widest font-semibold text-black items-center">
            Bestsellers
          </span>
        </Link>

        <Link
          href="/bestsellers"
          className="flex items-center gap-[2px] border-[1px] border-gray-600 text-black
                   hover:bg-black hover:text-white transition-colors 
                   duration-200 rounded-none md:rounded px-2 md:px-3 leading-[1] py-1 md:py-2"
        >
          <span className="text-xs md:text-sm">View All</span>
        </Link>
      </div>

      {/* Product Grid */}
      <div className="w-full lg:px-10 px-2">
        {loading ? (
          <div className="w-full flex items-center justify-center">
            <DataLoader />
          </div>
        ) : (
          productCatData.length > 0 && (
            <ProductGrid products={productCatData} showWishlist={false} />
          )
        )}
      </div>
    </div>
  );
};
