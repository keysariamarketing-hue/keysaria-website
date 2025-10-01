"use client";
import { Bestsellers } from "@/components/home/Bestsellers";
import CategoryHeaderCarousel from "@/components/home/CategoryHeaderCarousel";
import CategoryProduct from "@/components/home/CategoryProduct";
import NewArrivals from "@/components/home/NewArrivals";
import NewHero from "@/components/home/NewHero";
import PreFooter from "@/components/home/PreFooter";
import { RealVideoSection } from "@/components/home/ReelVideoSection";
import SpecialOffer from "@/components/home/SpecialOffer";
import dynamic from "next/dynamic";

// Dynamically Import Components (Lazy Load)
const HomeCollectionProducts = dynamic(
  () => import("@/components/home/HomeCollectionProduct"),
  { ssr: false, loading: () => <p>Loading Collection...</p> }
);

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 flex flex-col gap-y-8 md:gap-y-8">
      {/* Hero Section */}
      <div className="flex flex-col gap-y-3">
        <CategoryHeaderCarousel />
        <NewHero />
      </div>

      {/* New Arrivals */}
      <NewArrivals />

      {/* Video Section */}
      <RealVideoSection />

      <Bestsellers />

      {/* Home Collections */}
      {[
        { id: "5d1bc03f-52e5-492d-a89f-4343a6550ad4", name: "Ghoomar" },
        { id: "4b506c0b-a4cd-4256-85be-607c412170c8", name: "Navrani" },
        { id: "f08843b0-39fd-4be5-8ee3-f81ea0e6d6b6", name: "Rajwada" },
        { id: "551d5fab-f05d-4217-bbda-0aa32b1939fa", name: "Bindani" },
        { id: "e42b8020-a541-4095-bfdc-2f89621cfa19", name: "Utsav" },
        { id: "74b08219-f66b-4db8-b239-035bd1f7ce09", name: "Bandhani Saree" },
      ].map((collection) => (
        <div key={collection.id} className="flex flex-col gap-y-3 md:gap-y-6">
          <HomeCollectionProducts
            collectionID={collection.id}
            collectionName={collection.name}
          />
        </div>
      ))}

      <CategoryProduct />

      <SpecialOffer />
      <PreFooter />
    </div>
  );
}
