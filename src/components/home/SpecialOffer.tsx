"use client";

import Slider from "react-slick";
import Image from "next/image";
import { FaHandSparkles, FaThreads } from "react-icons/fa6";
import { Diamond, Landmark } from "lucide-react";

// Import your images from public directory
const bannerData = ["/feedback/f1.jpg", "/feedback/f2.jpg", "/feedback/f3.jpg"];

const SpecialOffer: React.FC = () => {
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
  };

  return (
    <div className="flex justify-center items-center py-6">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-10 items-center">
          {/* Image Section */}
          <div className="overflow-hidden rounded-lg relative">
            <Slider {...settings} className="w-full rounded-xl">
              {bannerData.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image}
                    alt={`offer-banner-${index}`}
                    width={600}
                    height={400}
                    className="w-full object-cover mx-auto rounded-xl"
                  />
                </div>
              ))}
            </Slider>
          </div>

          {/* Text Details Section */}
          <div className="flex flex-col justify-center sm:pt-0">
            <h1 className="text-center md:text-left text-2xl sm:text-4xl font-oswald text-black font-bold">
              Why choose KEYSARIA
            </h1>
            <div className="flex flex-col pl-[15%] md:pl-0 gap-4 mt-6 md:mt-8">
              {[
                { icon: <Landmark />, text: "Authentic Indian Designs" },
                { icon: <Diamond />, text: "Rich Traditional Look" },
                { icon: <FaThreads />, text: "Heavy Embroidery" },
                { icon: <FaHandSparkles />, text: "Beautiful Handwork" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center font-meta font-bold gap-4"
                >
                  <span className="cta rounded-full p-2 text-myyellow text-3xl">
                    {item.icon}
                  </span>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
