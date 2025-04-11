
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, Clock, Package, ShoppingBag } from 'lucide-react';

const OrderConfirmationPage = () => {
  const { order, customer } = useApp();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If no order exists, redirect to products
    if (!order || !customer) {
      navigate('/products');
    }
  }, [order, customer, navigate]);
  
  if (!order || !customer) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <Check className="h-8 w-8 text-gearup-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
            <p className="text-gray-600">
              Order #{order.id?.substring(6)} has been confirmed.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              A confirmation email has been sent to {customer.email}
            </p>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Package className="mr-2 h-5 w-5" /> Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Shipping Address</h3>
                    <p className="text-gray-600 whitespace-pre-line">{order.shippingAddress}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Order Date</h3>
                    <p className="text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <h3 className="font-medium text-gray-700 mb-1 mt-3">Order Status</h3>
                    <div className="flex items-center text-amber-600">
                      <Clock className="mr-1 h-4 w-4" />
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div 
                        key={item.productId} 
                        className="flex justify-between items-center py-2 border-b border-gray-100"
                      >
                        <div className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{item.name}</span>
                          <span className="ml-2 text-gray-500">×{item.quantity}</span>
                        </div>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/products')}
                className="mr-4"
              >
                Continue Shopping
              </Button>
              <Button 
                onClick={() => window.print()}
                className="bg-gearup-primary hover:bg-gearup-primary/90"
              >
                Print Receipt
              </Button>
            </CardFooter>
          </Card>
          
          <div className="text-center text-gray-600">
            <p>
              If you have any questions about your order, please contact our customer support.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
