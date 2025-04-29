import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/supabaseClient";
import { Link } from "react-router-dom";
import { useAuth } from "@/integrations/supabase/auth-context";

// ... imports ...

const Cart = () => {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const handleModalToggle = () => {
    if (user) {
      finalizarPedido();
    } else {
      setIsModalOpen(!isModalOpen);
    }
  };

  const salvarCadastro = async () => {
    // 1. Verifica se o cliente já está no banco
    const { data: clienteExistente, error: erroBusca } = await supabase
      .from("clientes")
      .select("*")
      .eq("cpf", cpf)
      .single();

    if (erroBusca && erroBusca.code !== "PGRST116") {
      console.error("Erro ao verificar cliente:", erroBusca);
      return;
    }

    // 2. Se não existir, insere
    if (!clienteExistente) {
      const { error: erroInsercao } = await supabase
        .from("clientes")
        .insert({ cpf, nome, telefone });

      if (erroInsercao) {
        console.error("Erro ao inserir cliente:", erroInsercao);
        return;
      }

      console.log("Novo cliente cadastrado");
    } else {
      console.log("Cliente já cadastrado, pulando inserção");
    }

    // 3. Gera e-mail fake e tenta criar conta invisível
    const emailFake = `cliente${telefone.replace(/\D/g, "")}@clienteapp.com`;
    const senhaAleatoria = Math.random().toString(36).slice(-10);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailFake,
        password: senhaAleatoria,
        options: {
          data: { nome, telefone, cpf },
        },
      });

      if (authError) {
        if (
          authError.message.includes("invalid") ||
          authError.status === 400
        ) {
          console.warn("Conta Auth já existe ou e-mail inválido. Ignorando.");
        } else {
          throw authError;
        }
      } else {
        console.log("Conta invisível criada:", authData);
      }
    } catch (err) {
      console.error("Erro ao criar conta Auth:", err);
      return;
    }

    setIsModalOpen(false);
    finalizarPedido();
  };

  const finalizarPedido = async () => {
    const numero = "5534988941337";
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

    const { data, error } = await supabase.from("orders").insert([
      {
        status: "pendente",
        items: JSON.stringify(items),
        total,
        created_at: new Date(),
      },
    ]);

    if (error) {
      console.error("Erro ao salvar o pedido:", error);
    } else {
      console.log("Pedido salvo com sucesso:", data);
    }
  };

  
  return (
    <div className="min-h-screen bg-pizza-light">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>

        <div className="grid gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6">
              <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex-grow">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-pizza-accent font-bold">
                  R${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
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
            <Link to="/menu">
              <Button className="w-full bg-white text-pizza-primary border border-pizza-primary hover:text-white hover:bg-pizza-accent text-lg py-6">
                Adicionar mais itens ao pedido
              </Button>
            </Link>

            <Button className="w-full bg-pizza-primary hover:bg-pizza-accent text-lg py-6" onClick={handleModalToggle}>
              Finalizar Pedido
            </Button>
          </div>
        </div>
      </div>

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
              <Button variant="outline" onClick={handleModalToggle} className="w-1/3">
                Cancelar
              </Button>
              <Button onClick={salvarCadastro} className="w-1/3 bg-pizza-primary text-white">
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
