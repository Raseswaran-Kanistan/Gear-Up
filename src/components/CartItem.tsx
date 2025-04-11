
import React from 'react';
import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItemQuantity, removeFromCart } = useApp();
  const { product, quantity } = item;
  
  return (
    <div className="flex items-center py-4 space-x-4 border-b border-gray-200">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        <img 
          src={`${product.image}?auto=format&fit=crop&w=200&h=200`}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="text-base font-medium text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        <p className="mt-1 text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => updateCartItemQuantity(product.id, quantity - 1)}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className="w-8 text-center">{quantity}</span>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => updateCartItemQuantity(product.id, quantity + 1)}
          disabled={quantity >= product.stock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-right flex-shrink-0">
        <p className="text-base font-medium text-gray-900">${(product.price * quantity).toFixed(2)}</p>
        <Button 
          variant="ghost" 
          size="sm"
          className="mt-1 text-sm text-red-500 hover:text-red-700"
          onClick={() => removeFromCart(product.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
