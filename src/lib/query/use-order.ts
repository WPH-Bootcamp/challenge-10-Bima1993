import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkout, getMyOrders } from "@/lib/api/order";

const ORDERS_QUERY_KEY = ["orders"];

export function useCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
}

export function useMyOrders(status?: string, enabled = true) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, status || "all"],
    queryFn: () => getMyOrders(status),
    enabled,
  });
}
