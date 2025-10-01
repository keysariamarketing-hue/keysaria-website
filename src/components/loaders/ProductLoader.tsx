import { Typography } from "@/context/ThemeProvider";

const ProductsLoader = () => {
  const size = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <>
      <div className="grid mt-2 grid-cols-2 md:grid-cols-4 pb-20 justify-center sm:grid-cols-2 lg:px-10 px-2 lg:gap-8 gap-2">
        {size.map((item, index) => (
          <div key={index} className="mt-6 lg:h-52 animate-pulse mb-10">
            <div className="relative mb-5 grid lg:h-52 h-32 place-items-center bg-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-12 w-12 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
            <div>
              <Typography
                as="div"
                variant="h1"
                className="mb-4 h-3 lg:w-52 md:w-32 sm:w-20 w-12 rounded-full bg-gray-300"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                &nbsp;
              </Typography>
              <Typography
                as="div"
                variant="paragraph"
                className="mb-2 h-2 w-28 rounded-full bg-gray-300"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                &nbsp;
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductsLoader;
