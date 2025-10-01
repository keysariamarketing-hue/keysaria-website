"use client";
import { getProductByCollectionId } from "@/app/api/publicApis/publicCategories";
import FilterDrawer from "@/components/filter/FilterDrawer";
import ProductGrid from "@/components/general/ProductGrid";
import ProductsLoader from "@/components/loaders/ProductLoader";
import { AuthContextType } from "@/context/AuthProvider";
import { fetchWishlistDataThunk } from "@/features/wishlistSlice";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import useAuth from "@/hook/useAuth";
import useFilteration from "@/hook/useFilteration";
import { AppDispatch, RootState } from "@/store/store";
import { BriefProductData } from "@/types/homeProductType";
import { Wishlist } from "@/types/wishlistType";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const ProductCollection = () => {
  const [open, setOpen] = useState(false);
  const [productCatData, setProductCatData] = useState<BriefProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(1);
  const { id }: { id: string } = useParams();
  const privateAxios = useAxiosPrivate();
  const [isAddedToWishlist, setIsAddedToWishlist] = useState<string[]>([]);
  const { customerAuth } = useAuth() as AuthContextType;
  const customerId = customerAuth && customerAuth.result?.CustomerId;
  const [filterReset] = useState(0);

  const getWishlist = { privateAxios, customerId };
  const dispatch = useDispatch<AppDispatch>();
  const allWishlist: Wishlist[] = useSelector(
    (state: RootState) => state.wishlistItem.allWishlist
  );
  const [rating] = useState<string | null>(null);

  const {
    filters,
    handleFilterChange,
    clearFilters,
    nextPage,
    currentPage,
    previousPage,
  } = useFilteration();

  const getProductByCategory = async () => {
    setLoading(true);
    const allData = {
      privateAxios,
      id,
      maxPrice: filters.maxPrice,
      minPrice: filters.minPrice,
      minDiscount: filters.minDiscount,
      page: currentPage,
      ...(rating && { minRating: rating }), // Conditionally add minRating if rating exists
    };
    const res = await getProductByCollectionId(allData);
    console.log(res);
    if (res.status === 200) {
      setTotalPage(res.data.totalPage);
      setProductCatData(res.data.getAllProducts);
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchWishlistDataThunk(getWishlist));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch]);

  useEffect(() => {
    setIsAddedToWishlist(
      allWishlist && allWishlist.length > 0
        ? allWishlist.map((item) => item.product.id)
        : []
    );
  }, [allWishlist]);

  //get product by category id
  useEffect(() => {
    getProductByCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterReset, currentPage, filters.type, id]);

  useEffect(() => {
    console.log("CURRENT PAGE ==");
    console.log(currentPage);
  }, [currentPage]);

  return (
    <div className="w-full md:py-4 py-8">
      <FilterDrawer
        open={open}
        setOpen={setOpen}
        filters={filters}
        handleFilterChange={handleFilterChange}
        resetFilters={clearFilters}
        applyFilters={() => {
          getProductByCategory();
          setOpen(false);
        }}
        rating={filters.minRating}
        setRating={() => handleFilterChange("minRating", rating!)}
      />
      {/* Product Grid */}
      {loading ? (
        <ProductsLoader />
      ) : productCatData && productCatData.length > 0 ? (
        loading ? (
          <ProductsLoader />
        ) : (
          <div className="mt-4 md:mt-8 lg:px-10 px-2 lg:gap-8 gap-2">
            {productCatData && productCatData.length > 0 && (
              <ProductGrid
                products={productCatData}
                showWishlist={true}
                isAddedToWishlist={isAddedToWishlist}
              />
            )}
          </div>
        )
      ) : (
        <span className="font-semibold text-xl text-gray-700 flex justify-center items-center h-full w-full py-52">
          No products found
        </span>
      )}

      {/* pagination */}
      {productCatData && productCatData.length > 0 && (
        <nav
          className="px-5 mt-6 flex justify-end"
          aria-label="Page navigation example"
        >
          <ul className="inline-flex -space-x-px text-base h-10">
            <li>
              <button
                onClick={previousPage}
                disabled={currentPage === 1}
                className="flex items-center justify-center px-2 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Previous
              </button>
            </li>
            <li className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              {currentPage}
            </li>
            <li className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              OF
            </li>
            <li className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              {" "}
              {totalPage}
            </li>

            <li>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPage}
                className="flex items-center justify-center px-3 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ProductCollection;
