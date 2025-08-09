export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          first_name: string | null;
          last_name: string | null;
          email: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
        };
      };
      invitations: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          groom_name: string;
          bride_name: string;
          wedding_date: string;
          wedding_time: string | null;
          venue: string;
          address: string;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          custom_message: string | null;
          template_id: string;
          image_url: string | null;
          rsvp_deadline: string | null;
          is_active: boolean;
          slug: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          groom_name: string;
          bride_name: string;
          wedding_date: string;
          wedding_time?: string | null;
          venue: string;
          address: string;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          custom_message?: string | null;
          template_id: string;
          image_url?: string | null;
          rsvp_deadline?: string | null;
          is_active?: boolean;
          slug: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          groom_name?: string;
          bride_name?: string;
          wedding_date?: string;
          wedding_time?: string | null;
          venue?: string;
          address?: string;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          custom_message?: string | null;
          template_id?: string;
          image_url?: string | null;
          rsvp_deadline?: string | null;
          is_active?: boolean;
          slug?: string;
        };
      };
      guests: {
        Row: {
          id: string;
          created_at: string;
          invitation_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          plus_one: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          invitation_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          plus_one?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          invitation_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          plus_one?: boolean;
        };
      };
      rsvps: {
        Row: {
          id: string;
          created_at: string;
          invitation_id: string;
          guest_name: string;
          will_attend: boolean;
          plus_one_attending: boolean | null;
          message: string | null;
          email: string | null;
          phone: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          invitation_id: string;
          guest_name: string;
          will_attend: boolean;
          plus_one_attending?: boolean | null;
          message?: string | null;
          email?: string | null;
          phone?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          invitation_id?: string;
          guest_name?: string;
          will_attend?: boolean;
          plus_one_attending?: boolean | null;
          message?: string | null;
          email?: string | null;
          phone?: string | null;
        };
      };
      custom_templates: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          name: string;
          description: string | null;
          category: string;
          colors: Json;
          fonts: Json;
          layout_config: Json;
          preview_image_url: string | null;
          is_public: boolean;
          is_featured: boolean;
          usage_count: number;
          tags: string[];
          is_active: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          name: string;
          description?: string | null;
          category?: string;
          colors?: Json;
          fonts?: Json;
          layout_config?: Json;
          preview_image_url?: string | null;
          is_public?: boolean;
          is_featured?: boolean;
          usage_count?: number;
          tags?: string[];
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          category?: string;
          colors?: Json;
          fonts?: Json;
          layout_config?: Json;
          preview_image_url?: string | null;
          is_public?: boolean;
          is_featured?: boolean;
          usage_count?: number;
          tags?: string[];
          is_active?: boolean;
        };
      };
    };
  };
}
