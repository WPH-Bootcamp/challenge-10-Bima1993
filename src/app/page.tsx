import { Suspense } from "react";
import { RestaurantList } from "@/features/resto/restaurant-list";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight">
            All Restaurant
          </h1>
        </div>

        <Suspense fallback={<p className="text-sm text-zinc-600">Memuat restoran...</p>}>
          <RestaurantList />
        </Suspense>
      </section>
    </main>
  );
}
