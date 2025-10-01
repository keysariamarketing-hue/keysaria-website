import { createWishlist, deleteFromWishlist } from "@/app/api/wishlistAPI";
import { AuthContextType } from "@/context/AuthProvider";
import { fetchWishlistDataThunk } from "@/features/wishlistSlice";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import useAuth from "@/hook/useAuth";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

// Define Props Type
interface AddToWishlistProps {
  productId: string;
  isAddedToWishlist?: string[];
}

const AddToWishlist: React.FC<AddToWishlistProps> = ({
  productId,
  isAddedToWishlist,
}) => {
  const { customerAuth } = useAuth() as AuthContextType;
  const privateAxios = useAxiosPrivate();
  const customerId = customerAuth?.result?.CustomerId;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Add to Wishlist
  const addToWishlist = async () => {
    if (!customerId) {
      toast.error("Please login to add to wishlist");
      router.push("/customer/login");
      return;
    }

    const allData = { privateAxios, customerId, productId };
    const getWishlist = { privateAxios, customerId };

    try {
      await createWishlist(allData);
      dispatch(fetchWishlistDataThunk(getWishlist));
      toast.success("Added to wishlist");
    } catch (error) {
      console.error(error);
    }
  };

  // Remove from Wishlist
  const removeFromWishlist = async () => {
    if (!customerId) return;

    const allData = { privateAxios, productId, customerId };
    const getWishlist = { privateAxios, customerId };

    try {
      const res = await deleteFromWishlist(allData);
      if (res.status === 200) {
        dispatch(fetchWishlistDataThunk(getWishlist));
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={() => {
        if (isAddedToWishlist?.includes(productId)) {
          removeFromWishlist();
        } else {
          addToWishlist();
        }
      }}
    >
      {isAddedToWishlist?.includes(productId) ? (
        <FaHeart className="text-lg text-red-800" />
      ) : (
        <FaRegHeart className="text-lg text-red-800" />
      )}
    </button>
  );
};

export default AddToWishlist;
