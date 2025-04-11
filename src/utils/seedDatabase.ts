
import { supabase } from '@/integrations/supabase/client';
import { products as sampleProducts } from '@/data/products';

/**
 * Seed the database with sample products data
 * Run this function once to populate the products table
 */
export const seedProducts = async () => {
  try {
    // Check if products already exist
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
      
    if (countError) throw countError;
    
    if (count && count > 0) {
      console.log(`Database already contains ${count} products.`);
      return { success: true, message: `Database already contains ${count} products.` };
    }
    
    // Map sample products to the database schema
    const productsToInsert = sampleProducts.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock
    }));
    
    // Insert products
    const { error: insertError } = await supabase
      .from('products')
      .insert(productsToInsert);
      
    if (insertError) throw insertError;
    
    console.log(`Successfully seeded ${productsToInsert.length} products.`);
    return { success: true, message: `Successfully seeded ${productsToInsert.length} products.` };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: 'Failed to seed database.', error };
  }
};
