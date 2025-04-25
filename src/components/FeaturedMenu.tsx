
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Margherita",
    description: "Molho de tomate, mussarela fresca, manjericão e azeite",
    price: "R$42,90",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    name: "Pepperoni",
    description: "Molho de tomate, mussarela e generosas fatias de pepperoni",
    price: "R$48,90",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    name: "Calabresa",
    description: "Molho de tomate, mussarela, calabresa fatiada e cebola",
    price: "R$44,90",
    image: "https://images.unsplash.com/photo-1593246049226-ded77bf90326?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    name: "Quatro Queijos",
    description: "Molho de tomate, mussarela, parmesão, gorgonzola e provolone",
    price: "R$52,90",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

const FeaturedMenu: React.FC = () => {
  return (
    <section id="menu" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Nosso Cardápio</h2>
        <p className="section-subtitle">
          Confira nossas pizzas mais populares, feitas com ingredientes selecionados e muito amor
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {menuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-pizza-dark font-serif">{item.name}</CardTitle>
                <CardDescription className="text-gray-600 h-12">{item.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-pizza-accent">{item.price}</span>
                <Button className="bg-pizza-primary hover:bg-pizza-accent">
                  <ShoppingCart className="mr-2" size={16} />
                  Adicionar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/menu">
            <Button className="btn-pizza-outline">
              Ver Cardápio Completo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMenu;
