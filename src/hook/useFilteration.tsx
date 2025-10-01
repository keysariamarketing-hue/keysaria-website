"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Filters {
  search: string;
  fullName: string;
  status: string;
  color: string;
  price: string;
  categoriesId: string;
  staffId: string;
  roleId: string;
  minPrice?: string;
  maxPrice?: string;
  minDiscount?: string;
  paymentStatus: string;
  orderStatus?: string;
  type?: string;
  minRating?: string;
}

const useFilteration = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get("search") || "",
    fullName: searchParams.get("fullName") || "",
    status: searchParams.get("status") || "",
    color: searchParams.get("color") || "",
    price: searchParams.get("price") || "",
    categoriesId: searchParams.get("categoriesId") || "",
    staffId: searchParams.get("staffId") || "",
    roleId: searchParams.get("roleId") || "",
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    minDiscount: searchParams.get("minDiscount") || undefined,
    paymentStatus: searchParams.get("paymentStatus") || "",
    orderStatus: searchParams.get("orderStatus") || undefined,
    type: searchParams.get("type") || undefined,
    minRating: searchParams.get("minRating") || undefined,
  });

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [debounce, setDebounce] = useState<string>(filters.search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce(filters.search);
    }, 500);
    return () => clearTimeout(timeout);
  }, [filters.search]);

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });

    if (currentPage !== 1) params.set("page", currentPage.toString());

    router.replace(`${pathname}?${params.toString()}`);
  }, [filters, debounce, currentPage, router, pathname]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const setRating = (value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, minRating: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      fullName: "",
      status: "",
      color: "",
      price: "",
      categoriesId: "",
      staffId: "",
      roleId: "",
      minPrice: undefined,
      maxPrice: undefined,
      minDiscount: undefined,
      paymentStatus: "",
      orderStatus: undefined,
      type: undefined,
      minRating: undefined,
    });
    setCurrentPage(1);
  };

  const previousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return {
    filters,
    currentPage,
    handleFilterChange,
    clearFilters,
    nextPage,
    previousPage,
    debounce,
    setRating,
  };
};

export default useFilteration;
