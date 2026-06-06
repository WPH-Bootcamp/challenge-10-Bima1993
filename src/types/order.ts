export type OrderRestaurantItemPayload = {
  menuId: number;
  quantity: number;
};

export type OrderRestaurantPayload = {
  restaurantId: number;
  items: OrderRestaurantItemPayload[];
};

export type CheckoutPayload = {
  restaurants: OrderRestaurantPayload[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod: string;
  notes?: string;
};

export type OrderPricing = {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  totalPrice: number;
};

export type OrderRestaurantItem = {
  menuId: number;
  menuName: string;
  price: number;
  image?: string;
  quantity: number;
  itemTotal: number;
};

export type OrderRestaurantGroup = {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: OrderRestaurantItem[];
  subtotal: number;
};

export type OrderTransaction = {
  id: number;
  transactionId: string;
  paymentMethod: string;
  status: string;
  deliveryAddress: string;
  phone: string | null;
  pricing: OrderPricing;
  restaurants: OrderRestaurantGroup[];
  createdAt: string;
  updatedAt?: string;
};

export type CheckoutResponse = {
  success: boolean;
  message: string;
  data: {
    transaction: OrderTransaction;
  };
};

export type OrdersResponse = {
  success: boolean;
  message: string;
  data: {
    orders: OrderTransaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    filter: {
      status: string | null;
    };
  };
};
