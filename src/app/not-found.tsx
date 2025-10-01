"use client";
import Link from "next/link";
import React from "react";

const ErrorPage = () => {
  return (
    <section className="flex items-center py-28 p-16">
      <div className="container flex flex-col items-center ">
        <div className="flex flex-col gap-6 max-w-md text-center">
          <h2 className="font-extrabold text-9xl text-color">
            <span className="sr-only">Error</span>4
            <span className="text-gray-400">0</span>4
          </h2>
          <p className="text-2xl md:text-3xl dark:text-gray-300">
            Sorry, we couldn&apos;t find this page.
          </p>
          <p>
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <div>
            <Link
              href="/"
              className="px-8 py-3 text-xl font-normal cta text-white"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
