// src/components/CustomerForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Customer } from '@/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// Define the schema for form validation
const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().optional(),
});

// Define form values type
type CustomerFormValues = z.infer<typeof customerSchema>;

// Define component props
interface CustomerFormProps {
  defaultValues?: Partial<Customer>;
  submitLabel?: string;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  defaultValues = {},
  submitLabel = 'Submit',
}) => {
  const navigate = useNavigate();

  // Initialize react-hook-form with zod validation
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: defaultValues.name || '',
      email: defaultValues.email || '',
      phone: defaultValues.phone || '',
      address: defaultValues.address || '',
    },
  });

  // Handle form submission
  const handleSubmit = async (data: CustomerFormValues) => {
    try {
      // Insert customer into Supabase
      const { error, data: insertedCustomer } = await supabase
        .from('customers')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address || null,
          
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Customer details saved successfully');
      navigate('/products'); // Navigate to home page
    } catch (error: any) {
      console.error('Error saving customer:', error);
      toast.error(error.message || 'Failed to save customer details');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="(555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your address"
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-gearup-primary hover:bg-gearup-primary/90"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Submitting...' : submitLabel}
        </Button>
      </form>
    </Form>
  );
};

export default CustomerForm;