"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, ShoppingBag, SlidersHorizontal, Star, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useCart } from "@/lib/query/use-cart";
import { useProfile } from "@/lib/query/use-auth";
import { useRestaurants } from "@/lib/query/use-restaurants";
import { useAuthStore } from "@/store/auth-store";
import type { RestaurantFilterParams } from "@/types/resto";

const pageContainer =
  "mx-auto w-[calc(100%-32px)] max-w-[1200px] sm:w-[calc(100%-48px)]";

const distanceOptions = [
  { label: "Nearby", value: "5" },
  { label: "Within 1 km", value: "1" },
  { label: "Within 3 km", value: "3" },
  { label: "Within 5 km", value: "5" },
];

const ratingOptions = ["5", "4", "3", "2", "1"];

function readParams(searchParams: URLSearchParams): RestaurantFilterParams {
  return {
    q: searchParams.get("q") ?? undefined,
    range: searchParams.get("range") ?? undefined,
    priceMin: searchParams.get("priceMin") ?? undefined,
    priceMax: searchParams.get("priceMax") ?? undefined,
    rating: searchParams.get("rating") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    limit: "12",
  };
}

function getInitial(name?: string) {
  return name?.trim().charAt(0).toUpperCase() || "U";
}

function formatPlace(place: string) {
  if (place.includes("km") || place.includes(" - ")) {
    return place;
  }

  return `${place} - 2.4 km`;
}

export function CategoryPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const token = useAuthStore((state) => state.token);
  const params = readParams(searchParams);
  const [searchValue, setSearchValue] = useState(params.q ?? "");
  const [priceMin, setPriceMin] = useState(params.priceMin ?? "");
  const [priceMax, setPriceMax] = useState(params.priceMax ?? "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data, isLoading, isError } = useRestaurants(params);
  const { data: cartData } = useCart(Boolean(token));
  const { data: profile } = useProfile(Boolean(token));
  const restaurants = data?.data.restaurants ?? [];
  const totalItems = cartData?.data.summary.totalItems ?? 0;

  function replaceParams(nextParams: URLSearchParams) {
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  function updateParam(key: string, value?: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    replaceParams(nextParams);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateParam("q", searchValue.trim() || undefined);
  }

  function applyPriceFilter() {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (priceMin.trim()) {
      nextParams.set("priceMin", priceMin.trim());
    } else {
      nextParams.delete("priceMin");
    }

    if (priceMax.trim()) {
      nextParams.set("priceMax", priceMax.trim());
    } else {
      nextParams.delete("priceMax");
    }

    replaceParams(nextParams);
  }

  const filterContent = (
    <>
      <h2 className="text-base font-extrabold text-zinc-950">FILTER</h2>

      <div className="mt-6">
        <p className="text-base font-extrabold text-zinc-950">Distance</p>
        <div className="mt-4 flex flex-col gap-4">
          {distanceOptions.map((option) => (
            <label
              key={`${option.label}-${option.value}`}
              className="flex cursor-pointer items-center gap-3 text-sm text-zinc-800"
            >
              <input
                type="checkbox"
                checked={params.range === option.value}
                onChange={() =>
                  updateParam(
                    "range",
                    params.range === option.value ? undefined : option.value
                  )
                }
                className="h-5 w-5 rounded border-zinc-300 accent-red-600"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-zinc-200 pt-5">
        <p className="text-base font-extrabold text-zinc-950">Price</p>
        <div className="mt-4 grid gap-3">
          <div className="flex h-12 overflow-hidden rounded-lg border border-zinc-300">
            <span className="flex w-12 items-center justify-center bg-zinc-100 text-sm font-bold">
              Rp
            </span>
            <input
              value={priceMin}
              onChange={(event) => setPriceMin(event.target.value)}
              onBlur={applyPriceFilter}
              inputMode="numeric"
              placeholder="Minimum Price"
              className="min-w-0 flex-1 px-3 text-sm outline-none placeholder:text-zinc-500"
            />
          </div>
          <div className="flex h-12 overflow-hidden rounded-lg border border-zinc-300">
            <span className="flex w-12 items-center justify-center bg-zinc-100 text-sm font-bold">
              Rp
            </span>
            <input
              value={priceMax}
              onChange={(event) => setPriceMax(event.target.value)}
              onBlur={applyPriceFilter}
              inputMode="numeric"
              placeholder="Maximum Price"
              className="min-w-0 flex-1 px-3 text-sm outline-none placeholder:text-zinc-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-zinc-200 pt-5">
        <p className="text-base font-extrabold text-zinc-950">Rating</p>
        <div className="mt-4 flex flex-col gap-4">
          {ratingOptions.map((rating) => (
            <label
              key={rating}
              className="flex cursor-pointer items-center gap-3 text-sm text-zinc-800"
            >
              <input
                type="checkbox"
                checked={params.rating === rating}
                onChange={() =>
                  updateParam(
                    "rating",
                    params.rating === rating ? undefined : rating
                  )
                }
                className="h-5 w-5 rounded border-zinc-300 accent-red-600"
              />
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              {rating}
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-zinc-100 bg-white">
        <div className={`${pageContainer} flex h-[72px] items-center justify-between`}>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/Foody-Logo.png"
              alt=""
              width={30}
              height={30}
              className="h-[30px] w-[30px] object-contain"
            />
            <span className="text-lg font-extrabold text-zinc-950">Foody</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative" aria-label="Cart">
              <ShoppingBag className="h-5 w-5 text-zinc-950" />
              {totalItems > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              ) : null}
            </Link>
            {token ? (
              <Link href="/profile" className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {getInitial(profile?.name)}
                </span>
                <span className="hidden text-sm font-semibold text-zinc-950 sm:inline">
                  {profile?.name ?? "John Doe"}
                </span>
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-zinc-950">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className={`${pageContainer} pb-20 pt-10`}>
        <h1 className="text-2xl font-extrabold text-zinc-950">All Restaurant</h1>

        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="mt-6 flex h-14 w-full items-center justify-between rounded-xl bg-white px-4 text-sm font-extrabold text-zinc-950 shadow-[0_12px_30px_rgba(15,23,42,0.06)] lg:hidden"
        >
          FILTER
          <SlidersHorizontal className="h-5 w-5" />
        </button>

        <div className="mt-5 grid gap-8 lg:mt-6 lg:grid-cols-[240px_1fr]">
          <aside className="hidden h-max rounded-xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] lg:block">
            {filterContent}
          </aside>

          <section>
            <form onSubmit={handleSearch} className="mb-5 hidden max-w-xl lg:block">
              <label htmlFor="category-search" className="sr-only">
                Search restaurant
              </label>
              <div className="flex h-11 items-center gap-2 rounded-full border border-zinc-200 px-4">
                <Search className="h-4 w-4 text-zinc-500" />
                <input
                  id="category-search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </form>

            {isLoading ? (
              <p className="text-sm text-zinc-600">Memuat restoran...</p>
            ) : null}

            {isError ? (
              <p className="text-sm text-red-600">
                Gagal memuat restoran. Coba lagi nanti.
              </p>
            ) : null}

            {!isLoading && !isError && restaurants.length === 0 ? (
              <p className="rounded-xl bg-zinc-50 p-6 text-sm text-zinc-600">
                Restoran tidak ditemukan.
              </p>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
              {restaurants.map((restaurant, index) => (
                <Link
                  key={restaurant.id}
                  href={`/resto/${restaurant.id}`}
                  className={`${index >= 5 ? "hidden lg:block" : ""} rounded-xl bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.1)] lg:p-4`}
                >
                  <article className="grid grid-cols-[92px_1fr] gap-3 lg:grid-cols-[96px_1fr] lg:gap-4">
                    <div className="relative h-[92px] w-[92px] overflow-hidden rounded-lg bg-[#fff3df] lg:h-24 lg:w-24">
                      <Image
                        src={restaurant.logo}
                        alt={`${restaurant.name} logo`}
                        fill
                        sizes="96px"
                        className="object-contain p-2"
                      />
                    </div>

                    <div className="min-w-0 py-1">
                      <h2 className="truncate font-extrabold text-zinc-950">
                        {restaurant.name}
                      </h2>
                      <p className="mt-2 flex items-center gap-2 text-sm font-medium">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {restaurant.star}
                      </p>
                      <p className="mt-3 truncate text-sm font-medium text-zinc-700">
                        {formatPlace(restaurant.place)}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>

      {isFilterOpen ? (
        <div className="fixed inset-0 z-50 bg-zinc-950/55 lg:hidden">
          <div className="relative min-h-full w-[76%] max-w-[300px] bg-white px-5 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.28)]">
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              aria-label="Close filter"
              className="absolute -right-12 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-100 bg-white text-zinc-950 shadow-[0_8px_24px_rgba(15,23,42,0.16)]"
            >
              <X className="h-6 w-6" />
            </button>

            {filterContent}
          </div>
        </div>
      ) : null}
    </main>
  );
}
