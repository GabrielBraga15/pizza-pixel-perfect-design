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
  const [uploading, setUploading] = useState(false);

  // Busca inicial
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return navigate("/admin/login");

      const { data, error } = await supabase.from("menu_items").select("*");
      if (error) console.error(error);
      else
        setItems(
          ((data || []) as Partial<MenuItem>[]).map((item) => ({
            ...item,
            is_active: (item as MenuItem).is_active ?? true, // fallback if missing
          })) as MenuItem[]
        );
      setLoading(false);
    })();
  }, [navigate]);

  // Excluir
  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (!error) setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Alterar valores só localmente
  const handleLocalChange = (
    id: string,
    field: keyof MenuItem,
    value: string | number | boolean | null
  ) => {
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

  // Criar novo item
  const createItem = async () => {
    if (!newItem.name) return alert("O nome é obrigatório!");
    if (!newItem.image_url) return alert("Faça o upload da imagem primeiro!");

    const payload = {
      name: newItem.name,
      description: newItem.description || null,
      price: newItem.price ?? 0,
      image_url: newItem.image_url,
      category: newItem.category || "geral",
      is_featured: newItem.is_featured ?? false,
      is_active: true, // Explicitly set is_active
    };

    const { data, error } = await supabase
      .from("menu_items")
      .insert([payload])
      .select()
      .single();

    if (error) return console.error("Erro ao criar item:", error);

    setItems((prev) => [...prev, { ...data, is_active: true } as MenuItem]);
    setNewItem({});
  };

  // Upload de imagem para novo item
  // Upload de imagem para novo item (versão correta)
  const handleImageUploadNewItem = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "menu_upload"); // configurado no Cloudinary

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dvysyna0q/image/upload", // troque "meuapp123" pelo seu cloud_name
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        console.log("Imagem URL:", data.secure_url);

        // Só seta no estado do novo item, não insere ainda no banco
        setNewItem((prev) => ({ ...prev, image_url: data.secure_url }));
      }
    } catch (error) {
      console.error("Erro no upload:", error);
    } finally {
      setUploading(false);
    }
  };

  // Upload de imagem para item existente
  // Upload de imagem para item existente (usando Cloudinary também)
  const handleImageUploadExistingItem = async (file: File, itemId: string) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "menu_upload"); // mesmo preset do novo item

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dvysyna0q/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        console.log("Imagem URL:", data.secure_url);

        // Atualiza localmente
        handleLocalChange(itemId, "image_url", data.secure_url);

        // Atualiza no banco imediatamente
        const { error: updateError } = await supabase
          .from("menu_items")
          .update({ image_url: data.secure_url })
          .eq("id", itemId);

        if (updateError) console.error(updateError);
      }
    } catch (error) {
      console.error("Erro no upload existente:", error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 space-y-8">
      <div className="sm:flex-row flex-col flex justify-between items-center">
        <h1 className="sm:text-5xl sm:pb-0 pb-5 text-3xl font-bold text-center font-sans flex-1">
          PAINEL ADMINISTRATIVO
        </h1>

        {/* Botão para a cozinha */}
        <Button
          onClick={() => navigate("/cozinha")}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded ml-0 sm:ml-4"
        >
          👨‍🍳 Ir para a Cozinha
        </Button>
      </div>

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
        <div className="sm:flex gap-10 flex-col">
          <input
            className="w-48 sm:w-auto"
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && handleImageUploadNewItem(e.target.files[0])
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
            disabled={uploading || !newItem.image_url} // 🔹 desabilita enquanto o upload está acontecendo
          >
            {uploading ? "Enviando imagem..." : "Salvar novo item"}
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
                      handleImageUploadExistingItem(e.target.files[0], item.id)
                    }
                  />
                  <Edit className="w-4 h-4 text-gray-600" />
                </label>
              </div>

              <CardContent className="p-4 space-y-3">
                <input
                  className="text-lg font-semibold w-full border-b focus:outline-none"
                  value={pending.name ?? item.name}
                  onChange={(e) =>
                    handleLocalChange(item.id, "name", e.target.value)
                  }
                />
                <textarea
                  className="text-sm text-gray-600 w-full border p-1 rounded"
                  value={pending.description ?? (item.description || "")}
                  placeholder="Descrição..."
                  onChange={(e) =>
                    handleLocalChange(item.id, "description", e.target.value)
                  }
                />
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
