import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react";
import { Switch } from "@radix-ui/react-switch";
import { Button } from "@/components/ui/button";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_active: boolean;
  category: string;
  is_featured: boolean;
}

export default function Admin() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({});
  const [editedItems, setEditedItems] = useState<
    Record<string, Partial<MenuItem>>
  >({});

  // Busca inicial
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return navigate("/admin/login");

      const { data, error } = await supabase.from("menu_items").select("*");
      if (error) console.error(error);
      else setItems(data || []);
      setLoading(false);
    })();
  }, [navigate]);

  // Excluir
  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (!error) setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Alterar valores só localmente
  const handleLocalChange = (id: string, field: keyof MenuItem, value: any) => {
    setEditedItems((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // Salvar alterações no banco
  const saveItem = async (id: string) => {
    const changes = editedItems[id];
    if (!changes) return;

    const { error } = await supabase
      .from("menu_items")
      .update(changes)
      .eq("id", id);
    if (!error) {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...changes } : i))
      );
      setEditedItems((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } else {
      console.error(error);
    }
  };

  const createItem = async () => {
    const payload = {
      name: newItem.name || "",
      description: newItem.description || null,
      price: newItem.price ?? 0,
      image_url: newItem.image_url || "", // 👈 já vem pronto do handleImageUpload
      category: newItem.category || "geral",
      is_featured: newItem.is_featured ?? false,
    };

    const { data, error } = await supabase
      .from("menu_items")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar item:", error.message, error.details);
    } else if (data) {
      setItems((prev) => [...prev, data]);
      setNewItem({});
    }
  };

  // Upload de imagem para o Storage
  const handleImageUpload = async (file: File, itemId?: string) => {
    const filePath = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("menu-images") // 👈 CONFIRMAR se é exatamente esse nome no seu Supabase
      .upload(filePath, file);

    if (error) return console.error(error);

    const { data: publicUrl } = supabase.storage
      .from("menu-images")
      .getPublicUrl(filePath);

    if (itemId) {
      handleLocalChange(itemId, "image_url", publicUrl.publicUrl);
    } else {
      setNewItem((prev) => ({ ...prev, image_url: publicUrl.publicUrl }));
    }
  };

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 space-y-8 ">
      <h1 className="sm:text-5xl text-3xl font-bold text-center font-sans">
        PAINEL ADMINISTRATIVO
      </h1>

      {/* Novo item */}
      <div className="border p-4 rounded-sm space-y-4">
        <h2 className="text-xl font-semibold font-sans">ADICIONAR ITEM</h2>
        <input
          className="border p-2 w-full"
          placeholder="Nome"
          value={newItem.name || ""}
          onChange={(e) =>
            setNewItem((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Descrição"
          value={newItem.description || ""}
          onChange={(e) =>
            setNewItem((prev) => ({ ...prev, description: e.target.value }))
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Preço"
          type="number"
          value={newItem.price || ""}
          onChange={(e) =>
            setNewItem((prev) => ({
              ...prev,
              price: parseFloat(e.target.value),
            }))
          }
        />
        <div className="sm:flex  gap-10 flex-col">
          <input
            className="w-48 sm:w-auto"
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && handleImageUpload(e.target.files[0])
            }
          />
          {newItem.image_url && (
            <img
              src={newItem.image_url}
              alt="preview"
              className="h-24 mt-2 rounded"
            />
          )}
          <button
            className="bg-green-500 font-bold max-w-48 hover:bg-green-700 transition-all text-white mt-4 sm:mt-0 px-4 py-2 rounded"
            onClick={createItem}
          >
            Salvar novo item
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {items.map((item) => {
          const pending = editedItems[item.id] || {};
          return (
            <Card
              key={item.id}
              className="shadow-lg rounded-2xl overflow-hidden"
            >
              <div className="relative">
                {(pending.image_url ?? item.image_url) && (
                  <img
                    src={pending.image_url ?? item.image_url}
                    alt={item.name}
                    className="h-40 w-full object-cover"
                  />
                )}
                <label className="absolute top-2 right-2 bg-white p-1 rounded shadow cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files &&
                      handleImageUpload(e.target.files[0], item.id)
                    }
                  />
                  <Edit className="w-4 h-4 text-gray-600" />
                </label>
              </div>

              <CardContent className="p-4 space-y-3">
                {/* Nome */}
                <input
                  className="text-lg font-semibold w-full border-b focus:outline-none"
                  value={pending.name ?? item.name}
                  onChange={(e) =>
                    handleLocalChange(item.id, "name", e.target.value)
                  }
                />

                {/* Descrição */}
                <textarea
                  className="text-sm text-gray-600 w-full border p-1 rounded"
                  value={pending.description ?? (item.description || "")}
                  placeholder="Descrição..."
                  onChange={(e) =>
                    handleLocalChange(item.id, "description", e.target.value)
                  }
                />

                {/* Preço + Ativo */}
                <div className="flex justify-between items-center">
                  <input
                    className="border p-1 rounded w-24"
                    type="number"
                    value={pending.price ?? item.price}
                    onChange={(e) =>
                      handleLocalChange(
                        item.id,
                        "price",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Ativo</span>
                    <Switch
                      checked={pending.is_active ?? item.is_active}
                      onCheckedChange={(val) =>
                        handleLocalChange(item.id, "is_active", val)
                      }
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-3">
                  {editedItems[item.id] && (
                    <Button
                      className="bg-blue-500 text-white"
                      size="sm"
                      onClick={() => saveItem(item.id)}
                    >
                      Salvar alterações
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                    className="hover:bg-red-700"
                  >
                    <Trash className="w-4 h-4 mr-1 " /> Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
