

export interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export interface Order {
  id: number;
  basketId: string;
  shippingAddress: ShippingAddress;
  orderDate: string; // Stocké sous forme de chaîne ISO retournée par le Backend
  orderStatus: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
}