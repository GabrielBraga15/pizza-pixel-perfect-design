export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string;
          category?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          itens: Json;
          total: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          itens: Json;
          total: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          itens?: Json;
          total?: number;
          status?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
