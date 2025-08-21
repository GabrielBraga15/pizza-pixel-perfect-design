import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MenuItemCard from "@/components/MenuItemCard";
import { supabase } from "@/integrations/supabase/client";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

const FeaturedMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    async function fetchFeaturedMenuItems() {
      const { data, error } = await supabase
        .from("menu_items") // ou "menu_items" se sua tabela tiver esse nome
        .select("id, name, description, price, image_url, category")
        .limit(4); // pega apenas as 4 primeiras para destaque

      if (error) {
        console.error("Erro ao buscar itens do menu:", error);
      } else {
        setMenuItems(data || []);
      }
    }

    fetchFeaturedMenuItems();
  }, []);

  return (
    <section id="menu" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Nosso Cardápio</h2>
        <p className="section-subtitle">
          Confira nossas pizzas mais populares, feitas com ingredientes
          selecionados e muito amor
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/menu">
            <Button className="btn-pizza">Ver Cardápio Completo</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMenu;
