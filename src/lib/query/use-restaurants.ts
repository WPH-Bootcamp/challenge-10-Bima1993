import { useQuery } from "@tanstack/react-query";
import { getRestaurantDetail, getRestaurants } from "@/lib/api/resto";
import type { RestaurantFilterParams } from "@/types/resto";

export function useRestaurants(params: RestaurantFilterParams = {}) {
  return useQuery({
    queryKey: ["restaurants", params],
    queryFn: () => getRestaurants(params),
  });
}

export function useRestaurantDetail(id: number | string) {
  return useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => getRestaurantDetail(id),
  });
}
