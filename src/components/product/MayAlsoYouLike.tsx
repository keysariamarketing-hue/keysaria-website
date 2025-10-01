"use client";
import { getProductByCollectionId } from "@/app/api/publicApis/publicCategories";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import { BriefProductData } from "@/types/homeProductType";
import React, { useEffect, useState } from "react";
import ProductGrid from "../general/ProductGrid";

interface MayAlsoYouLikeProps {
  id: string;
  currentProductID: string;
}

export const MayAlsoYouLike: React.FC<MayAlsoYouLikeProps> = ({
  id,
  currentProductID,
}) => {
  const [productCatData, setProductCatData] = useState<BriefProductData[]>([]);
  const privateAxios = useAxiosPrivate();

  // Fetch products by category
  const getProductByCategory = async () => {
    const allData = {
      privateAxios,
      id,
    };
    try {
      const res = await getProductByCollectionId(allData);
      if (res.status === 200) {
        const filteredProducts = res.data.getAllProducts.filter(
          (product: BriefProductData) => product.id !== currentProductID
        );
        setProductCatData(filteredProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch data whenever the `id` prop changes
  useEffect(() => {
    if (id) {
      getProductByCategory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>
      {/* header section */}
      <div className="pb-10">
        <div className=" md:mt-20 mb-4 space-y-3 mx-auto">
          <div className="flex gap-4 items-center">
            <h3 className="font-oswald font-semibold tracking-wider">
              You May Also Like
            </h3>
          </div>
        </div>

        <div className="lg:gap-8 gap-2">
          {productCatData && productCatData.length > 0 && (
            <ProductGrid
              products={productCatData}
              showWishlist={false}
              // isAddedToWishlist={isAddedToWishlist}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MayAlsoYouLike;
