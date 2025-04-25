
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-pizza-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h2 className="text-4xl font-bold font-serif text-pizza-dark mb-6">Nossa História</h2>
            <div className="bg-pizza-primary h-1 w-24 mb-8"></div>
            <p className="text-gray-700 mb-6">
              Desde 1992, a Pizzaria Delícia tem servido as mais deliciosas pizzas artesanais para clientes exigentes. Nossa jornada começou com uma simples receita de família trazida da Itália para o Brasil.
            </p>
            <p className="text-gray-700 mb-6">
              Nossos ingredientes são cuidadosamente selecionados para garantir qualidade excepcional, e nossas massas são preparadas diariamente para proporcionar a melhor experiência aos nossos clientes.
            </p>
            <p className="text-gray-700">
              Acreditamos que uma boa pizza é feita com tempo, dedicação e paixão. Por isso, cada pizza que sai do nosso forno é uma obra-prima culinária que representa nosso compromisso com a excelência.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-64 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Nosso Restaurante" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="h-64 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Preparo da Massa" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="h-64 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Pizza no Forno" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="h-64 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Ingredientes Frescos" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
