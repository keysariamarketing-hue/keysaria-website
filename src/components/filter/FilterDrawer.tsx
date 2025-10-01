"use client";

import { Drawer } from "antd";
import { IoFilter } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import { FiStar } from "react-icons/fi";

interface FilterType {
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

interface FilterProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  filters: FilterType;
  handleFilterChange: (name: string, value: string) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  rating?: string;
  setRating: (value: string) => void;
}

const FilterDrawer: React.FC<FilterProps> = ({
  open,
  setOpen,
  filters,
  handleFilterChange,
  resetFilters,
  applyFilters,
  rating,
  setRating,
}) => {
  return (
    <>
      {/* Filter Button */}
      <div className="flex justify-between w-full sticky border-b z-10 px-3 items-center text-color top-[4.5rem] bg-white lg:p-4 pb-2">
        <div
          className="text-2xl text-slate-300 cursor-pointer flex items-center py-2 lg:px-8"
          onClick={() => setOpen(!open)}
        >
          {!open ? (
            <div className="flex items-center gap-2">
              <IoFilter className="text-black" />
              <label className="lg:text-lg text-sm font-semibold tracking-wider text-black font-oswald">
                Filter
              </label>
            </div>
          ) : null}
        </div>
      </div>

      {/* Filter Side Drawer */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        className="p-4 min-h-screen overflow-y-scroll"
      >
        {/* Close Icon */}
        {/* <div className="mb-6 flex items-center justify-end">
          <IconButton
            onClick={() => setOpen(false)}
            className="text-red-500"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <RxCross2 className="text-2xl text-black" />
          </IconButton>
        </div> */}

        {/* Filters */}
        <div className="flex flex-col gap-5">
          {/* Price Range */}
          <div className="flex gap-2 w-full">
            <div className="relative float-label-input w-1/2">
              <input
                type="number"
                className="block w-full px-3 bg-white focus:outline-none border border-gray-300 rounded-md py-2"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice || ""}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <label
                htmlFor="minPrice"
                className="absolute top-3 left-2 text-sm text-black"
              >
                Min Price
              </label>
            </div>
            <div className="relative float-label-input w-1/2">
              <input
                type="number"
                className="block w-full px-3 bg-white focus:outline-none border border-gray-300 rounded-md py-2"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice || ""}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
              <label
                htmlFor="maxPrice"
                className="absolute top-3 left-2 text-sm text-black"
              >
                Max Price
              </label>
            </div>
          </div>

          {/* Discount */}
          <div className="relative float-label-input w-full">
            <input
              type="number"
              className="block w-full px-3 bg-white focus:outline-none border border-gray-300 rounded-md py-2"
              id="minDiscount"
              name="minDiscount"
              value={filters.minDiscount || ""}
              onChange={(e) =>
                handleFilterChange("minDiscount", e.target.value)
              }
            />
            <label
              htmlFor="minDiscount"
              className="absolute top-3 left-2 text-sm text-black"
            >
              Min Discount
            </label>
          </div>

          {/* Rating Filter */}
          <fieldset className="border border-gray-300 p-5 flex flex-col gap-2 rounded-md">
            <legend>Min Rating</legend>
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={star}
                  checked={rating === star.toString()}
                  onChange={() => setRating(star.toString())}
                  name="minRating"
                  id={`star-${star}`}
                />
                <label
                  htmlFor={`star-${star}`}
                  className="flex text-yellow-500 gap-1"
                >
                  {[...Array(star)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                  {[...Array(5 - star)].map((_, i) => (
                    <FiStar key={i} />
                  ))}
                </label>
              </div>
            ))}
          </fieldset>

          {/* Filter Buttons */}
          <div className="flex flex-col items-center gap-5">
            <button
              onClick={resetFilters}
              className="w-2/4 bg-gray-200 py-2 rounded-md"
            >
              Reset Filter
            </button>
            <button
              onClick={applyFilters}
              className="w-2/4 bg-black text-white py-2 rounded-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default FilterDrawer;
