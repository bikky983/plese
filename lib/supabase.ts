import { createClient } from '@supabase/supabase-js'

// Safely handle missing environment variables during build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create a safe default client that won't crash during build
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, metadata?: any) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
  },

  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  signInWithProvider: async (provider: 'google' | 'github' | 'discord') => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  },

  signOut: async () => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    return await supabase.auth.signOut()
  },

  resetPassword: async (email: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
  },

  updatePassword: async (password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    return await supabase.auth.updateUser({
      password,
    })
  },

  getUser: async () => {
    if (!isSupabaseConfigured()) {
      return { data: { user: null }, error: new Error('Supabase is not configured') }
    }
    return await supabase.auth.getUser()
  },

  getSession: async () => {
    if (!isSupabaseConfigured()) {
      return { data: { session: null }, error: new Error('Supabase is not configured') }
    }
    return await supabase.auth.getSession()
  },
}

// Database helpers
export const db = {
  // Generic CRUD operations
  create: async (table: string, data: any) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    return await supabase.from(table).insert(data).select()
  },

  read: async (table: string, query?: any) => {
    if (!isSupabaseConfigured()) {
      return { data: [], error: new Error('Supabase is not configured') }
    }
    
    let supabaseQuery = supabase.from(table).select('*')
    
    if (query?.filter) {
      supabaseQuery = supabaseQuery.filter(query.filter.column, query.filter.operator, query.filter.value)
    }
    
    if (query?.order) {
      supabaseQuery = supabaseQuery.order(query.order.column, { ascending: query.order.ascending })
    }
    
    if (query?.limit) {
      supabaseQuery = supabaseQuery.limit(query.limit)
    }
    
    return await supabaseQuery
  },

  update: async (table: string, id: string, data: any) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    return await supabase.from(table).update(data).eq('id', id).select()
  },

  delete: async (table: string, id: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    return await supabase.from(table).delete().eq('id', id)
  },
}

// Storage helpers
export const storage = {
  upload: async (bucket: string, path: string, file: File) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    return await supabase.storage.from(bucket).upload(path, file)
  },

  download: async (bucket: string, path: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    return await supabase.storage.from(bucket).download(path)
  },

  getPublicUrl: (bucket: string, path: string) => {
    if (!isSupabaseConfigured()) {
      return { data: { publicUrl: '' } }
    }
    return supabase.storage.from(bucket).getPublicUrl(path)
  },

  remove: async (bucket: string, paths: string[]) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set up your environment variables.')
    }
    return await supabase.storage.from(bucket).remove(paths)
  },
}

export default supabase
