export type Restaurant = {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  category: string;
  reviewCount: number;
  menuCount: number;
  priceRange: {
    min: number;
    max: number;
  };
};

export type RestaurantListResponse = {
  success: boolean;
  message: string;
  data: {
    restaurants: Restaurant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    filters: {
      range: number | null;
      priceMin: number | null;
      priceMax: number | null;
      rating: number | null;
      category: string | null;
    };
  };
};

export type RestaurantMenu = {
  id: number;
  foodName: string;
  price: number;
  type: "food" | "drink" | string;
  image: string;
};

export type RestaurantReview = {
  id?: number;
  name?: string;
  star?: number;
  comment?: string;
  createdAt?: string;
};

export type RestaurantDetail = {
  id: number;
  name: string;
  star: number;
  averageRating: number;
  place: string;
  coordinates: {
    lat: number;
    long: number;
  };
  logo: string;
  images: string[];
  category: string;
  totalMenus: number;
  totalReviews: number;
  menus: RestaurantMenu[];
  reviews: RestaurantReview[];
};

export type RestaurantDetailResponse = {
  success: boolean;
  message: string;
  data: RestaurantDetail;
};