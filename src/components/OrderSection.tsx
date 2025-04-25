
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pizza, UtensilsCrossed, ShoppingCart } from 'lucide-react';

const OrderSection: React.FC = () => {
  return (
    <section className="py-20 bg-pizza-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">Peça Sua Pizza Agora</h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
          Entrega rápida, pizza quente e sabor incomparável. Faça seu pedido online ou por telefone e desfrute do melhor da culinária italiana.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-10 p-8 rounded-lg hover:bg-opacity-20 transition-all">
            <div className="bg-white text-pizza-primary p-3 rounded-full inline-block mb-4">
              <Pizza size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 font-serif">Peça Online</h3>
            <p className="mb-6 opacity-80">Faça seu pedido pelo nosso site ou aplicativo com apenas alguns cliques</p>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-pizza-primary">
              <ShoppingCart className="mr-2" size={18} />
              Pedir Agora
            </Button>
          </div>
          
          <div className="bg-white bg-opacity-10 p-8 rounded-lg hover:bg-opacity-20 transition-all">
            <div className="bg-white text-pizza-primary p-3 rounded-full inline-block mb-4">
              <UtensilsCrossed size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 font-serif">Visite-nos</h3>
            <p className="mb-6 opacity-80">Venha desfrutar do nosso ambiente aconchegante e atendimento especial</p>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-pizza-primary">
              Ver Localização
            </Button>
          </div>
          
          <div className="bg-white bg-opacity-10 p-8 rounded-lg hover:bg-opacity-20 transition-all">
            <div className="bg-white text-pizza-primary p-3 rounded-full inline-block mb-4">
              <Pizza size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 font-serif">Ligue para Nós</h3>
            <p className="mb-6 opacity-80">Prefere pedir por telefone? Nossa equipe está pronta para atendê-lo</p>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-pizza-primary">
              (11) 5555-5555
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;
