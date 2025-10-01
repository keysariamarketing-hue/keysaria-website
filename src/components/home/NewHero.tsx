"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import Images
import Img1 from "../../../public/Hero Carousel/1.jpg";
import Img2 from "../../../public/Hero Carousel/2.jpg";
import Img3 from "../../../public/Hero Carousel/3.jpg";
import Img4 from "../../../public/Hero Carousel/4.jpg";
import Img5 from "../../../public/Hero Carousel/5.jpg";
import Img6 from "../../../public/Hero Carousel/6.jpg";
import Mobile1 from "../../../public/mobilebanner/1.jpg";
import Mobile2 from "../../../public/mobilebanner/2.jpg";
import Mobile3 from "../../../public/mobilebanner/3.jpg";
import Mobile4 from "../../../public/mobilebanner/4.jpg";
import Mobile5 from "../../../public/mobilebanner/5.jpg";
import Mobile6 from "../../../public/mobilebanner/6.jpg";

// Define banner data type
type BannerData = {
  image: StaticImageData;
  mobilebanner: StaticImageData;
  link: string;
};

// Banner Data Array
const bannerData: BannerData[] = [
  {
    image: Img1,
    mobilebanner: Mobile1,
    link: "/collection/Ghoomar/5d1bc03f-52e5-492d-a89f-4343a6550ad4",
  },
  {
    image: Img2,
    mobilebanner: Mobile2,
    link: "/collection/Navrani/4b506c0b-a4cd-4256-85be-607c412170c8",
  },
  {
    image: Img3,
    mobilebanner: Mobile3,
    link: "/collection/Rajwada/f08843b0-39fd-4be5-8ee3-f81ea0e6d6b6",
  },
  {
    image: Img4,
    mobilebanner: Mobile4,
    link: "/collection/Bindani/551d5fab-f05d-4217-bbda-0aa32b1939fa",
  },
  {
    image: Img5,
    mobilebanner: Mobile5,
    link: "/collection/Utsav/e42b8020-a541-4095-bfdc-2f89621cfa19",
  },
  {
    image: Img6,
    mobilebanner: Mobile6,
    link: "/collection/BandhaniSaree/74b08219-f66b-4db8-b239-035bd1f7ce09",
  },
];

const NewHero: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const updateSize = () => setIsMobile(window.innerWidth <= 768);
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Slider Settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: false,
    pauseOnFocus: false,
    nextArrow: <IoIosArrowForward size={24} />,
    prevArrow: <IoIosArrowBack size={24} />,
  };

  return (
    <div className="w-full">
      <Slider {...settings} className="w-full overflow-hidden">
        {bannerData.map((data, index) => (
          <div key={index} className="relative w-full">
            <Link href={data.link}>
              <Image
                className="h-[400px] w-full object-cover"
                src={isMobile ? data.mobilebanner : data.image}
                alt="keysaria-collection"
                width={1920}
                height={1080}
                priority
              />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewHero;
