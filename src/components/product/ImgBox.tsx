"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ImageDialogueBox from "./ImageDialogueBox";

interface ImgBoxProps {
  images: string[];
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImgBox: React.FC<ImgBoxProps> = ({
  images,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (images.length > 0) setCurrentIndex(0);
  }, [images]);

  return (
    <>
      <div className="flex flex-col md:flex-row-reverse w-full h-full gap-1.5 mt-3 md:mt-0 overflow-hidden">
        {/* Main Image */}
        <div className="w-full overflow-hidden rounded-sm md:px-1">
          <Image
            className="w-full h-auto object-cover object-center rounded-sm cursor-zoom-in"
            onClick={() => setIsDialogOpen(true)}
            src={images[currentIndex]}
            alt="Product Image"
            width={500}
            height={500}
            priority
          />
        </div>

        {/* Image Dialog */}
        {isDialogOpen && (
          <ImageDialogueBox
            images={images}
            currentIndex={currentIndex}
            setIsDialogOpen={setIsDialogOpen}
            setCurrentIndex={setCurrentIndex}
          />
        )}

        {/* Image Gallery */}
        <div className="flex border-0 md:min-w-[6.5rem] md:flex-col h-[80%] overflow-y-auto gap-x-1.5 md:gap-y-2">
          {images.map((img, index) => (
            <Image
              key={index}
              src={img}
              onClick={() => setCurrentIndex(index)}
              alt="product"
              width={96}
              height={96}
              className={`h-20 w-20 md:w-24 md:h-24 ${
                index === currentIndex ? "border-[2px] border-black" : ""
              } hover:cursor-pointer object-cover object-top`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ImgBox;
