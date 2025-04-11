import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, Product, Cart, CartItem, Order } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AppContextType {
  customer: Customer | null;
  setCustomer: (customer: Customer) => void;
  products: Product[];
  cart: Cart;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  order: Order | null;
  createOrder: (shippingAddress: string) => void;
  completedOrders: Order[];
  exitCustomer: () => void;
}

const defaultCart: Cart = {
  items: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [order, setOrder] = useState<Order | null>(null);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);

  // Fetch products from Supabase on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
          
        if (error) throw error;
        
        if (data) {
          setProducts(data as Product[]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, []);

  // Check if there is saved customer data in localStorage
  useEffect(() => {
    const savedCustomer = localStorage.getItem('customer');
    if (savedCustomer && !customer) {
      setCustomer(JSON.parse(savedCustomer));
    }
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setCompletedOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Update localStorage when customer changes
  useEffect(() => {
    if (customer) {
      localStorage.setItem('customer', JSON.stringify(customer));
    }
  }, [customer]);

  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Update localStorage when orders change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(completedOrders));
  }, [completedOrders]);

  // Function to exit customer (log out)
  const exitCustomer = () => {
    setCustomer(null);
    clearCart();
    localStorage.removeItem('customer');
    toast.success("Logged out successfully");
  };

  // Keep the rest of the functions as they are
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.productId === product.id
      );

      if (existingItemIndex >= 0) {
        // If item already in cart, increase quantity
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        toast.success(`Added another ${product.name} to cart`);
        return { ...prevCart, items: updatedItems };
      } else {
        // Add new item to cart
        toast.success(`${product.name} added to cart`);
        return {
          ...prevCart,
          items: [...prevCart.items, { productId: product.id, product, quantity: 1 }],
        };
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const productName = prevCart.items.find(item => item.productId === productId)?.product.name || 'Item';
      toast.info(`${productName} removed from cart`);
      return {
        ...prevCart,
        items: prevCart.items.filter((item) => item.productId !== productId),
      };
    });
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.productId === productId
      );

      if (existingItemIndex >= 0 && quantity > 0) {
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity,
        };
        return { ...prevCart, items: updatedItems };
      } else if (quantity <= 0) {
        return {
          ...prevCart,
          items: prevCart.items.filter((item) => item.productId !== productId),
        };
      }
      return prevCart;
    });
  };

  const clearCart = () => {
    setCart(defaultCart);
  };

  const createOrder = async (shippingAddress: string) => {
    if (!customer || cart.items.length === 0) {
      toast.error('Cannot create order without customer or items');
      return;
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    try {
      // Check if customer exists in database or create a new one
      let customerId = null;
      
      const { data: existingCustomers } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customer.email)
        .single();
        
      if (existingCustomers) {
        customerId = existingCustomers.id;
      } else {
        // Create new customer in database
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address || shippingAddress,
            user_id: 'guest-' + Date.now() // Use a timestamp for guest users
          })
          .select('id')
          .single();
          
        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }
      
      // Create order in database
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          total,
          shipping_address: shippingAddress,
          status: 'pending'
        })
        .select('id')
        .single();
        
      if (orderError) throw orderError;
      
      // Create order items
      const orderItemsToInsert = cart.items.map(item => ({
        order_id: newOrder.id,
        product_id: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);
        
      if (itemsError) throw itemsError;

      // Use proper type for status
      const newOrderWithItems: Order = {
        id: newOrder.id,
        customerId,
        items: orderItems,
        total,
        shippingAddress,
        orderDate: new Date().toISOString(),
        status: 'pending' as const,
      };

      setOrder(newOrderWithItems);
      setCompletedOrders((prevOrders) => [...prevOrders, newOrderWithItems]);
      clearCart();
      toast.success('Order created successfully!');
      
      // Simulate sending email
      console.log('Sending order confirmation email to:', customer.email);
      setTimeout(() => {
        toast.success(`Order confirmation sent to ${customer.email}`);
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    }
  };

  return (
    <AppContext.Provider
      value={{
        customer,
        setCustomer,
        products,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        order,
        createOrder,
        completedOrders,
        exitCustomer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
