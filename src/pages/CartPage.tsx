
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import CartItem from '@/components/CartItem';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, ArrowLeft, ShoppingCart } from 'lucide-react';

const CartPage = () => {
  const { cart, clearCart } = useApp();
  const navigate = useNavigate();
  
  const subtotal = cart.items.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  );
  
  const estimatedTax = subtotal * 0.08; // 8% tax
  const total = subtotal + estimatedTax;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <ShoppingCart className="mr-2 h-6 w-6" /> Your Cart
            </h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/products')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Continue Shopping
            </Button>
          </div>
          
          {cart.items.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                <Button 
                  onClick={() => navigate('/products')}
                  className="bg-gearup-primary hover:bg-gearup-primary/90"
                >
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Items ({cart.items.reduce((count, item) => count + item.quantity, 0)})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {cart.items.map((item) => (
                        <CartItem key={item.productId} item={item} />
                      ))}
                    </div>
                    
                    {cart.items.length > 0 && (
                      <div className="mt-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearCart}
                          className="text-red-500 hover:text-red-700"
                        >
                          Clear Cart
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Tax</span>
                        <span>${estimatedTax.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gearup-primary hover:bg-gearup-primary/90"
                      onClick={() => navigate('/checkout')}
                      disabled={cart.items.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;
