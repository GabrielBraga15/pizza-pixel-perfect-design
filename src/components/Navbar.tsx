import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isSimplePage =
    location.pathname === "/menu" || location.pathname === "/cart";

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50 transition-all">
      <div className="container px-4 mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-2xl font-cursive font-bold text-pizza-primary">
              Pizzaria Delícia
            </span>
          </a>
        </div>

        {/* Se for a página /menu, mostra só o botão do pedido online */}
        {isSimplePage ? (
          <div>
            <Link to={"/cart"}>
              <Button className="bg-pizza-primary hover:bg-pizza-accent">
                <ShoppingCart className="mr-2" size={18} />
                Carrinho
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Botão mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-pizza-primary focus:outline-none"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Navegação Desktop */}
            <div className="hidden md:flex items-center space-x-8 ">
              <a
                href="#"
                className="text-gray-700 hover:text-pizza-primary font-medium "
              >
                Início
              </a>
              <a
                href="#menu"
                className="text-gray-700 hover:text-pizza-primary font-medium"
              >
                Cardápio
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-pizza-primary font-medium"
              >
                Sobre
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-pizza-primary font-medium"
              >
                Contato
              </a>
            </div>

            <div className="hidden md:block">
              <Link to={"/cart"}>
                {" "}
                <Button className="bg-pizza-primary hover:bg-pizza-accent">
                  <ShoppingCart className="mr-2" size={18} />
                  Carrinho
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu (só aparece fora da página /menu) */}
      {isMenuOpen && !isSimplePage && (
        <div className="md:hidden bg-white py-4 px-4 shadow-inner">
          <div className="flex flex-col space-y-4">
            <a
              href="#"
              className="text-gray-700 hover:text-pizza-primary font-medium"
            >
              Início
            </a>
            <a
              href="#menu"
              className="text-gray-700 hover:text-pizza-primary font-medium"
            >
              Cardápio
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-pizza-primary font-medium"
            >
              Sobre
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-pizza-primary font-medium"
            >
              Contato
            </a>
            <Link to={"/cart"}>
              {" "}
              <Button className="bg-pizza-primary hover:bg-pizza-accent">
                <ShoppingCart className="mr-2" size={18} />
                Carrinho
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
