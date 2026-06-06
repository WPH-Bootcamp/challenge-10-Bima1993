import { api } from "./axios";
import type { CreateReviewPayload, ReviewResponse } from "@/types/review";

export async function createReview(payload: CreateReviewPayload) {
  const response = await api.post<ReviewResponse>("/api/review", payload);
  return response.data;
}
