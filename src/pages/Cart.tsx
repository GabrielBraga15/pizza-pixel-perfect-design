import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from '@/integrations/supabase/supabaseClient';
import { Link } from "react-router-dom";
import { useAuth } from "@/integrations/supabase/auth-context";


const Cart = () => {
  const { items, updateQuantity, removeItem, total } = useCart();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const { user } = useAuth();


  const handleModalToggle = () => {
    if (user) {
      finalizarPedido(); // 👈 SE TIVER LOGADO, FINALIZA DIRETO
    } else {
      setIsModalOpen(true); // 👈 SE NÃO, ABRE O CADASTRO
    }
  };

  const salvarCadastro = async () => {
    // 1. Primeiro cria a conta invisível no Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      phone: telefone, // usando o telefone como login
      password: telefone.replace(/\D/g, "").slice(-6), // senha automática (últimos 6 números do telefone)
    });
  
    if (authError) {
      console.error("Erro ao criar conta do cliente", authError);
      return;
    }
  
    // 2. Depois salva o cadastro na tabela 'clientes'
    const { data: clienteData, error: clienteError } = await supabase
      .from("clientes")
      .upsert({
        id: authData.user?.id, // salva o ID do usuário recém-criado
        cpf,
        nome,
        telefone,
      });
  
    if (clienteError) {
      console.error("Erro ao salvar cadastro do cliente", clienteError);
    } else {
      console.log("Cadastro salvo com sucesso:", clienteData);
      setIsModalOpen(false);
      finalizarPedido(); // Chama a função de finalizar pedido após salvar
    }
  };
  


  
  

  const finalizarPedido = async () => {
    const numero = "5534988941337"; // Substitua pelo número da pizzaria (DDI + DDD + número)
    const mensagem = encodeURIComponent(
      `Olá! Gostaria de fazer um pedido:\n\n${items
        .map(
          (item) =>
            `- ${item.quantity}x ${item.name} (R$${(item.price * item.quantity).toFixed(2)})`
        )
        .join("\n")}\n\nTotal: R$${total.toFixed(2)}`
    );

    const link = `https://wa.me/${numero}?text=${mensagem}`;
    window.open(link, "_blank");

    // Inserir o pedido na tabela 'orders' do Supabase
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          status: "pendente", // Você pode alterar o status conforme necessário
          items: JSON.stringify(items), // Convertendo os itens para formato JSON
          total: total, // Valor total do pedido
          created_at: new Date(), // Data e hora da criação do pedido
        }
      ]);

    if (error) {
      console.error("Erro ao salvar o pedido:", error);
    } else {
      console.log("Pedido salvo com sucesso:", data);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-pizza-light">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart className="mx-auto mb-4 text-gray-400" size={48} />
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="text-gray-600 mb-8">
            Adicione algumas pizzas deliciosas ao seu carrinho!
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pizza-light">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>

        <div className="grid gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-grow">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-pizza-accent font-bold">
                  R${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="destructive" onClick={() => removeItem(item.id)}>
                Remover
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold text-pizza-accent">
              R${total.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/menu">    <Button className="w-full bg-white text-pizza-primary border border-pizza-primary hover:text-white hover:bg-pizza-accent text-lg py-6">
              Adicionar mais itens ao pedido
            </Button></Link>
        
            <Button
              className="w-full bg-pizza-primary hover:bg-pizza-accent text-lg py-6"
              onClick={handleModalToggle} // Abre o modal para o cadastro
            >
              Finalizar Pedido
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Microcadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Preencha os dados abaixo</h2>
            <div className="flex flex-col mb-4">
              <label htmlFor="cpf" className="mb-2">CPF:</label>
              <input
                id="cpf"
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="border p-2 rounded mb-4"
              />
              <label htmlFor="nome" className="mb-2">Nome:</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="border p-2 rounded mb-4"
              />
              <label htmlFor="telefone" className="mb-2">Telefone:</label>
              <input
                id="telefone"
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="border p-2 rounded mb-4"
              />
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleModalToggle} // Fecha o modal
                className="w-1/3"
              >
                Cancelar
              </Button>
              <Button
                onClick={salvarCadastro}
                className="w-1/3 bg-pizza-primary text-white"
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Cart;
