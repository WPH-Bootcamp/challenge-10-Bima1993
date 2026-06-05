export type AddCartPayload = {
  restaurantId: number;
  menuId: number;
  quantity: number;
};

export type UpdateCartPayload = {
  quantity: number;
};

export type CartItem = {
  id: number;
  quantity: number;
  menuId?: number;
  restaurantId?: number;
  menu?: {
    id: number;
    foodName: string;
    price: number;
    image: string;
    type: string;
  };
};

export type CartRestaurantGroup = {
  restaurantId: number;
  restaurantName?: string;
  items: CartItem[];
};

export type CartResponse = {
  success: boolean;
  message: string;
  data: CartRestaurantGroup[];
};