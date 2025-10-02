import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CadastroProps {
  onSuccess: () => void;
}

const Cadastro = ({ onSuccess }: CadastroProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!email || !password || !cpf || !telefone) {
      return alert("Preencha todos os campos!");
    }

    setLoading(true);

    try {
      // 1️⃣ Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro inesperado ao criar usuário");

      const userId = authData.user.id;

      // 2️⃣ Inserir dados adicionais na tabela clients
      const { data: existingClient } = await supabase
        .from("clients")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (!existingClient) {
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .insert([{ id: userId, cpf, phone: telefone }])
          .select()
          .single();

        if (clientError) throw clientError;
      }

      alert("Cadastro realizado com sucesso!");
      onSuccess();
    } catch (error: unknown) {
      console.error("Erro ao cadastrar:", error);
      if (error instanceof Error) {
        alert("Erro ao cadastrar: " + error.message);
      } else {
        alert("Erro ao cadastrar: Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Cadastro</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-4"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white py-2 w-full rounded"
          onClick={handleCadastro}
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </div>
    </div>
  );
};

export default Cadastro;
