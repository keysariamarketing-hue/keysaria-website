import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";
import bgImg from "../../../../../public/banner/style-dress.jpg";

const AboutPage = () => {
  return (
    <>
      <section className=" overflow-hidden bg-gray-50 ">
        <section className="flex flex-col-reverse px-6 justify-between gap-6 py-4 sm:gap-10 md:gap-16 lg:flex-row">
          <div className="flex flex-col justify-between xl:w-5/12">
            <div className="text-center lg:py-8 lg:text-left xl:py-14">
              <p className="mb-4 text-center md:text-left font-erstoria font-semibold text-gray-600 md:mb-6 md:text-lg xl:text-xl">
                Proudly Introducing
              </p>
              <h1 className="mb-2 text-4xl font-bold font-erstoria text-black sm:text-5xl md:mb-4 md:text-5xl">
                Weaving Stories of Tradition and Luxury
              </h1>
              <p className="my-4 text-gray-800 italic">
                {" "}
                Founded with a passion for preserving and promoting India&apos;s
                rich textile heritage, we bring to you timeless treasures from
                the heart of the country. Our curated collection features the
                finest weaves from Banaras, Maheshwar, Rajasthan, West Bengal,
                Gujarat, and Punjab, showcasing exquisite unstitched suits,
                stitched ensembles, and sarees.{" "}
              </p>{" "}
              <p className="my-4 text-gray-800">
                {" "}
                Inspired by an enduring love for Indian crafts and ethnic
                clothing, Saurabh and Neetika transitioned from successful
                careers in multinational corporations to follow their true
                calling. Driven by a vision to revive India&apos;s artisanal
                legacy, they embarked on a journey to merge traditional textiles
                with contemporary appeal, creating opportunities for local
                artisans and celebrating the boundless beauty of Indian fabrics
                and silhouettes.{" "}
              </p>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href="/"
                  className="inline-block rounded-lg bg-white border border-black px-8 py-3 text-center text-sm font-semibold text-black outline-none ring-indigo-300 transition duration-100 hover:bg-black hover:text-white focus-visible:ring md:text-base"
                >
                  Shop now
                </Link>
              </div>
              <div className="flex items-center mt-16 pl-1 justify-center gap-4 lg:justify-start">
                <span className="text-sm font-semibold uppercase tracking-widest text-black sm:text-base">
                  Socials
                </span>
                <span className="h-px w-12 bg-gray-200"></span>

                <div className="flex gap-x-2 ">
                  <a
                    href="#"
                    target="_blank"
                    className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600"
                  >
                    <FaInstagram size={28} />
                  </a>

                  <a
                    href="#"
                    target="_blank"
                    className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600"
                  >
                    <FaFacebook size={26} />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600"
                  >
                    <FaYoutube size={28} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="h-60 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:h-fit xl:w-5/12">
            <Image
              src={bgImg}
              loading="lazy"
              alt="Photo by Fakurian Design"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </section>
      </section>
    </>
  );
};

export default AboutPage;
