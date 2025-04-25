
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, ShoppingCart } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container px-4 mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-2xl font-cursive font-bold text-pizza-primary">Pizzaria Delícia</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-pizza-primary focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-700 hover:text-pizza-primary font-medium">Início</a>
          <a href="#menu" className="text-gray-700 hover:text-pizza-primary font-medium">Cardápio</a>
          <a href="#about" className="text-gray-700 hover:text-pizza-primary font-medium">Sobre</a>
          <a href="#contact" className="text-gray-700 hover:text-pizza-primary font-medium">Contato</a>
        </div>

        <div className="hidden md:block">
          <Button className="bg-pizza-primary hover:bg-pizza-accent">
            <ShoppingCart className="mr-2" size={18} />
            Pedido Online
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-inner">
          <div className="flex flex-col space-y-4">
            <a href="#" className="text-gray-700 hover:text-pizza-primary font-medium">Início</a>
            <a href="#menu" className="text-gray-700 hover:text-pizza-primary font-medium">Cardápio</a>
            <a href="#about" className="text-gray-700 hover:text-pizza-primary font-medium">Sobre</a>
            <a href="#contact" className="text-gray-700 hover:text-pizza-primary font-medium">Contato</a>
            <Button className="bg-pizza-primary hover:bg-pizza-accent w-full">
              <ShoppingCart className="mr-2" size={18} />
              Pedido Online
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
