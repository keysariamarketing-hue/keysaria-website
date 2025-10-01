"use client";
import { CircleX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Logo from "../../../public/logo.jpeg";
import {
  CurationOfKeysaria,
  Saree,
  StitchedCollection,
  UnstitchedSuits,
} from "@/lib/navitem";
import { PersistLoader } from "../general/PersistLoader";
import { Drawer, IconButton } from "@/context/ThemeProvider";

// ✅ Type for Nav Items
interface NavItem {
  name: string;
  id?: string;
  link?: string;
}

// ✅ Props Type for MobileDrawer
interface MobileDrawerProps {
  open: boolean;
  closeDrawer: () => void;
  customerAuth: {
    accessToken?: string;
    result?: {
      CustomerName?: string;
      CustomerId?: string;
      email?: string;
    };
  };
  logoutCustomer: () => void;
  tokenLoader: boolean;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  open,
  closeDrawer,
  customerAuth,
  logoutCustomer,
  tokenLoader,
}) => {
  const router = useRouter();

  return (
    <Drawer
      open={open}
      onClose={closeDrawer}
      className="p-4 min-h-screen overflow-y-scroll"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      {/* Logo and Close Button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="pt-4 lg:px-2">
          <Link href="/" className="font-bold text-2xl sm:text-3xl flex">
            <Image src={Logo} alt="Logo" className="w-24" />
          </Link>
        </div>
        <IconButton
          variant="text"
          onClick={closeDrawer}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <CircleX />
        </IconButton>
      </div>

      {/* Navigation Links */}
      <div className="justify-center">
        <ul className="sm:flex flex-col items-center space-y-2 font-medium">
          {/* Unstitched Collection */}
          <li className="group relative cursor-pointer flex w-full justify-start">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="unstitched" className="px-2 py-1 border-y">
                <AccordionTrigger className="font-meta font-bold text-lg">
                  Unstitched Collection
                </AccordionTrigger>
                {UnstitchedSuits?.map((item: NavItem, index: number) => (
                  <AccordionContent key={index}>
                    <Link
                      href={`/collection/${item.name}/${item.id}`}
                      onClick={closeDrawer}
                      className="flex hover:text-color font-meta font-bold duration-200 items-center gap-2 rounded-lg text-black mt-2"
                    >
                      {item.name}
                    </Link>
                  </AccordionContent>
                ))}
              </AccordionItem>
            </Accordion>
          </li>

          {/* Sarees */}
          <li className="group relative cursor-pointer flex w-full justify-start">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="sarees" className="px-2 py-1 border-b">
                <AccordionTrigger className="font-meta font-bold text-lg">
                  Sarees
                </AccordionTrigger>
                {Saree?.map((item: NavItem, index: number) => (
                  <AccordionContent key={index}>
                    <Link
                      href={`/collection/${item.name}/${item.id}`}
                      onClick={closeDrawer}
                      className="flex hover:text-color duration-200 font-meta font-bold items-center gap-2 rounded-lg text-black mt-2"
                    >
                      {item.name}
                    </Link>
                  </AccordionContent>
                ))}
              </AccordionItem>
            </Accordion>
          </li>

          {/* Stitched Collection */}
          <li className="group relative cursor-pointer flex w-full justify-start">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="stitched" className="px-2 py-1 border-b">
                <AccordionTrigger className="font-meta font-bold text-lg">
                  Stitched Collection
                </AccordionTrigger>
                {StitchedCollection?.map((item: NavItem, index: number) => (
                  <AccordionContent key={index}>
                    <Link
                      href={`/coming-soon`}
                      onClick={closeDrawer}
                      className="flex hover:text-color duration-200 font-meta font-bold items-center gap-2 rounded-lg text-black mt-2"
                    >
                      {item.name}
                    </Link>
                  </AccordionContent>
                ))}
              </AccordionItem>
            </Accordion>
          </li>
        </ul>
      </div>

      {/* Curation of Keysaria */}
      <li className="group relative cursor-pointer flex w-full justify-start">
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="curation" className="px-2 py-1 border-y">
            <AccordionTrigger className="font-meta font-bold text-lg">
              Curation of Keysaria
            </AccordionTrigger>
            {CurationOfKeysaria?.map((item: NavItem, index: number) => (
              <AccordionContent key={index}>
                <Link
                  href={item.link ?? "/"}
                  onClick={closeDrawer}
                  className="flex hover:text-color font-meta font-bold duration-200 items-center gap-2 rounded-lg text-black mt-2"
                >
                  {item.name}
                </Link>
              </AccordionContent>
            ))}
          </AccordionItem>
        </Accordion>
      </li>

      {/* Bestsellers */}
      <li className="group relative cursor-pointer flex w-full justify-start">
        <div className="w-full">
          <div className="px-2 py-5 border-y">
            <Link href={`/bestsellers`} onClick={closeDrawer}>
              <div className="font-meta font-bold text-lg">Bestsellers</div>
            </Link>
          </div>
        </div>
      </li>

      {/* Reviews */}
      <li className="group relative cursor-pointer flex w-full justify-start">
        <div className="w-full">
          <div className="px-2 py-5 border-y">
            <Link href={`/reviews`} onClick={closeDrawer}>
              <div className="font-meta font-bold text-lg">Reviews</div>
            </Link>
          </div>
        </div>
      </li>

      {/* Authentication Buttons */}
      {tokenLoader ? (
        <PersistLoader />
      ) : (
        <div className="grid grid-cols-2 gap-2 pb-36 mt-10">
          {customerAuth?.accessToken === undefined ? (
            <>
              <button
                className="input-border rounded-md font-meta font-bold p-2"
                onClick={() => {
                  router.push("/customer/signup");
                  closeDrawer();
                }}
              >
                SignUp
              </button>
              <button
                onClick={() => {
                  router.push("/customer/login");
                  closeDrawer();
                }}
                className="cta rounded-md p-2 font-meta font-bold px-4 text-white"
              >
                SignIn
              </button>
            </>
          ) : (
            <>
              <Link
                href="/dashboard/customer"
                onClick={closeDrawer}
                className="cta rounded-md p-2 text-center px-4 text-white"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logoutCustomer();
                  closeDrawer();
                }}
                className="cta rounded-md p-2 px-4 text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </Drawer>
  );
};

export default MobileDrawer;
