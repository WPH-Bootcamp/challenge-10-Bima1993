import { useQuery } from "@tanstack/react-query";
import { getRestaurantDetail, getRestaurants } from "@/lib/api/resto";

export function useRestaurants() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });
}

export function useRestaurantDetail(id: number | string) {
  return useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => getRestaurantDetail(id),
  });
}