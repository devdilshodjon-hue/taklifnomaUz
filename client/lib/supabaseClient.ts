import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Supabase URL va Key ni environment variables dan olish
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables not found! Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.')
}

console.log('🔧 Supabase client initializing with:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyPrefix: supabaseAnonKey?.substring(0, 20) + '...'
})

// Enhanced Supabase client with proper configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window?.localStorage,
    storageKey: 'taklifnoma-auth-token'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-client-info': 'taklifnoma-app@1.0.0',
      'x-application-name': 'TaklifNoma.uz'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Test connection on initialization
supabase.from('profiles').select('count').limit(1).then(({ data, error }) => {
  if (error) {
    console.warn('⚠️ Supabase connection test failed:', error.message)
  } else {
    console.log('✅ Supabase connection successful')
  }
})

// Export types
export type SupabaseClient = typeof supabase
export * from './database.types'
