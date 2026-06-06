import { useMutation } from "@tanstack/react-query";
import { createReview } from "@/lib/api/review";

export function useCreateReviewMutation() {
  return useMutation({
    mutationFn: createReview,
  });
}
