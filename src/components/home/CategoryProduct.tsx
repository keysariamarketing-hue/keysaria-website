"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import Image from "next/image";
import { publicAllCategories } from "@/app/api/publicApis/publicCategories";

// Define Category Type
interface Category {
  id: string;
  catName: string;
  image: string;
  isActive: boolean;
}

const CategoryProduct: React.FC = () => {
  const privateAxios = useAxiosPrivate();
  const [categoryData, setCategoryData] = useState<Category[]>([]);

  const getCategories = async () => {
    const allData = {
      privateAxios,
    };
    try {
      const res = await publicAllCategories(allData);
      setCategoryData(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="py-8">
      <div className="px-4 space-y-6">
        {/* Title */}
        <div className="text-center">
          <h3 className="text-lg lg:text-4xl font-oswald font-extrabold uppercase text-black">
            Shop By Category
          </h3>
        </div>

        {/* Categories Grid */}
        <div className="flex flex-wrap justify-center gap-6 lg:px-10">
          {categoryData.map(
            (data) =>
              data.isActive && (
                <div key={data.id} className="text-center">
                  <Link href={`/product/${data.catName}/${data.id}`} passHref>
                    <div className="flex flex-col items-center justify-center relative group cursor-pointer transition-transform transform hover:scale-105">
                      {/* Category Image */}
                      <div className="relative h-20 w-20 md:h-28 md:w-28 lg:h-44 lg:w-44 rounded-full shadow-lg overflow-hidden">
                        <Image
                          src={data.image}
                          alt={data.catName}
                          className="h-full w-full object-cover"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      {/* Category Name */}
                      <p className="mt-2 text-sm md:text-lg font-meta font-semibold uppercase text-gray-800 group-hover:text-black">
                        {data.catName}
                      </p>
                    </div>
                  </Link>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
