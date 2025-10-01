"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { getBestsellerProducts } from "@/app/api/publicApis/publicCategories";
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
import { useSelector, useDispatch } from "react-redux";

const BestsellerPage = () => {
  const [open, setOpen] = useState(false);
  const [productCatData, setProductCatData] = useState<BriefProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(1);
  const [isAddedToWishlist, setIsAddedToWishlist] = useState<string[]>([]);
  const privateAxios = useAxiosPrivate();
  const { customerAuth } = useAuth() as AuthContextType;
  const customerId = customerAuth?.result?.CustomerId;
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

  const getProductByCategory = useCallback(async () => {
    if (typeof window === "undefined") return; // Prevent API calls during pre-rendering
    setLoading(true);

    const allData = {
      privateAxios,
      maxPrice: filters.maxPrice,
      minPrice: filters.minPrice,
      minDiscount: filters.minDiscount,
      page: currentPage,
    };

    try {
      const res = await getBestsellerProducts(allData);
      if (res.status === 200) {
        setTotalPage(res.data.totalPage);
        setProductCatData(res.data.bestSellerProducts);
      }
    } catch (error) {
      console.error("Failed to fetch bestsellers", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, privateAxios]);

  useEffect(() => {
    if (!customerId) return; // Ensure customerId exists before fetching
    dispatch(fetchWishlistDataThunk(getWishlist));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, dispatch]);

  useEffect(() => {
    setIsAddedToWishlist(
      allWishlist?.length > 0 ? allWishlist.map((item) => item.product.id) : []
    );
  }, [allWishlist]);

  useEffect(() => {
    getProductByCategory();
  }, [getProductByCategory]);

  return (
    <div className="w-full md:py-4 py-8">
      {/* Filter Drawer */}
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

      {/* Page Content */}
      <div className="w-full md:py-4">
        {loading ? (
          <ProductsLoader />
        ) : productCatData.length > 0 ? (
          <div className="mt-4 md:mt-8 lg:px-10 px-2 lg:gap-8 gap-2">
            <ProductGrid
              products={productCatData}
              showWishlist={true}
              isAddedToWishlist={isAddedToWishlist}
            />
          </div>
        ) : (
          <span className="font-semibold text-xl text-gray-700 flex justify-center items-center h-full w-full py-52">
            No products found
          </span>
        )}

        {/* Pagination */}
        {productCatData.length > 0 && (
          <nav className="px-5 mt-6 flex justify-end">
            <ul className="inline-flex -space-x-px text-base h-10">
              <li>
                <button
                  onClick={previousPage}
                  disabled={currentPage === 1}
                  className="px-2 h-10 text-gray-500 bg-white border rounded-s-lg hover:bg-gray-100"
                >
                  Previous
                </button>
              </li>
              <li className="px-3 h-10 text-gray-500 bg-white border">
                {currentPage}
              </li>
              <li className="px-3 h-10 text-gray-500 bg-white border">OF</li>
              <li className="px-3 h-10 text-gray-500 bg-white border">
                {totalPage}
              </li>
              <li>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPage}
                  className="px-3 h-10 text-gray-500 bg-white border rounded-e-lg hover:bg-gray-100"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

// ✅ Wrap everything inside Suspense for CSR
const BestsellerPageWrapper = () => {
  return (
    <Suspense fallback={<ProductsLoader />}>
      <BestsellerPage />
    </Suspense>
  );
};

export default BestsellerPageWrapper;
