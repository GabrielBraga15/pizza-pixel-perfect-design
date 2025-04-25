
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MenuItemCard from '@/components/MenuItemCard';
import { Skeleton } from "@/components/ui/skeleton";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

const Menu = () => {
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as MenuItem[];
    },
  });

  return (
    <div className="min-h-screen bg-pizza-light">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-center mb-6 text-pizza-dark">
          Nosso Cardápio Completo
        </h1>
        <p className="text-xl text-center mb-12 text-gray-600 max-w-2xl mx-auto">
          Descubra nossa seleção de pizzas artesanais, feitas com ingredientes frescos e muito amor
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          ) : (
            menuItems?.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Menu;
