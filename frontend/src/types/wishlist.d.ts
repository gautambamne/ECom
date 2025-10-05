interface IWishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    brand: string;
    stock: number;
  };
}

interface IAddItemToWishlistResponse {
  wishlistItem: IWishlistItem;
  message: string;
}

interface IGetUserWishlistResponse {
  wishlist: {
    id: string;
    user_id: string;
    items: IWishlistItem[];
    created_at: string;
    updated_at: string;
  };
  message: string;
}

interface ICheckWishlistStatusResponse {
  isInWishlist: boolean;
  message: string;
}

interface IGetWishlistItemCountResponse {
  count: number;
  message: string;
}
