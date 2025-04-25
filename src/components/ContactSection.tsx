
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Entre em Contato</h2>
        <p className="section-subtitle">
          Tem dúvidas, sugestões ou comentários? Envie uma mensagem e responderemos o mais breve possível
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <Input 
                    id="name"
                    placeholder="Seu nome completo"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                <Input 
                  id="subject"
                  placeholder="Assunto da mensagem"
                  className="w-full"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <Textarea 
                  id="message"
                  placeholder="Digite sua mensagem aqui..."
                  rows={5}
                  className="w-full resize-none"
                />
              </div>
              
              <Button className="bg-pizza-primary hover:bg-pizza-accent w-full">
                Enviar Mensagem
              </Button>
            </form>
          </div>
          
          <div>
            <div className="bg-gray-50 p-6 rounded-lg h-full">
              <h3 className="text-2xl font-bold font-serif text-pizza-dark mb-6">Informações de Contato</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-700 mb-1">Endereço</h4>
                  <p className="text-gray-600">Av. Paulista, 1000 - Bela Vista</p>
                  <p className="text-gray-600">São Paulo - SP, 01310-100</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-700 mb-1">Telefone</h4>
                  <p className="text-gray-600">(11) 5555-5555</p>
                  <p className="text-gray-600">(11) 99999-9999</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-700 mb-1">Email</h4>
                  <p className="text-gray-600">contato@pizzariadelicia.com</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-700 mb-1">Horário de Funcionamento</h4>
                  <p className="text-gray-600">Segunda a Quinta: 18h às 23h</p>
                  <p className="text-gray-600">Sexta a Domingo: 18h às 00h</p>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="bg-gray-200 rounded-lg h-64">
                  {/* Map would go here */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-lg text-gray-600">
                    Mapa da Localização
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
