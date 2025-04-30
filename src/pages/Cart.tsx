
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/supabaseClient";
import { Link } from "react-router-dom";
import { useAuth } from "@/integrations/supabase/auth-context";

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
    const telefoneLimpo = telefone.replace(/\D/g, "");

    const { data: clienteExistente, error: erroBusca } = await supabase
      .from("clientes")
      .select("*")
      .eq("cpf", cpf)
      .single();

    if (erroBusca && erroBusca.code !== "PGRST116") {
      console.error("Erro ao verificar cliente:", erroBusca);
      return;
    }

    if (!clienteExistente) {
      const { error: erroInsercao } = await supabase
        .from("clientes")
        .insert({ cpf, nome, telefone: telefoneLimpo });

      if (erroInsercao) {
        console.error("Erro ao inserir cliente:", erroInsercao);
        return;
      }

      console.log("Novo cliente cadastrado");
    } else {
      console.log("Cliente já cadastrado, pulando inserção");
    }

    const emailFake = `cliente${telefoneLimpo}@clienteapp.com`;
    const senhaAleatoria = Math.random().toString(36).slice(-10);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailFake,
        password: senhaAleatoria,
        options: {
          data: { nome, telefone: telefoneLimpo, cpf },
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
    if (!telefone) {
      alert("Telefone do cliente não informado.");
      return;
    }

    const numeroLimpo = telefone.replace(/\D/g, "");

    const { data: cliente, error: erroCliente } = await supabase
      .from("clientes")
      .select("id")
      .eq("telefone", numeroLimpo)
      .single();

    if (erroCliente || !cliente) {
      console.error("Cliente não encontrado:", erroCliente);
      return;
    }

    const mensagem = `Olá ${nome || ""}! Seu pedido foi recebido e está em produção. 🍕\n\nResumo do pedido:\n${items
      .map(
        (item) =>
          `- ${item.quantity}x ${item.name} (R$${(item.price * item.quantity).toFixed(2)})`
      )
      .join("\n")}\n\nTotal: R$${total.toFixed(2)}\n\nAgradecemos pela preferência!`;

    try {
      const response = await fetch(
        "https://api.z-api.io/instances/3E07E4B1D51390C321137AC1D8277FBB/token/B2616D2F3D357F5C58BC83CB/send-text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer B2616D2F3D357F5C58BC83CB",
          },
          body: JSON.stringify({
            phone: `55${numeroLimpo}`,
            message: mensagem,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro ao enviar mensagem via Z-API:", data);
      } else {
        console.log("Mensagem enviada com sucesso:", data);
      }
    } catch (err) {
      console.error("Erro na requisição Z-API:", err);
    }

    const { data: pedido, error: erroPedido } = await supabase
      .from("orders")
      .insert([
        {
          status: "pendente",
          items: items,
          total,
          created_at: new Date(),
          cliente_id: cliente.id,
        },
      ])
      .select()
      .single();

    if (erroPedido) {
      console.error("Erro ao salvar o pedido:", erroPedido);
    } else {
      console.log("Pedido salvo com sucesso:", pedido);
    }
  };

  // ... JSX permanece igual, não foi necessário alterar ...

  return <div>/* JSX completo omitido aqui para brevidade */</div>;
};

export default Cart;
