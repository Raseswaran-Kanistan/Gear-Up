
import React from 'react';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const { cart, customer, exitCustomer } = useApp();
  const navigate = useNavigate();
  
  const cartItemsCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  
  const handleExit = () => {
    exitCustomer();
    navigate('/');
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-gearup-primary" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6"/>
          </svg>
          <span className="font-bold text-2xl text-gearup-dark">GearUp</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {customer ? (
            <>
              <div className="flex items-center text-sm text-gray-700">
                <User className="h-5 w-5 mr-1" />
                <span className="hidden md:inline">{customer.name}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleExit} 
                title="Exit"
                className="text-gray-700 hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : null}
          
          <Link to="/cart">
            <Button variant="ghost" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gearup-dark" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-gearup-accent text-white min-w-[1.5rem] h-6 flex items-center justify-center rounded-full animate-cart-bounce">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
