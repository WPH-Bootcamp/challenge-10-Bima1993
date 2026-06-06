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
  itemTotal: number;
  menu: {
    id: number;
    foodName: string;
    price: number;
    image: string;
    type: string;
  };
};

export type CartRestaurantGroup = {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: CartItem[];
  subtotal: number;
};

export type CartResponse = {
  success: boolean;
  message: string;
  data: {
    cart: CartRestaurantGroup[];
    summary: {
      totalItems: number;
      totalPrice: number;
      restaurantCount: number;
    };
  };
};
