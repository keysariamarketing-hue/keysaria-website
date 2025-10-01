"use client";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import RF1 from "../../../public/RoundFilters/rf1.jpg";
import RF2 from "../../../public/RoundFilters/rf2.jpg";
import RF3 from "../../../public/RoundFilters/rf3.jpg";

const CategoryHeaderCarousel = () => {
  // Define type for categories
  type Category = {
    name: string;
    image: StaticImageData;
    link: string;
  };

  const categories: Category[] = [
    { name: "Best Sellers", image: RF1, link: "/bestsellers" },
    { name: "Daily Wear", image: RF2, link: "/daily-wear" },
    { name: "Festive Wear", image: RF3, link: "/festive-wear" },
  ];

  return (
    <div className="w-full mt-[1rem] sm:px-0 md:px-12 lg:px-5">
      <div className="flex gap-6 overflow-x-auto px-4">
        {categories.map((category, index) => (
          <Link href={category.link} key={index}>
            <div className="flex flex-col items-center space-y-1 md:space-y-2">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white border-[1px] border-black rounded-full overflow-hidden p-[2px]">
                <Image
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-full"
                  width={64}
                  height={64}
                />
              </div>
              <p className="text-center text-xs font-light">{category.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryHeaderCarousel;
