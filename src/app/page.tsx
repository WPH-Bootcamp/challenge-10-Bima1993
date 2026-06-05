import { RestaurantList } from "@/features/resto/restaurant-list";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-zinc-500">Restaurant App</p>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight">
            Temukan restoran dan pesan makanan favoritmu.
          </h1>
          <p className="max-w-2xl text-sm text-zinc-600">
            Jelajahi daftar restoran, lihat menu, tambah ke cart, lalu checkout.
          </p>
        </div>

        <RestaurantList />
      </section>
    </main>
  );
}