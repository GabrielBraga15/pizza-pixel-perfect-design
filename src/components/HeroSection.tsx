import React from "react";
import { Button } from "@/components/ui/button";
import { Pizza, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="relative hero-pattern py-16 md:py-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-pizza-dark mb-4">
            Saboreie a Autêntica{" "}
            <span className="text-pizza-primary">Pizza Italiana</span>
          </h1>
          <p className="text-gray-600 text-xl mb-8 max-w-lg">
            Ingredientes frescos, massa artesanal e sabor inesquecível. Conheça
            a melhor pizzaria da cidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/menu">
              <Button className="btn-pizza">
                <Pizza size={18} />
                Ver Cardápio
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-pizza-secondary rounded-full opacity-20"></div>
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Pizza Tradicional"
              className="rounded-lg shadow-2xl relative z-10 w-full"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pizza-primary rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default HeroSection;
