"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut, MapPin, Package, Search, Star } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useCart } from "@/lib/query/use-cart";
import { useProfile } from "@/lib/query/use-auth";
import { useRestaurants } from "@/lib/query/use-restaurants";
import { useAuthStore } from "@/store/auth-store";

const pageContainer =
  "mx-auto w-[calc(100%-32px)] max-w-[1200px] sm:w-[calc(100%-48px)]";
const heroHeaderContainer = "w-full px-4 sm:px-8 lg:px-[120px]";

const categoryShortcuts = [
  {
    label: "All Restaurant",
    image: "/images/All-Restaurant.png",
    href: "/category",
  },
  { label: "Nearby", image: "/images/Nearby.png", href: "/category?range=5" },
  {
    label: "Discount",
    image: "/images/Discount.png",
    href: "/category?category=discount",
  },
  {
    label: "Best Seller",
    image: "/images/Best-Seller.png",
    href: "/category?rating=5",
  },
  {
    label: "Delivery",
    image: "/images/Delivery.png",
    href: "/category?category=delivery",
  },
  { label: "Lunch", image: "/images/Lunch.png", href: "/category?category=lunch" },
];

function readHomeParams(searchParams: URLSearchParams) {
  return {
    q: searchParams.get("q") ?? undefined,
    range: searchParams.get("range") ?? undefined,
    rating: searchParams.get("rating") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    limit: "12",
  };
}

function getInitial(name?: string) {
  return name?.trim().charAt(0).toUpperCase() || "U";
}

function formatRestaurantPlace(place: string) {
  if (place.includes("km") || place.includes(" - ") || place.includes("\u00b7")) {
    return place;
  }

  return `${place} \u00b7 2.4 km`;
}

export function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const params = readHomeParams(searchParams);
  const [searchValue, setSearchValue] = useState(params.q ?? "");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { data, isLoading, isError } = useRestaurants(params);
  const { data: cartData } = useCart(Boolean(token));
  const { data: profile } = useProfile(Boolean(token));
  const restaurants = data?.data.restaurants ?? [];
  const totalItems = cartData?.data.summary.totalItems ?? 0;

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextParams = new URLSearchParams(searchParams.toString());

    if (searchValue.trim()) {
      nextParams.set("q", searchValue.trim());
    } else {
      nextParams.delete("q");
    }

    const query = nextParams.toString();
    router.push(query ? `/category?${query}` : "/category");
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="relative flex min-h-[550px] flex-col overflow-hidden text-white sm:min-h-[720px] lg:min-h-[827px]">
        <Image
          src="/images/login-burger.png"
          alt="Burger hero"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

        <div
          className={`${heroHeaderContainer} relative z-30 flex items-center justify-between py-4 sm:py-5`}
        >
          <Link href="/" className="flex cursor-pointer items-center gap-3">
            <Image
              src="/images/Foody-Logo.png"
              alt=""
              width={42}
              height={42}
              priority
              className="h-10 w-10 object-contain sm:h-[42px] sm:w-[42px]"
            />
            <span className="hidden text-[28px] font-extrabold leading-none text-white sm:inline">
              Foody
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {token ? (
              <>
                <Link href="/cart" className="relative cursor-pointer" aria-label="Cart">
                  <Image
                    src="/images/Cart.png"
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain"
                  />
                  {totalItems > 0 ? (
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-semibold">
                      {totalItems}
                    </span>
                  ) : null}
                </Link>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((value) => !value)}
                  className="flex cursor-pointer items-center gap-3"
                  aria-expanded={isProfileMenuOpen}
                  aria-label="Open profile menu"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                    {getInitial(profile?.name)}
                  </span>
                  <span className="hidden text-base font-semibold sm:inline">
                    {profile?.name ?? "John Doe"}
                  </span>
                </button>

                {isProfileMenuOpen ? (
                  <div className="absolute right-0 top-[64px] z-40 w-[214px] rounded-[18px] bg-white p-4 text-zinc-950 shadow-[0_16px_45px_rgba(0,0,0,0.24)] sm:top-[74px] sm:w-[250px] sm:p-5">
                    <Link
                      href="/profile"
                      className="flex cursor-pointer items-center gap-3 pb-4"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                        {getInitial(profile?.name)}
                      </span>
                      <span className="text-base font-extrabold">
                        {profile?.name ?? "John Doe"}
                      </span>
                    </Link>

                    <div className="flex flex-col gap-4 border-t border-zinc-200 pt-4 text-[15px] font-medium">
                      <button
                        type="button"
                        className="flex cursor-pointer items-center gap-3 text-left"
                      >
                        <MapPin className="h-5 w-5" />
                        Delivery Address
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push("/orders")}
                        className="flex cursor-pointer items-center gap-3 text-left"
                      >
                        <Package className="h-5 w-5" />
                        My Orders
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          clearToken();
                          window.location.replace("/");
                        }}
                        className="flex cursor-pointer items-center gap-3 text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex h-11 w-[112px] cursor-pointer items-center justify-center rounded-full border-2 border-white/90 text-sm font-bold text-white transition hover:bg-white/10 sm:h-12 sm:w-40"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex h-11 w-[112px] cursor-pointer items-center justify-center rounded-full bg-white text-sm font-bold text-zinc-950 transition hover:bg-zinc-100 sm:h-12 sm:w-40"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        <div
          className={`${pageContainer} relative z-10 flex flex-1 flex-col items-center justify-center pb-16 text-center sm:pb-20 lg:pb-[106px]`}
        >
          <h1 className="max-w-[360px] text-[30px] font-extrabold leading-tight sm:max-w-4xl sm:text-[34px] md:text-[44px]">
            Explore Culinary Experiences
          </h1>
          <p className="mt-3 max-w-[330px] text-base font-semibold leading-7 sm:max-w-3xl sm:text-lg md:text-[21px] md:leading-8">
            Search and refine your choice to discover the perfect restaurant.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex h-[54px] w-full max-w-[600px] items-center gap-3 rounded-full bg-white px-5 text-zinc-900 shadow-[0_16px_50px_rgba(0,0,0,0.18)] sm:h-14 sm:px-6"
          >
            <Search className="h-5 w-5 text-zinc-500" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search restaurants, food and drink"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
            />
          </form>
        </div>
      </section>

      <section className={`${pageContainer} pb-[96px] pt-8 sm:pt-12`}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-[repeat(6,160px)] lg:justify-between">
          {categoryShortcuts.map((category) => {
            return (
              <Link
                key={category.label}
                href={category.href}
                className="group flex cursor-pointer flex-col items-center gap-3 text-center sm:gap-[14px]"
              >
                <span className="flex h-[86px] w-full max-w-[92px] items-center justify-center rounded-[14px] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.07)] transition group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_34px_rgba(15,23,42,0.1)] sm:h-[100px] sm:max-w-[160px] sm:rounded-[16px]">
                  <Image
                    src={`${category.image}?v=2`}
                    alt={category.label}
                    width={65}
                    height={65}
                    unoptimized
                    className="h-[54px] w-[54px] object-contain sm:h-[65px] sm:w-[65px]"
                  />
                </span>
                <span className="text-sm font-bold text-zinc-950 sm:text-base">
                  {category.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-[54px] flex items-center justify-between gap-4">
          <h2 className="text-[24px] font-extrabold leading-tight text-zinc-950 md:text-[32px]">
            Recommended
          </h2>
          <Link href="/category" className="cursor-pointer text-sm font-bold text-[#df1f18] sm:text-base">
            See All
          </Link>
        </div>

        {isLoading ? (
          <p className="mt-8 text-sm text-zinc-600">Memuat restoran...</p>
        ) : null}

        {isError ? (
          <p className="mt-8 text-sm text-red-600">
            Gagal memuat restoran. Coba lagi nanti.
          </p>
        ) : null}

        {!isLoading && !isError && restaurants.length === 0 ? (
          <p className="mt-8 rounded-2xl bg-zinc-50 p-6 text-sm text-zinc-600">
            Restoran tidak ditemukan.
          </p>
        ) : null}

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant, index) => (
            <Link
              key={restaurant.id}
              href={`/resto/${restaurant.id}`}
              className={`${index >= 5 ? "hidden md:block" : ""} min-h-[112px] cursor-pointer rounded-[16px] bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.1)] sm:min-h-[152px] sm:p-4`}
            >
              <article className="grid grid-cols-[88px_1fr] gap-3 sm:grid-cols-[120px_1fr] sm:gap-4">
                <div className="relative h-[88px] w-[88px] overflow-hidden rounded-[10px] bg-[#fff3df] sm:h-[120px] sm:w-[120px]">
                  <Image
                    src={restaurant.logo}
                    alt={`${restaurant.name} logo`}
                    fill
                    sizes="120px"
                    className="object-contain p-2 sm:p-3"
                  />
                </div>

                <div className="min-w-0 py-1 sm:py-3">
                  <h3 className="truncate text-base font-extrabold text-zinc-950 sm:text-lg">
                    {restaurant.name}
                  </h3>
                  <p className="mt-2 flex items-center gap-2 text-sm font-medium text-zinc-950 sm:mt-3">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {restaurant.star}
                  </p>
                  <p className="mt-3 truncate text-sm font-medium text-zinc-700 sm:mt-4">
                    {formatRestaurantPlace(restaurant.place)}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {restaurants.length > 0 ? (
          <div className="mt-9 flex justify-center">
            <button
              type="button"
              className="h-12 min-w-[160px] cursor-pointer rounded-full border border-zinc-300 bg-white px-10 text-sm font-bold text-zinc-950 shadow-sm transition hover:border-zinc-400"
            >
              Show More
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
