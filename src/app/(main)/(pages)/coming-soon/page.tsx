import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <section className="flex items-center py-28 p-16 bg-gray-100 dark:bg-gray-900">
      <div className="container flex flex-col items-center ">
        <div className="flex flex-col gap-6 max-w-md text-center">
          <h2 className="font-extrabold text-5xl md:text-7xl text-color">
            Coming Soon!
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            We are working hard to bring something amazing for you.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Stay tuned for updates. Meanwhile, explore other sections of our
            website.
          </p>
          <div>
            <Link
              href="/"
              className="px-8 py-3 text-xl font-normal cta text-white"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
