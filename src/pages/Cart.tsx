import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const Cart = () => {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart(); // 🔹 pega clearCart

  const finalizarPedido = async () => {
    if (items.length === 0) return alert("Carrinho vazio!");

    const totalPedido = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // 1️⃣ Inserir no Supabase
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: "Cliente sem login", // temporário
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: totalPedido,
          status: "pendente",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar pedido:", error);
      return alert("Erro ao enviar pedido. Tente novamente.");
    }

    // 2️⃣ Mensagem de confirmação local
    alert(
      `Pedido recebido! Total: R$${totalPedido.toFixed(
        2
      )}. Estamos preparando seu pedido.`
    );

    // 3️⃣ Limpar carrinho usando o contexto
    clearCart(); // ✅ chama a função do CartContext
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
          <Link to="/menu">
            <Button className="bg-pizza-primary hover:bg-pizza-accent">
              Ver Cardápio
            </Button>
          </Link>
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
              className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4"
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
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 w-20 sm:w-auto">
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
                <Button
                  className="w-20 sm:w-auto"
                  variant="destructive"
                  onClick={() => removeItem(item.id)}
                >
                  Remover
                </Button>
              </div>
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
            <Link to={"/menu"}>
              <Button className="w-full bg-white text-pizza-primary border border-pizza-primary hover:text-white hover:bg-pizza-accent text-lg py-6">
                Adicionar mais itens ao pedido
              </Button>
            </Link>
            <Button
              className="w-full bg-pizza-primary hover:bg-pizza-accent text-lg py-6"
              onClick={finalizarPedido}
            >
              Finalizar Pedido
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
