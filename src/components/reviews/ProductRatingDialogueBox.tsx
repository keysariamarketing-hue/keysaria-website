"use client";

import { AuthContextType } from "@/context/AuthProvider";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import useAuth from "@/hook/useAuth";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { submitRating } from "@/app/api/ratingApi";

interface ProductRatingDialogueBoxProps {
  productId: string;
  setIsOpen: (isOpen: boolean) => void;
}

const ProductRatingDialogueBox: React.FC<ProductRatingDialogueBoxProps> = ({
  productId,
  setIsOpen,
}) => {
  const { customerAuth } = useAuth() as AuthContextType;
  const privateAxios = useAxiosPrivate();
  const router = useRouter();
  const customerId = customerAuth?.result?.CustomerId;

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  const handleStarClick = (index: number) => {
    setRating(index);
  };

  const handleSubmit = async () => {
    const allData = {
      rating,
      comment: reviewText,
      productId,
      customerId,
    };

    if (customerId) {
      try {
        const res = await submitRating(privateAxios, allData);
        if (res.status === 201 || res.status === 200) {
          toast.success("Your review was added successfully!", {
            position: "top-right",
          });
        }
        closeDialogue();
      } catch (err) {
        console.log(err);
        closeDialogue();
        toast.error("Failed to submit your review. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  const closeDialogue = () => setIsOpen(false);

  if (!customerId) {
    router.push("/customer/login");
    return null;
  }

  return (
    <div className="fixed flex items-center justify-center p-5 inset-0 bg-black bg-opacity-70 z-40 pointer-events-auto">
      <div className="bg-white lg:w-[50vw] w-96 p-6 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={closeDialogue}
        >
          <X size={24} />
        </button>

        {/* Modal Content */}
        <h2 className="text-xl font-semibold">Rate & Review</h2>

        {/* Star Rating */}
        <div className="flex justify-center gap-1 mt-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <FaStar
              key={index}
              size={30}
              className={`cursor-pointer transition-colors ${
                index <= (hoverRating || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHoverRating(index)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleStarClick(index)}
            />
          ))}
        </div>

        {/* Review Text */}
        <textarea
          placeholder="Write your review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="mt-4 w-full border rounded-lg p-2"
          rows={3}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={closeDialogue}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || reviewText.trim() === ""}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductRatingDialogueBox;
