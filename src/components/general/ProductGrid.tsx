"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import AddToWishlist from "./AddToWishlist";
import { BriefProductData } from "@/types/homeProductType";

// Define Props Type
interface ProductGridProps {
  products: BriefProductData[];
  showWishlist?: boolean;
  isAddedToWishlist?: string[];
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  showWishlist,
  isAddedToWishlist,
}) => {
  const router = useRouter();

  const handleNavigateToProduct = (productId: string) => {
    router.push(`/product/details/${productId}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 justify-center sm:grid-cols-2 lg:gap-8 gap-x-2 gap-y-4">
      {products.map((product, index) => (
        <div key={index} className="overflow-hidden relative group">
          <div className="relative flex flex-col gap-y-2">
            <div className="w-full h-full overflow-hidden relative rounded-sm">
              {/* Product Image with zoom on hover */}
              <div
                className="relative w-full h-[220px]"
                onClick={() => handleNavigateToProduct(product.id)}
              >
                <Image
                  className="md:h-auto object-cover scale-100 hover:scale-125 transform transition-transform duration-500 ease-in-out rounded-sm"
                  src={product.thumbnail}
                  alt="Product Img"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              {/* Hover Overlay */}
              <div onClick={() => handleNavigateToProduct(product.id)}>
                <div className="absolute bottom-0 py-2 left-0 right-0 bg-black bg-opacity-80 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-b-sm">
                  <span className="text-white text-base font-normal">
                    Quick View
                  </span>
                </div>
              </div>

              {/* Add to wishlist button */}
              {showWishlist && (
                <div className="text-sm absolute top-0 right-0 text-color bg-white px-4 rounded-full h-8 w-8 flex flex-col items-center justify-center mt-3 mr-3 hover:bg-white hover:text-red-800 transition duration-500 ease-in-out">
                  <AddToWishlist
                    isAddedToWishlist={isAddedToWishlist}
                    productId={product.id}
                  />
                </div>
              )}
            </div>

            <div onClick={() => handleNavigateToProduct(product.id)}>
              {/* Product Title & Price */}
              <div className="flex flex-col gap-y-1">
                <h4 className="hidden md:block text-sm md:text-base md:leading-5">
                  {product.productTitle.length > 70
                    ? product.productTitle.slice(0, 70) + "..."
                    : product.productTitle}
                </h4>
                <h4 className="block md:hidden text-sm md:text-base leading-4">
                  {product.productTitle.length > 45
                    ? product.productTitle.slice(0, 45) + "..."
                    : product.productTitle}
                </h4>
                <p className="text-black font-semibold text-[0.90rem]">
                  &#8377;{product.afterDiscountPrice}{" "}
                  <span className="font-medium text-gray-600 line-through">
                    &#8377;{product.price}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
