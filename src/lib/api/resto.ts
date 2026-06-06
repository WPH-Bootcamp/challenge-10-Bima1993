import { api } from "./axios";
import type {
  RestaurantDetailResponse,
  RestaurantFilterParams,
  RestaurantListResponse,
} from "@/types/resto";

export async function getRestaurants(params: RestaurantFilterParams = {}) {
  const { q, ...filters } = params;
  const endpoint = q ? "/api/resto/search" : "/api/resto";
  const queryParams = q ? { q, page: params.page, limit: params.limit } : filters;

  const response = await api.get<RestaurantListResponse>(endpoint, {
    params: queryParams,
  });

  return response.data;
}

export async function getRestaurantDetail(id: number | string) {
  const response = await api.get<RestaurantDetailResponse>(`/api/resto/${id}`);
  return response.data;
}
