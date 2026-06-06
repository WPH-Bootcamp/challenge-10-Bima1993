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

  return <RestaurantDetail id={id} />;
}
