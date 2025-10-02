import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface Order {
  id: string;
  customer_name: string;
  items: Json;
  total: number;
  status: string;
  created_at: string;
}

export default function Cozinha() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return navigate("/admin/login"); // 🔐 proteção de rota

      // busca inicial
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setOrders(data as Order[]);

      setLoading(false);

      // realtime para novos pedidos
      const channel = supabase
        .channel("orders-realtime")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "orders" },
          (payload) => {
            setOrders((prev) => [payload.new as Order, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    })();
  }, [navigate]);

  if (loading) return <p className="p-6">Carregando pedidos...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">📦 Pedidos da Cozinha</h1>
      {orders.length === 0 ? (
        <p>Nenhum pedido no momento.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded shadow">
              <p>
                <strong>Cliente:</strong> {order.customer_name}
              </p>
              <p>
                <strong>Itens:</strong> {JSON.stringify(order.items)}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
