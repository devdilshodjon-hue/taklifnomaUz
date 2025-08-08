import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tcilxdkolqodtgowlgrh.supabase.co'
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjaWx4ZGtvbHFvZHRnb3dsZ3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTM1NTEsImV4cCI6MjA3MDIyOTU1MX0.9LFErrgcBMKQVOrl0lndUfBXMdAWmq6206sbBzgk32A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Supabase jadvallar mavjudligini tekshirish
export const checkDatabaseSetup = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('invitations')
      .select('id')
      .limit(1);

    if (error && error.message.includes('table') && error.message.includes('does not exist')) {
      return false;
    }

    return true;
  } catch (error) {
    console.log('Database tekshiruvida xatolik:', error);
    return false;
  }
}

// Error xabaridan jadval mavjud emasligini aniqlash
export const isTableNotFoundError = (error: any): boolean => {
  if (!error) return false;
  const message = error.message || '';
  return message.includes('Could not find the table') ||
         message.includes('table') && message.includes('does not exist') ||
         message.includes('schema cache');
}

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          first_name: string | null
          last_name: string | null
          email: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          avatar_url?: string | null
        }
      }
      invitations: {
        Row: {
          id: string
          created_at: string
          user_id: string
          groom_name: string
          bride_name: string
          wedding_date: string
          wedding_time: string | null
          venue: string
          address: string
          city: string | null
          state: string | null
          zip_code: string | null
          custom_message: string | null
          template_id: string
          image_url: string | null
          rsvp_deadline: string | null
          is_active: boolean
          slug: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          groom_name: string
          bride_name: string
          wedding_date: string
          wedding_time?: string | null
          venue: string
          address: string
          city?: string | null
          state?: string | null
          zip_code?: string | null
          custom_message?: string | null
          template_id: string
          image_url?: string | null
          rsvp_deadline?: string | null
          is_active?: boolean
          slug: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          groom_name?: string
          bride_name?: string
          wedding_date?: string
          wedding_time?: string | null
          venue?: string
          address?: string
          city?: string | null
          state?: string | null
          zip_code?: string | null
          custom_message?: string | null
          template_id?: string
          image_url?: string | null
          rsvp_deadline?: string | null
          is_active?: boolean
          slug?: string
        }
      }
      guests: {
        Row: {
          id: string
          created_at: string
          invitation_id: string
          name: string
          email: string | null
          phone: string | null
          plus_one: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          invitation_id: string
          name: string
          email?: string | null
          phone?: string | null
          plus_one?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          invitation_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          plus_one?: boolean
        }
      }
      rsvps: {
        Row: {
          id: string
          created_at: string
          invitation_id: string
          guest_name: string
          will_attend: boolean
          plus_one_attending: boolean | null
          message: string | null
          email: string | null
          phone: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          invitation_id: string
          guest_name: string
          will_attend: boolean
          plus_one_attending?: boolean | null
          message?: string | null
          email?: string | null
          phone?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          invitation_id?: string
          guest_name?: string
          will_attend?: boolean
          plus_one_attending?: boolean | null
          message?: string | null
          email?: string | null
          phone?: string | null
        }
      }
    }
  }
}
