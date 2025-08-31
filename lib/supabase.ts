import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, metadata?: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  signInWithProvider: async (provider: 'google' | 'github' | 'discord') => {
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
  },

  updatePassword: async (password: string) => {
    return await supabase.auth.updateUser({
      password,
    })
  },

  getUser: async () => {
    return await supabase.auth.getUser()
  },

  getSession: async () => {
    return await supabase.auth.getSession()
  },
}

// Database helpers
export const db = {
  // Generic CRUD operations
  create: async (table: string, data: any) => {
    return await supabase.from(table).insert(data).select()
  },

  read: async (table: string, query?: any) => {
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
    return await supabase.from(table).update(data).eq('id', id).select()
  },

  delete: async (table: string, id: string) => {
    return await supabase.from(table).delete().eq('id', id)
  },
}

// Storage helpers
export const storage = {
  upload: async (bucket: string, path: string, file: File) => {
    return await supabase.storage.from(bucket).upload(path, file)
  },

  download: async (bucket: string, path: string) => {
    return await supabase.storage.from(bucket).download(path)
  },

  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage.from(bucket).getPublicUrl(path)
  },

  remove: async (bucket: string, paths: string[]) => {
    return await supabase.storage.from(bucket).remove(paths)
  },
}

export default supabase
