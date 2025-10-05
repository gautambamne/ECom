interface ICartItem {
  id: string;
  quantity: number;
  product_id: string;
  cart_id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    brand: string;
    stock: number;
  };
}

interface IGetUserCartResponse {
  id: string;
  user_id: string;
  items: ICartItem[];
  message: string;
}

interface IAddCartItemResponse {
  cartItem: ICartItem;
  message: string;
}

interface IGetSingleCartResponse {
  cartItem: ICartItem;
  message: string;
}

interface IUpdateCartItemQuantityResponse {
  cartItem: ICartItem;
  message: string;
}

interface IGetCartItemCountResponse {
  count: number;
  message: string;
}
