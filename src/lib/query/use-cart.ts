import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "@/lib/api/cart";

const CART_QUERY_KEY = ["cart"];

export function useCart(enabled = true) {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCart,
    enabled,
  });
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      quantity,
    }: {
      id: number;
      quantity: number;
    }) => updateCartItem(id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useDeleteCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}