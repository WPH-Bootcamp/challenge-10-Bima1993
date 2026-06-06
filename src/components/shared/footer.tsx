"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
} from "react-icons/fa6";

const exploreLinks = [
  "All Food",
  "Nearby",
  "Discount",
  "Best Seller",
  "Delivery",
  "Lunch",
];

const helpLinks = [
  "How to Order",
  "Payment Methods",
  "Track My Order",
  "FAQ",
  "Contact Us",
];

const socialLinks = [
  { label: "Facebook", Icon: FaFacebookF },
  { label: "Instagram", Icon: FaInstagram },
  { label: "LinkedIn", Icon: FaLinkedinIn },
  { label: "TikTok", Icon: FaTiktok },
];

export function Footer() {
  const pathname = usePathname();

  if (["/login", "/register", "/success"].includes(pathname)) {
    return null;
  }

  return (
    <footer className="bg-[#070b0f] text-white">
      <div className="mx-auto grid w-[calc(100%-28px)] max-w-[1200px] grid-cols-2 gap-x-8 gap-y-10 py-12 sm:w-[calc(100%-48px)] sm:py-16 md:grid-cols-[1.35fr_0.8fr_0.8fr] md:gap-[120px] md:py-[82px]">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <Image
              src="/images/Foody-Logo.png"
              alt=""
              width={42}
              height={42}
              className="h-[42px] w-[42px] object-contain"
            />
            <span className="text-[32px] font-extrabold leading-none">
              Foody
            </span>
          </div>
          <p className="mt-6 max-w-[370px] text-[15px] leading-7 text-zinc-300">
            Enjoy homemade flavors & chef&apos;s signature dishes, freshly
            prepared every day. Order online or visit our nearest branch.
          </p>

          <p className="mt-8 text-sm font-bold">Follow on Social Media</p>
          <div className="mt-4 flex gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href="#"
                aria-label={item.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-[18px] text-zinc-100 transition hover:border-red-600 hover:text-red-500"
              >
                <item.Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold">Explore</h2>
          <ul className="mt-6 flex flex-col gap-5 text-sm text-zinc-300">
            {exploreLinks.map((link) => (
              <li key={link}>{link}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold">Help</h2>
          <ul className="mt-6 flex flex-col gap-5 text-sm text-zinc-300">
            {helpLinks.map((link) => (
              <li key={link}>{link}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
