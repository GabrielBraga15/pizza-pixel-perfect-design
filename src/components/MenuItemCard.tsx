
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="h-48 overflow-hidden">
        <img 
          src={item.image_url} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-pizza-dark font-serif">{item.name}</CardTitle>
        <CardDescription className="text-gray-600 h-12">{item.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between items-center pt-2">
        <span className="text-lg font-bold text-pizza-accent">
          R${item.price.toFixed(2)}
        </span>
        <Button className="bg-pizza-primary hover:bg-pizza-accent">
          <ShoppingCart className="mr-2" size={16} />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;
