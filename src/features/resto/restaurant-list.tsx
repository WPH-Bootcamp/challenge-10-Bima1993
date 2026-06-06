"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useRestaurants } from "@/lib/query/use-restaurants";
import type { RestaurantFilterParams } from "@/types/resto";

const categories = ["fast-food", "western", "asian", "dessert"];
const ratings = ["5", "4", "3", "2", "1"];

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function readParams(searchParams: URLSearchParams): RestaurantFilterParams {
  return {
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    rating: searchParams.get("rating") ?? undefined,
    priceMin: searchParams.get("priceMin") ?? undefined,
    priceMax: searchParams.get("priceMax") ?? undefined,
    range: searchParams.get("range") ?? undefined,
    limit: "12",
  };
}

export function RestaurantList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = readParams(searchParams);
  const [searchValue, setSearchValue] = useState(params.q ?? "");
  const [priceMin, setPriceMin] = useState(params.priceMin ?? "");
  const [priceMax, setPriceMax] = useState(params.priceMax ?? "");
  const { data, isLoading, isError } = useRestaurants(params);

  function updateParam(key: string, value?: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    router.replace(`${pathname}?${nextParams.toString()}`);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateParam("q", searchValue.trim() || undefined);
  }

  function applyPriceFilter() {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (priceMin) {
      nextParams.set("priceMin", priceMin);
    } else {
      nextParams.delete("priceMin");
    }

    if (priceMax) {
      nextParams.set("priceMax", priceMax);
    } else {
      nextParams.delete("priceMax");
    }

    router.replace(`${pathname}?${nextParams.toString()}`);
  }

  function clearFilters() {
    setSearchValue("");
    setPriceMin("");
    setPriceMax("");
    router.replace(pathname);
  }

  const restaurants = data?.data.restaurants ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">FILTER</h2>
          <SlidersHorizontal className="h-5 w-5" />
        </div>

        <form onSubmit={handleSearch} className="mt-5">
          <label htmlFor="restaurant-search" className="sr-only">
            Search restaurant
          </label>
          <div className="flex h-11 items-center gap-2 rounded-full border border-zinc-200 px-4">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              id="restaurant-search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </form>

        <div className="mt-6 border-t pt-5">
          <p className="font-semibold">Category</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  updateParam(
                    "category",
                    params.category === category ? undefined : category
                  )
                }
                className={`rounded-full border px-3 py-1.5 text-sm capitalize ${
                  params.category === category
                    ? "border-red-600 bg-red-50 text-red-600"
                    : "border-zinc-200 text-zinc-700"
                }`}
              >
                {category.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t pt-5">
          <p className="font-semibold">Price</p>
          <div className="mt-3 grid gap-2">
            <input
              value={priceMin}
              onChange={(event) => setPriceMin(event.target.value)}
              inputMode="numeric"
              placeholder="Minimum Price"
              className="h-10 rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-red-600"
            />
            <input
              value={priceMax}
              onChange={(event) => setPriceMax(event.target.value)}
              inputMode="numeric"
              placeholder="Maximum Price"
              className="h-10 rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-red-600"
            />
            <button
              type="button"
              onClick={applyPriceFilter}
              className="h-10 rounded-full bg-zinc-900 text-sm font-semibold text-white"
            >
              Apply Price
            </button>
          </div>
        </div>

        <div className="mt-6 border-t pt-5">
          <p className="font-semibold">Rating</p>
          <div className="mt-3 grid gap-2">
            {ratings.map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() =>
                  updateParam(
                    "rating",
                    params.rating === rating ? undefined : rating
                  )
                }
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  params.rating === rating
                    ? "border-red-600 bg-red-50 text-red-600"
                    : "border-zinc-200 text-zinc-700"
                }`}
              >
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {rating}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="mt-6 h-10 w-full rounded-full border border-zinc-200 text-sm font-semibold"
        >
          Clear Filter
        </button>
      </aside>

      <section>
        {isLoading ? (
          <p className="text-sm text-zinc-600">Memuat restoran...</p>
        ) : null}

        {isError ? (
          <p className="text-sm text-red-600">
            Gagal memuat restoran. Coba lagi nanti.
          </p>
        ) : null}

        {!isLoading && !isError && restaurants.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-sm text-zinc-600 shadow-sm">
            Restoran tidak ditemukan.
          </p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {restaurants.map((restaurant) => {
            const coverImage = restaurant.images[0] ?? restaurant.logo;

            return (
              <Link
                key={restaurant.id}
                href={`/resto/${restaurant.id}`}
                className="overflow-hidden rounded-2xl bg-white transition hover:shadow-sm"
              >
                <article className="grid h-full grid-cols-[104px_1fr] gap-4 p-4">
                  <div className="relative h-[104px] w-[104px] overflow-hidden rounded-xl bg-zinc-100">
                    <Image
                      src={restaurant.logo || coverImage}
                      alt={`${restaurant.name} logo`}
                      fill
                      sizes="104px"
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="min-w-0 py-1">
                    <h2 className="truncate font-semibold">
                      {restaurant.name}
                    </h2>
                    <p className="mt-2 flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {restaurant.star}
                    </p>
                    <p className="mt-2 truncate text-sm text-zinc-600">
                      {restaurant.place}
                    </p>
                    <p className="mt-2 text-xs font-medium text-zinc-500">
                      {formatRupiah(restaurant.priceRange.min)} -{" "}
                      {formatRupiah(restaurant.priceRange.max)}
                    </p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
