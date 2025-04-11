import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  shippingAddress: z.string().min(5, 'Full address is required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cardHolder: z.string().min(2, 'Card holder name is required'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Expiry date must be in MM/YY format'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const { cart, customer, createOrder } = useApp();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect to products if cart is empty
  React.useEffect(() => {
    if (!customer) {
      navigate('/');
      return;
    }
    
    if (cart.items.length === 0) {
      navigate('/products');
    }
  }, [cart.items.length, customer, navigate]);
  
  const subtotal = cart.items.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  );
  
  const estimatedTax = subtotal * 0.08; // 8% tax
  const shippingCost = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  const total = subtotal + estimatedTax + shippingCost;
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: customer?.address || '',
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    },
  });
  
  const onSubmit = (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    // Simulate processing delay
    setTimeout(() => {
      try {
        createOrder(data.shippingAddress);
        navigate('/order-confirmation');
      } catch (error) {
        toast.error('There was a problem processing your order');
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/cart')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Cart
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" /> Payment & Shipping Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <h3 className="text-base font-medium mb-3 flex items-center">
                          <Truck className="h-4 w-4 mr-2" /> Shipping Information
                        </h3>
                        <FormField
                          control={form.control}
                          name="shippingAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Shipping Address</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter your full address"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-base font-medium mb-3 flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-2" /> Payment Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="1234 5678 9012 3456"
                                    {...field}
                                    onChange={(e) => {
                                      // Allow only digits
                                      const value = e.target.value.replace(/\D/g, '');
                                      field.onChange(value);
                                    }}
                                    maxLength={16}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cardHolder"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Card Holder Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="MM/YY" 
                                    {...field}
                                    onChange={(e) => {
                                      let value = e.target.value.replace(/[^\d/]/g, '');
                                      
                                      // Auto-format with slash
                                      if (value.length === 2 && !value.includes('/') && field.value.length === 1) {
                                        value += '/';
                                      }
                                      
                                      // Keep the format MM/YY
                                      if (value.length <= 5) {
                                        field.onChange(value);
                                      }
                                    }}
                                    maxLength={5}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="123" 
                                    {...field}
                                    onChange={(e) => {
                                      // Allow only digits
                                      const value = e.target.value.replace(/\D/g, '');
                                      if (value.length <= 4) {
                                        field.onChange(value);
                                      }
                                    }}
                                    maxLength={4}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4 md:hidden">
                        <Button 
                          type="submit" 
                          className="w-full bg-gearup-primary hover:bg-gearup-primary/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>
                        {shippingCost === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `$${shippingCost.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${estimatedTax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-4 hidden md:block">
                      <Button 
                        onClick={form.handleSubmit(onSubmit)}
                        className="w-full bg-gearup-primary hover:bg-gearup-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                      </Button>
                    </div>
                    
                    <div className="text-xs text-gray-500 text-center pt-2">
                      <p>Your order information is encrypted and secure.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
