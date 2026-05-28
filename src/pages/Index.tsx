import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedMenu from "@/components/FeaturedMenu";
import AboutSection from "@/components/AboutSection";
import OrderSection from "@/components/OrderSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Cadastro from "@/contexts/Cadastro";
import Login from "@/contexts/Login";

const Index = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true); // controla se o usuário está logado

  // Callback para quando o usuário finalizar cadastro/login
  const handleAuthSuccess = () => setLoggedIn(true);

  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Overlay de autenticação */}
      {!loggedIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            {showLogin ? (
              <Login onSuccess={handleAuthSuccess} />
            ) : (
              <Cadastro onSuccess={handleAuthSuccess} />
            )}

            <div className="mt-4 text-center">
              {showLogin ? (
                <button
                  className="text-blue-500 underline"
                  onClick={() => setShowLogin(false)}
                >
                  Ainda não tem cadastro? Clique aqui
                </button>
              ) : (
                <button
                  className="text-blue-500 underline"
                  onClick={() => setShowLogin(true)}
                >
                  Já tem cadastro? Faça login
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo normal da página só aparece quando loggedIn = true */}
      {loggedIn && (
        <>
          <HeroSection />
          <FeaturedMenu />
          <AboutSection />
          <OrderSection />
          <ContactSection />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Index;
