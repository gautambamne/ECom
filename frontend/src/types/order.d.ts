interface IOrder {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shipping_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  billing_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  payment_method: string;
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  items: IOrderItem[];
  created_at: string;
  updated_at: string;
}

interface IOrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  total: number;
}

interface ICreateOrderRequest {
  shipping_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  billing_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  payment_method: string;
}

interface IUpdateOrderStatusRequest {
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

interface IGetOrdersResponse {
  orders: IOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface IGetOrderResponse {
  order: IOrder;
}

interface ICreateOrderResponse {
  order: IOrder;
  message: string;
}

interface IUpdateOrderResponse {
  order: IOrder;
  message: string;
}