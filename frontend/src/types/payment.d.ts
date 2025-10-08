interface IPayment {
  id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transaction_id?: string;
  payment_gateway_response?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface ICreatePaymentRequest {
  order_id: string;
  payment_method: string;
  amount: number;
}

interface IGetPaymentResponse {
  payment: IPayment;
}

interface ICreatePaymentResponse {
  payment: IPayment;
  message: string;
}