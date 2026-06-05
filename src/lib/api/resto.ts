import { api } from "./axios";
import type {
  RestaurantDetailResponse,
  RestaurantListResponse,
} from "@/types/resto";

export async function getRestaurants() {
  const response = await api.get<RestaurantListResponse>("/api/resto");
  return response.data;
}

export async function getRestaurantDetail(id: number | string) {
  const response = await api.get<RestaurantDetailResponse>(`/api/resto/${id}`);
  return response.data;
}