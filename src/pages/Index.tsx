
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import CustomerForm from '@/components/CustomerForm';
import { Customer } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { customer, setCustomer } = useApp();
  const navigate = useNavigate();
  
  // If customer is already set, redirect to products page
  React.useEffect(() => {
    if (customer) {
      navigate('/products');
    }
  }, [customer, navigate]);
  
  const handleSubmit = async (data: Customer) => {
    try {
      // Insert customer data to Supabase
      const { data: customerData, error } = await supabase
        .from('customers')
        .insert([
          { 
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address || '',
            user_id: 'guest-' + Date.now() // Use a timestamp for guest users
          }
        ])
        .select()
        .single();
        
      if (error) {
        console.error("Error creating customer:", error);
        toast.error("Failed to create customer profile. Please try again.");
        return;
      }
      
      // Set the customer in the context with the ID from Supabase
      const newCustomer: Customer = {
        id: customerData.id,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address || ''
      };
      
      setCustomer(newCustomer);
      toast.success(`Welcome, ${newCustomer.name}!`);
      navigate('/products');
    } catch (error: any) {
      console.error("Error during customer creation:", error);
      toast.error("Failed to create customer. Please try again.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gearup-dark mb-2">Welcome to GearUp</h1>
            <p className="text-gray-600">
              Please enter your details to continue
            </p>
          </div>
          
          <CustomerForm 
            onSubmit={handleSubmit}
            submitLabel="Continue Shopping"
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
