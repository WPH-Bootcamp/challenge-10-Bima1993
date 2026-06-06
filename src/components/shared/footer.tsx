"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

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
  { label: "Facebook", text: "f" },
  { label: "Instagram", text: "ig" },
  { label: "LinkedIn", text: "in" },
  { label: "TikTok", text: "t" },
];

export function Footer() {
  const pathname = usePathname();

  if (["/login", "/register", "/success"].includes(pathname)) {
    return null;
  }

  return (
    <footer className="bg-zinc-950 px-6 py-14 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image
            src="/images/Foody Logo Login.png"
            alt="Foody"
            width={142}
            height={44}
          />
          <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-300">
            Enjoy homemade flavors & chef&apos;s signature dishes, freshly
            prepared every day. Order online or visit our nearest branch.
          </p>

          <p className="mt-8 text-sm font-semibold">Follow on Social Media</p>
          <div className="mt-4 flex gap-3">
            {socialLinks.map((item) => (
              <span
                key={item.label}
                aria-label={item.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-sm font-semibold"
              >
                {item.text}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-5 flex flex-col gap-4 text-sm text-zinc-300">
            {exploreLinks.map((link) => (
              <li key={link}>{link}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Help</h2>
          <ul className="mt-5 flex flex-col gap-4 text-sm text-zinc-300">
            {helpLinks.map((link) => (
              <li key={link}>{link}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
