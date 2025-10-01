"use client";

import { useState, MouseEvent, SetStateAction, Dispatch } from "react";
import Image from "next/image";

interface ImageDialogueBoxProps {
  images: string[];
  currentIndex: number;
  setIsDialogOpen: (isOpen: boolean) => void;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}

const ImageDialogueBox: React.FC<ImageDialogueBoxProps> = ({
  images,
  currentIndex,
  setIsDialogOpen,
  setCurrentIndex,
}) => {
  // We open zoomed by default
  const [isZoomed, setIsZoomed] = useState<boolean>(true);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [dragging, setDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Toggle Zoom
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    if (!isZoomed) {
      // Reset position whenever zooming again
      setPosition({ x: 0, y: 0 });
    }
  };

  // Start dragging
  const handleMouseDown = (e: MouseEvent<HTMLImageElement>) => {
    if (!isZoomed) return;
    setDragging(true);
    // Calculate offset from the top-left of the image
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // Drag move
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition({ x: newX, y: newY });
  };

  // Stop dragging
  const handleMouseUp = () => {
    setDragging(false);
  };

  // Close the Dialog
  const closeDialog = () => setIsDialogOpen(false);

  // Navigate Left
  const goPrev = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => {
      return prevIndex > 0 ? prevIndex - 1 : images.length - 1;
    });
    // Reset position if we want a fresh zoom each image
    setPosition({ x: 0, y: 0 });
  };

  // Navigate Right
  const goNext = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => {
      return prevIndex < images.length - 1 ? prevIndex + 1 : 0;
    });
    // Reset position if we want a fresh zoom each image
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-[1000] bg-black bg-opacity-90 flex items-center justify-center"
      onClick={closeDialog}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Image Wrapper */}
      <div
        className="relative w-full h-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* 
          "fill" + "object-contain" so that the image fits the screen.
          Then we scale and translate via inline styles for zoom & drag.
        */}
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={images[currentIndex]}
            alt="Product Image"
            fill
            sizes="100vw"
            priority
            className="object-contain cursor-grab transition-transform duration-300"
            onClick={toggleZoom}
            onMouseDown={handleMouseDown}
            style={{
              transform: isZoomed
                ? `scale(2) translate(${position.x}px, ${position.y}px)`
                : "scale(1)",
              cursor: isZoomed ? "grab" : "zoom-in",
            }}
          />
        </div>

        {/* Navigation / Control Buttons */}
        <div className="absolute bottom-10 w-full flex items-center justify-center gap-4">
          <button
            onClick={goPrev}
            className="bg-white rounded-full w-12 h-12 text-2xl font-medium hover:bg-gray-100"
          >
            &lt;
          </button>
          <button
            onClick={closeDialog}
            className="bg-white rounded-full w-12 h-12 text-2xl font-medium hover:bg-gray-100"
          >
            x
          </button>
          <button
            onClick={goNext}
            className="bg-white rounded-full w-12 h-12 text-2xl font-medium hover:bg-gray-100"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageDialogueBox;
