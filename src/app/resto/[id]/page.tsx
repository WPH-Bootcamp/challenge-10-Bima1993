import { RestaurantDetail } from "@/features/resto/restaurant-detail";

type RestaurantDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RestaurantDetailPage({
  params,
}: RestaurantDetailPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <section className="mx-auto w-full max-w-6xl">
        <RestaurantDetail id={id} />
      </section>
    </main>
  );
}