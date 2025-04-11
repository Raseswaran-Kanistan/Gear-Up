
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomerForm from '@/components/CustomerForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Customer } from '@/types';
import { toast } from 'sonner';
import { ChevronRight, Package, User, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage = () => {
  const { customer, setCustomer, completedOrders, exitCustomer } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect to index if no customer
  React.useEffect(() => {
    if (!customer) {
      navigate('/');
    }
  }, [customer, navigate]);
  
  if (!customer) {
    return null; // Will redirect in the useEffect
  }
  
  const handleUpdateCustomer = async (data: Customer) => {
    setIsLoading(true);
    try {
      // Update customer in database
      const { error } = await supabase
        .from('customers')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address
        })
        .eq('id', customer.id);
        
      if (error) throw error;
      
      // Update local state
      setCustomer({ ...data, id: customer.id });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExit = () => {
    exitCustomer();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <User className="mr-2 h-6 w-6" /> My Profile
            </h1>
            <Button 
              variant="outline" 
              onClick={handleExit}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
            >
              <LogOut className="h-4 w-4" />
              Exit
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <CustomerForm 
                    onSubmit={handleUpdateCustomer} 
                    defaultValues={customer}
                    submitLabel={isLoading ? "Updating..." : "Update Profile"}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" /> My Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {completedOrders.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500">You haven't placed any orders yet.</p>
                      <Button 
                        variant="link" 
                        onClick={() => navigate('/products')}
                        className="mt-2"
                      >
                        Start shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {completedOrders.map((order) => (
                        <div key={order.id} className="group">
                          <div 
                            className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => navigate('/order-confirmation')}
                          >
                            <div>
                              <p className="font-medium">Order #{order.id?.substring(0, 8)}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.orderDate).toLocaleDateString()} · ${order.total.toFixed(2)}
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                          </div>
                          {completedOrders.indexOf(order) < completedOrders.length - 1 && (
                            <Separator />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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

export default ProfilePage;
