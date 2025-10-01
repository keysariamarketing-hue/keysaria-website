"use client";
import { useEffect, useState } from "react";
import Link from "next/link"; // Next.js Link
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import { getProductByCollectionId } from "@/app/api/publicApis/publicCategories";
import DataLoader from "../loaders/DataLoader";
import ProductGrid from "../general/ProductGrid";
import { BriefProductData } from "@/types/homeProductType";

interface HomeCollectionProductsProps {
  collectionID: string;
  collectionName: string;
}

const HomeCollectionProducts: React.FC<HomeCollectionProductsProps> = ({
  collectionID,
  collectionName,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [productCatData, setProductCatData] = useState<BriefProductData[]>([]); // Array of product objects
  const privateAxios = useAxiosPrivate();

  const getProductByCollection = async () => {
    setLoading(true);
    try {
      const allData = {
        privateAxios,
        id: collectionID,
        pageSize: 4,
      };
      const res = await getProductByCollectionId(allData);
      console.log("res", res);
      if (res.status === 200) {
        setProductCatData(res.data.getAllProducts);
      }
    } catch (error) {
      console.error("Error fetching collection products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductByCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionID]);

  return (
    <div className="sm:p-0 md:p-12 lg:p-5 space-y-2 md:space-y-4 lg:space-y-6">
      {/* Header Title */}
      <div className="flex justify-between items-center bg-white px-2 lg:px-10">
        <span className="lg:text-3xl text-lg text-center font-oswald flex gap-x-2 tracking-widest font-semibold text-black items-center">
          {collectionName}
        </span>

        <Link
          href={`/collection/${collectionName}/${collectionID}`}
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

export default HomeCollectionProducts;
