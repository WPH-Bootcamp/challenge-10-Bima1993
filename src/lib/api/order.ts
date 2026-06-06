import { api } from "./axios";
import type { CheckoutPayload, CheckoutResponse, OrdersResponse } from "@/types/order";

export async function checkout(payload: CheckoutPayload) {
  const response = await api.post<CheckoutResponse>(
    "/api/order/checkout",
    payload
  );
  return response.data;
}

export async function getMyOrders(status?: string) {
  const response = await api.get<OrdersResponse>("/api/order/my-order", {
    params: {
      status: status || undefined,
    },
  });
  return response.data;
}
