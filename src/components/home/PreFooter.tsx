"use client";

import { Package, Tag } from "lucide-react";
import { ReactNode } from "react";
import { FaRegCreditCard, FaRegThumbsUp } from "react-icons/fa6";

interface Feature {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}

const PreFooter: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <FaRegThumbsUp className="text-4xl text-black" />,
      title: "100K+ HAPPY CUSTOMERS",
    },
    {
      icon: <Package className="text-4xl text-black" />,
      title: "COD COMING SOON",
    },
    {
      icon: <Tag className="text-4xl text-black" />,
      title: "7 DAYS EXCHANGE",
    },
    {
      icon: <FaRegCreditCard className="text-4xl text-black" />,
      title: "AUTHENTIC, REASONABLE PRICES",
    },
  ];

  return (
    <div className="flex justify-center items-center p-8 mb-4 md:mb-8">
      <div className="flex flex-col lg:flex-row lg:gap-20 gap-8 justify-center items-center text-center">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-2"
          >
            <div>{feature.icon}</div>
            <h3 className="text-base md:text-lg font-normal font-oswald text-black">
              {feature.title}
            </h3>
            {feature.subtitle && (
              <p className="text-sm text-gray-600">{feature.subtitle}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreFooter;
