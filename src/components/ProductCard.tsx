
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useApp();
  
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="relative pt-[75%] overflow-hidden bg-gray-100 rounded-t-lg">
        <img 
          src={`${product.image}?auto=format&fit=crop&w=600&h=400`}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>
      
      <CardContent className="flex-grow pt-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <span className="font-bold text-gearup-primary">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
        <div className="mt-2">
          <span className="inline-block bg-gearup-secondary/20 text-gearup-primary text-xs px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={() => addToCart(product)} 
          className="w-full bg-gearup-primary hover:bg-gearup-primary/90 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
