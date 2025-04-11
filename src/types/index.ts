export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  customerId?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id?: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}
