"use client";
import { getReviews } from "@/app/api/publicApis/publicCategories";
import DataLoader from "@/components/loaders/DataLoader";
import ProductRating from "@/components/reviews/ProductRating";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import { ProductRatingType } from "@/types/reviewType";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Reviews = () => {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<ProductRatingType[]>([]);
  const privateAxios = useAxiosPrivate();

  const getReviewsFunc = async () => {
    setLoading(true);
    const allData = {
      privateAxios,
    };
    const res = await getReviews(allData);
    console.log("REVIEWS", res);
    if (res.status === 200) {
      setReviews(res.data);
      setLoading(false);
    }
  };
  useEffect(() => {
    getReviewsFunc();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <div className="max-w-4xl mx-auto pt-6 pb-20 space-y-6">
      <DataLoader />
    </div>
  ) : (
    <div className="mx-auto pt-4 pb-20 space-y-10">
      <div className="border-b">
        <ProductRating reviewAndRating={reviews} heading="CUSTOMER REVIEWS" />
      </div>
      <div className="px-4 md:px-0 mx-auto max-w-4xl">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="flex items-start gap-4 border-b mb-6 pb-6 last:border-none"
          >
            {/* Profile Image */}
            <div className="w-10 h-10 ">
              <Image
                src={
                  review.customer.profileImage ||
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAACUCAMAAACp1UvlAAAAMFBMVEXk5ueutLepsLPZ3N7n6erg4uPKztC3vL++w8W7wMPHy83V2NqzubzP0tTc3+DCxskfOlAIAAADRklEQVR4nO2bwXKEIAxAEQMqCP7/3xbdrV23XSXRBKfDu7SHzvRNDBBDVKpSqVQqlUqlUqlUKpVK5V8AsP4Cu38oCUD0duqHRO+sV7dQAxVd12wYg1GF1UCFQevmDa17X1IMlH9XWunaYmYQh1+heglab8qYgf0s9aDMw+x3gvUMmSsgNh5ZLc9S2irmaCWxQTZiJstKPGKmOzZaxeQiBnv7wy8xKyUGAaGV8EJeEWWVkAkY5C3FH2S2MexTnIkCXgYbLpk1SQlXow2/F94qMXEHDFpCuFIJyx0w6Enx0oHZi5D1C9zntyc9xhQwXi1wVC/e2hW916/wrkgghislGKeWimQv1p0CqGmfvDjPSLBkr6bl9HJkLc1ZHRJ3e36vie7FeRL9x3ixet017++6T9x0X73rOXTm3L5pncP8bktNfM3cBibX0cz1PaLztYH7jfuu72lA2ynY32uJK5K9D0DLfOa3xwf4zBfp/RI6J/zZtYh1SDGpjjS27zsKNcqxLUPOymsrNmHuFSRv+xD3MAJb1wu5u6v0FWRm31D6ni+Rs1sUubDNuEcWu0p7BcL+s9RjLDQQYHbnFFyhOYXZrP2wYeim1PTEU0z5P+dgpnLTJj9qdhibp5xOP8fBlx4begBg2rAMWvWTDa25xZzVAmwobTMze8ToQ7Buxobg26hK2qV/nB7f9PeCHHvroxGfnEv/r7V9t6T5p+1L67F3kkN9oEzIf7vtbJRYnSmb7NBg6lWtO+e5o2Y8rT8xOsZRSDBupPbl0sHEdQTEgei0Bo3hHIB4XG4dB224+B0EDP1CYcuV46MAFrUCd9HTVQXQxyKLSrhE7HhMFcsVE7dgsF2SLM7mP7QMUs3pFzjSUFWe2Jm5BfJ0SQ4dOclQbRs8I1GMWYsqxq5F67uy5tY3HV6LbSVuwLahuPatd9AdH/L9J1YMVV8I5PwKRuvz5zfX4xBiFxc2+2S3989MbxDosjNM0qrJLnquLwQPyC0tpPaIb3RehtFncKhkXZuC6GJ8kHN+Z3+ydCEZpxGEAl45H2Vd9WaNIacQK5BeOSuyRHo1+vgVnPb9xlmOL3Vl6tR3DuvWVHmV4PgTttgW4UirUqlUKpWKUl/lWSnkmIvaNgAAAABJRU5ErkJggg=="
                }
                alt={review.customer.fullName}
                className="rounded-full object-cover"
                width={40}
                height={40}
                priority
              />
            </div>

            {/* Review Content */}
            <div className="flex-1">
              {/* Name and Verification */}
              <div className="flex items-center">
                <h4 className="font-medium leading-none text-lg">
                  {review.customer.fullName}
                </h4>
              </div>

              {/* Rating */}
              <div className="flex items-center my-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-3xl ${
                      i < review.rating ? "text-[#f3a900]" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="text-gray-700 text-base font-normal">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
