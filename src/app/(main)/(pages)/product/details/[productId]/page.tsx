"use client";
import { addToCart } from "@/app/api/cartAPI";
import { getActiveCouponsAPI } from "@/app/api/couponApi";
import { getProductById } from "@/app/api/publicApis/publicCategories";
import {
  createSandookAPI,
  createSandookProduct,
  getSandookByCustomerId,
} from "@/app/api/sandookApis/sandookAPI";
import ProductDetailLoader from "@/components/loaders/ProductDetailLoader";
import ImgBox from "@/components/product/ImgBox";
import MayAlsoYouLike from "@/components/product/MayAlsoYouLike";
import ProductDetailsContainer from "@/components/product/ProductDetailContainer";
import ProductRating from "@/components/reviews/ProductRating";
import { AuthContextType } from "@/context/AuthProvider";
import { fetchCartDataThunk } from "@/features/cartSlice";
import { fetchSandookDataThunk } from "@/features/sandookSlice";
import { fetchWishlistDataThunk } from "@/features/wishlistSlice";
import useAxiosPrivate from "@/hook/customer/useAxiosPrivate";
import useAuth from "@/hook/useAuth";
import { sandookPincodes } from "@/lib/sandookPincodes";
import { AppDispatch, RootState } from "@/store/store";
import { MyCartType } from "@/types/cartType";
import { Coupon } from "@/types/couponType";
import { ProductStock } from "@/types/productStock";
import { Product } from "@/types/productType";
import { Wishlist } from "@/types/wishlistType";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const privateAxios = useAxiosPrivate();
  const { customerAuth } = useAuth() as AuthContextType;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const customerId = customerAuth.result && customerAuth?.result?.CustomerId;
  const getCart = { customerId, privateAxios };
  const getWishlist = { customerId, privateAxios };
  const getSandookData = { customerId, privateAxios };

  // States
  const [loader, setLoader] = useState(false);
  const [productLoader, setProductLoader] = useState<boolean>(false);
  const [sandookLoader, setSandookLoader] = useState<boolean>(false);
  const [loaderPin] = useState<boolean>(false);

  const [, setDisableButtons] = useState<boolean>(false);
  const [sandookDeliverable, setSandookDeliverable] = useState<boolean>(false);
  const [sandookAvail, setSandookAvail] = useState<boolean>(true);
  const [productData, setProductData] = useState<Product | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [productStockId, setProductStockId] = useState<string | null>(null);
  const [productQuantity, setProductQuantity] = useState<number>(0);
  const [pincode, setPincode] = useState<string>("");
  const [, setError] = useState<string>("");
  const [, setCartData] = useState<MyCartType[]>([]);
  const [sandookId, setSandookId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const wishlist: Wishlist[] = useSelector(
    (state: RootState) => state.wishlistItem.allWishlist
  );
  const [, setIsAddedToWishlist] = useState<string[]>([]);

  // <------------- USE EFFECTS ----------------->
  useEffect(() => {
    if (pincode) {
      setSandookDeliverable(sandookPincodes.includes(parseInt(pincode)));
      setSandookAvail(sandookPincodes.includes(parseInt(pincode)));
    } else {
      setSandookAvail(true);
    }
  }, [pincode]);

  // WISHLIST ITEM
  useEffect(() => {
    setIsAddedToWishlist(
      wishlist && wishlist.length > 0
        ? wishlist.map((item) => item.product.id)
        : []
    );
  }, [wishlist]);

  // DISPATCHED
  useEffect(() => {
    dispatch(fetchCartDataThunk(getCart));
    dispatch(fetchWishlistDataThunk(getWishlist));
    dispatch(fetchSandookDataThunk(getSandookData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, dispatch]);

  //   For Unstictched
  useEffect(() => {
    const initializeUnstitchedAndSareeStock = () => {
      if (
        productData &&
        productData?.type !== "Stitched" &&
        productData?.ProductStock?.length > 0
      ) {
        const unstitchedStock = productData.ProductStock[0];
        setSelectedSize(unstitchedStock.size);
        setSelectedColor(unstitchedStock.color); // Assuming the first product stock index
        setProductStockId(unstitchedStock.id); // Assuming the first product stock ID
      }
    };

    if (productData) {
      initializeUnstitchedAndSareeStock();
    }
  }, [productData]);

  // useEffect(() => {
  //   if (productData) {
  //     if (productStockId) {
  //       if (productData.ProductStock[productStockId]?.quantity) {
  //         setDisableButtons(true);
  //       } else {
  //         setDisableButtons(false);
  //       }
  //     }
  //   }
  // }, [productStockId]);

  useEffect(() => {
    getproductDetails();
    getSandook();

    const storedCartData = localStorage.getItem("cartData");
    if (storedCartData) {
      try {
        setCartData(JSON.parse(storedCartData));
      } catch (error) {
        console.error("Error parsing cart data:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // <---------------- Helper functions --------------------->

  // Selected size
  const selectSize = (size: React.SetStateAction<string>) => {
    setSelectedSize(size);
    setProductQuantity(1);
    setSelectedColor(null);
    setDisableButtons(false);
  };

  // increase quanity
  const increaseQuantity = () => {
    if (productData && productQuantity < productData.ProductStock[0].quantity) {
      setProductQuantity(productQuantity + 1);
    }
  };

  // decrease quanity
  const decreaseQuantity = () => {
    if (productQuantity > 1) {
      setProductQuantity(productQuantity - 1);
    }
  };

  //get product details...............
  const getproductDetails = async () => {
    setProductLoader(true);
    const allData = {
      productId,
      privateAxios,
    };
    try {
      const res = await getProductById(allData);
      console.log(res);

      setProductLoader(false);
      if (res.status === 200) {
        setProductData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getproductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getActiveCoupons = async () => {
    const allData = {
      privateAxios,
    };
    try {
      const res = await getActiveCouponsAPI(allData);
      console.log(res);
      setCoupons(res.data.coupons);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getActiveCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddToCart = async () => {
    if (!selectedColor || !productId || !productStockId || !productData) {
      setError("Please select preferred size and color.");
      toast.warn("Please select a size and color before adding to cart.", {
        position: "top-right",
      });
      return;
    }

    if (productQuantity === 0) {
      toast.warn("Please select a quantity before adding to cart.", {
        position: "top-right",
      });
      return;
    }

    const productStock = productData?.ProductStock?.find(
      (item) => item.id === productStockId
    );
    if (!productStock || productStock.quantity < productQuantity) {
      toast.error("Desired quantity is not available!", {
        position: "top-right",
      });
      return;
    }

    setLoader(true);

    const allData = {
      quantity: productQuantity,
      customerId: customerAuth?.result?.CustomerId,
      productId: productId,
      productStockId: productStockId,
    };

    if (customerAuth?.result?.CustomerId) {
      // Logged-in user
      try {
        const res = await addToCart(privateAxios, allData);
        setLoader(false);

        if (res.status === 200 || res.status === 201) {
          dispatch(fetchCartDataThunk(getCart));
          toast.success("Product added to cart successfully!", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        setLoader(false);
        toast.error("Failed to add product to cart. Please try again.", {
          position: "top-right",
        });
      }
    } else {
      // Guest user (not logged in)
      setLoader(false);

      addtoCartWithoutLogin({
        productId,
        productStockId,
        quantity: productQuantity,
        productStock: productData.ProductStock.find(
          (stock) => stock.id === productStockId
        )!,
      });
    }
  };

  const addtoCartWithoutLogin = async (data: {
    quantity: number;
    productId: string;
    productStockId: string;
    productStock: ProductStock;
  }) => {
    if (!productData) return; // Ensure productData is available

    const allData = {
      quantity: data.quantity,
      productId: data.productId,
      productStockId: data.productStockId,
      product: productData,
      productStock: data.productStock,
    };

    try {
      // Retrieve cart from localStorage
      const cartFromStorage: (typeof allData)[] = JSON.parse(
        localStorage.getItem("cartData") || "[]"
      );

      // Check if the product already exists in the cart
      const existingProductIndex = cartFromStorage.findIndex(
        (item) =>
          item.productId === allData.productId &&
          item.productStockId === allData.productStockId
      );

      if (existingProductIndex !== -1) {
        // If the product exists, update the quantity
        cartFromStorage[existingProductIndex].quantity += allData.quantity;
      } else {
        // If the product doesn't exist, add it as a new item
        cartFromStorage.push(allData);
      }

      // setCartData(cartFromStorage);

      // Update local storage
      localStorage.setItem("cartData", JSON.stringify(cartFromStorage));

      // Update Redux store
      dispatch(fetchCartDataThunk(getCart));

      // Show toast notification
      toast.success("Product added to cart successfully!", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart. Please try again.", {
        position: "top-right",
      });
    }
  };

  // <----------------- SANDOOK FUNCTIONS ---------------------------->
  //get sandook by customer id...............
  const getSandook = async () => {
    if (customerId !== undefined) {
      const allData = { privateAxios, customerId: customerId };

      try {
        const res = await getSandookByCustomerId(allData);
        if (res) {
          if (res.status === 200) {
            console.log("res", res);
            setSandookId(res.data.id);
          }
        }
      } catch (error) {
        console.log(error);
        await createSandook();
      }
    }
  };

  const createSandook = async () => {
    const allData = {
      customerId: customerId,
      privateAxios,
    };
    if (customerId !== undefined) {
      try {
        await createSandookAPI(allData);
        // console.log(res);
        await getSandook();
      } catch (error) {
        console.log("Error to create sandook", error);
      }
    }
  };

  // ✅ Add Product to Sandook
  const handleAddToSandook = async () => {
    console.log("================ SANDOOK TESTING ================");

    if (!customerId) {
      toast.error("Please login to add products to Sandook.", {
        position: "top-right",
      });
      return;
    }

    if (productData?.type === "Stitched" || !selectedColor) {
      toast.error("Please select a preferred size and color.", {
        position: "top-right",
      });
      return;
    }

    if (productQuantity === 0) {
      toast.warn("Please select a quantity before adding to cart.", {
        position: "top-right",
      });
      return;
    }

    // 2️⃣ Ensure we have a valid product & stock
    const productStock = productData?.ProductStock?.find(
      (item: ProductStock) => item.id === productStockId
    );
    if (!productStock || productStock.quantity < productQuantity) {
      toast.error("Desired quantity is not available!", {
        position: "top-right",
      });
      return;
    }

    const allData = {
      privateAxios,
      sandokId: sandookId!,
      productId: productData!.id,
      productStockId: productStock.id,
      quantity: productQuantity,
    };

    console.log("Adding to Sandook:", allData);

    setSandookLoader(true);
    try {
      const res = await createSandookProduct(allData);
      setSandookLoader(false);

      if (res.status === 201) {
        dispatch(fetchSandookDataThunk({ customerId, privateAxios }));
        toast.success("Product added to Sandook!");
      }
    } catch (error) {
      setSandookLoader(false);
      console.error("Error adding product to Sandook:", error);
      toast.error("Failed to add product to Sandook. Please try again.");
    }
  };

  const checkForAvailibility = () => {};

  const handleBuyNow = async () => {
    // check if user is logged in, if not navigate to login page
    // if logged in
    // check if product is available in stock
    // if available, add to cart and navigate to checkout page
    // if not available, show error message

    if (!customerId) {
      toast.warn("Please login to proceed with Buy Now!", {
        position: "top-right",
      });
      router.push("/customer/login");
      return;
    }

    if (!selectedColor || !productId || !productStockId || !productData) {
      setError("Please select preferred size and color.");
      toast.warn("Please select a size and color before adding to cart.", {
        position: "top-right",
      });
      return;
    }

    if (productQuantity === 0) {
      toast.warn("Please select a quantity before adding to cart.", {
        position: "top-right",
      });
      return;
    }

    // 2️⃣ Ensure we have a valid product & stock
    const productStock = productData?.ProductStock?.find(
      (item) => item.id === productStockId
    );
    if (!productStock || productStock.quantity < productQuantity) {
      toast.error("Desired quantity is not available!", {
        position: "top-right",
      });
      return;
    }

    const allData = {
      quantity: productQuantity,
      customerId: customerAuth?.result?.CustomerId,
      productId: productId,
      productStockId: productStockId,
    };

    try {
      const res = await addToCart(privateAxios, allData);
      setLoader(false);

      if (res.status === 200 || res.status === 201) {
        dispatch(fetchCartDataThunk(getCart));
        toast.success("Heading to checkout!", {
          position: "top-right",
        });
        router.push("/product/checkout");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setLoader(false);
      toast.error("Failed to add product to cart. Please try again.", {
        position: "top-right",
      });
    }
  };

  return productLoader ? (
    <ProductDetailLoader />
  ) : (
    <div className={`sm:p-0 md:p-12 lg:p-5`}>
      <div className="lg:px-10 px-2 border-0">
        {/* Flex div */}
        <div className="flex flex-col md:flex-row md:gap-x-10">
          {/* Images part */}
          <div className="md:w-[55%] flex items-start border-0 border-purple-600">
            <div className={`${isDialogOpen ? "block" : "sticky"} top-24`}>
              <div className="lg:h-full w-full object-cover rounded-lg mb-4">
                {productData && (
                  <ImgBox
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                    images={productData.productImage}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Details part */}
          {productData && (
            <ProductDetailsContainer
              productData={productData!}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              productQuantity={productQuantity}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              setSelectedColor={setSelectedColor}
              // setProductStockId={setProductStockId}
              selectSize={selectSize}
              setPincode={setPincode}
              pincode={pincode}
              checkForAvailibility={checkForAvailibility}
              loaderPin={loaderPin}
              sandookDelivarable={sandookDeliverable}
              sandookAvail={sandookAvail}
              handleAddToSandook={handleAddToSandook}
              // disableButtons={disableButtons}
              sandookLoader={sandookLoader}
              coupons={coupons}
              loader={loader}
              // error={error}
            />
          )}
        </div>
      </div>
      {productData && productData.reviewAndRating && (
        <div className="lg:px-10 px-2 lg:pt-10 overflow-hidden">
          <ProductRating
            productId={productId}
            reviewAndRating={productData.reviewAndRating}
            heading="REVIEWS"
            askReview={true}
          />
        </div>
      )}
      {/* last section */}
      {productData && (
        <div className="lg:px-10 px-2 lg:py-2 pb-20 overflow-hidden">
          <MayAlsoYouLike
            id={productData.collectionId}
            currentProductID={productData.id}
          />
        </div>
      )}

      <div className="flex items-center justify-center mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-x-2 w-fit py-3 px-12 font-meta bg-black font-normal hover:bg-black/70 text-white"
        >
          <FaArrowLeftLong />
          Back
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
