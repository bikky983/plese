import { supabase, isSupabaseConfigured } from './supabase'

export interface Shop {
  id: string
  user_id: string
  name: string
  description?: string
  banner_image_url?: string
  banner_height: number
  grid_columns: 3 | 4 | 5
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  shop_id: string
  name: string
  description?: string
  price: number
  image_url?: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text?: string
  is_primary: boolean
  created_at: string
}

// Shop operations
export const shopDB = {
  // Get shop by ID (public access)
  getShopById: async (shopId: string): Promise<Shop | null> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return null
    }

    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .single()
    
    if (error) {
      console.error('Error fetching shop:', error)
      return null
    }
    
    return data
  },
  // Get user's shop
  getUserShop: async (userId: string): Promise<Shop | null> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return null
    }

    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching shop:', error)
      return null
    }
    
    return data
  },

  // Create a new shop
  createShop: async (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at'>): Promise<Shop | null> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return null
    }

    const { data, error } = await supabase
      .from('shops')
      .insert(shopData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating shop:', error)
      return null
    }
    
    return data
  },

  // Update shop
  updateShop: async (shopId: string, updates: Partial<Shop>): Promise<Shop | null> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return null
    }

    const { data, error } = await supabase
      .from('shops')
      .update(updates)
      .eq('id', shopId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating shop:', error)
      return null
    }
    
    return data
  },

  // Delete shop
  deleteShop: async (shopId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return false
    }

    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', shopId)
    
    if (error) {
      console.error('Error deleting shop:', error)
      return false
    }
    
    return true
  }
}

// Product operations
export const productDB = {
  // Get products for a shop (public access)
  getShopProductsPublic: async (shopId: string): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return []
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .eq('is_active', true)
      .order('position', { ascending: true })
    
    if (error) {
      console.error('Error fetching products:', error)
      return []
    }
    
    return data || []
  },
  // Get products for a shop
  getShopProducts: async (shopId: string): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return []
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .eq('is_active', true)
      .order('position', { ascending: true })
    
    if (error) {
      console.error('Error fetching products:', error)
      return []
    }
    
    return data || []
  },

  // Create product
  createProduct: async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return null
    }

    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating product:', error)
      return null
    }
    
    return data
  },

  // Update product
  updateProduct: async (productId: string, updates: Partial<Product>): Promise<Product | null> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return null
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating product:', error)
      return null
    }
    
    return data
  },

  // Delete product
  deleteProduct: async (productId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return false
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
    
    if (error) {
      console.error('Error deleting product:', error)
      return false
    }
    
    return true
  },

  // Reorder products
  reorderProducts: async (updates: { id: string; position: number }[]): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return false
    }

    const { error } = await supabase
      .from('products')
      .upsert(updates.map(update => ({ id: update.id, position: update.position })))
    
    if (error) {
      console.error('Error reordering products:', error)
      return false
    }
    
    return true
  }
}

// Image operations
export const imageDB = {
  // Upload image to storage
  uploadImage: async (file: File, bucket: 'product-images' | 'banner-images', userId: string): Promise<string | null> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return null
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)
    
    if (error) {
      console.error('Error uploading image:', error)
      return null
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    return publicUrl
  },

  // Delete image from storage
  deleteImage: async (url: string, bucket: 'product-images' | 'banner-images'): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return false
    }

    // Extract file path from URL
    const urlParts = url.split('/')
    const fileName = urlParts.slice(-2).join('/')
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])
    
    if (error) {
      console.error('Error deleting image:', error)
      return false
    }
    
    return true
  }
}

// Auto-save functionality
export const autoSave = {
  // Debounced save function
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number): T => {
    let timeout: NodeJS.Timeout
    return ((...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(null, args), wait)
    }) as T
  },

  // Auto-save shop changes
  saveShop: async (shopId: string, data: Partial<Shop>): Promise<void> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return
    }
    await shopDB.updateShop(shopId, data)
  },

  // Auto-save product changes
  saveProduct: async (productId: string, data: Partial<Product>): Promise<void> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured')
      return
    }
    await productDB.updateProduct(productId, data)
  }
}
