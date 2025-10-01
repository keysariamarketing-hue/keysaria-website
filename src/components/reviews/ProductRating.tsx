"use client";

import React, { useState } from "react";
import ProductRatingDialogueBox from "./ProductRatingDialogueBox";
import { ProductRatingType } from "@/types/reviewType";

interface ProductRatingProps {
  productId?: string;
  reviewAndRating: ProductRatingType[];
  heading: string;
  askReview?: boolean;
}

const ProductRating: React.FC<ProductRatingProps> = ({
  productId,
  reviewAndRating,
  heading,
  askReview,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const totalReviews = reviewAndRating.length;
  const averageRating =
    reviewAndRating.reduce((sum, review) => sum + review.rating, 0) /
    (totalReviews || 1);

  // Count reviews for each rating (5, 4, 3, 2, 1 stars)
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviewAndRating.filter((review) => review.rating === star).length
  );

  return (
    <div className="mx-auto py-10 md:py-8">
      <h2 className="text-2xl font-oswald font-semibold text-center mb-4 md:mb-6 tracking-wider">
        {heading}
      </h2>
      {reviewAndRating.length > 0 ? (
        <div className="grid grid-cols-1 px-4 md:px-0 md:grid-cols-3 gap-6 items-center">
          {/* Left Section: Average Rating */}
          <div className="text-center">
            <div className="flex justify-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-4xl ${
                    i < Math.round(averageRating)
                      ? "text-[#f3a900]"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-lg font-medium mt-2">
              {averageRating.toFixed(2)} out of 5
            </p>
            <p className="text-gray-600">Based on {totalReviews} reviews</p>
          </div>

          {/* Middle Section: Star Ratings */}
          <div>
            {ratingCounts.map((count, index) => (
              <div key={index} className="flex items-center gap-4 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-3xl ${
                        i < 5 - index ? "text-[#f3a900]" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div
                    className="bg-black h-2 rounded"
                    style={{
                      width: `${(count / totalReviews) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{count}</span>
              </div>
            ))}
          </div>

          {/* Right Section: Review Button */}
          {askReview && (
            <>
              <div className="flex justify-center">
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-black text-white px-6 py-2 text-lg font-normal hover:bg-gray-800 transition duration-300"
                >
                  Write a Store Review
                </button>
              </div>
              {isOpen && productId && (
                <ProductRatingDialogueBox
                  productId={productId}
                  setIsOpen={setIsOpen}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-y-2">
          <span className="text-center">
            Be the first one to write a review
          </span>
          <div className="flex justify-center">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-black text-white px-6 py-2 text-lg font-normal hover:bg-gray-800 transition duration-300"
            >
              Write a Store Review
            </button>
          </div>
          {isOpen && productId && (
            <ProductRatingDialogueBox
              productId={productId}
              setIsOpen={setIsOpen}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProductRating;
