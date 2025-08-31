"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon
} from "@heroicons/react/24/outline"
import { auth, isSupabaseConfigured } from "@/lib/supabase"
import { Shop, Product, shopDB, productDB } from "@/lib/shop-db"
import { ShopSetupWizard } from "@/components/shop-setup-wizard"
import { ShopPage } from "@/components/shop-page"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [shop, setShop] = useState<Shop | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [showSetupWizard, setShowSetupWizard] = useState(false)
  const [view, setView] = useState<'dashboard' | 'shop-edit' | 'shop-preview'>('dashboard')
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        if (!isSupabaseConfigured()) {
          console.warn('Supabase is not configured. Redirecting to login.')
          router.push('/auth/login?error=supabase_not_configured')
          return
        }

        const { data: { user }, error } = await auth.getUser()
        
        if (error || !user) {
          router.push('/auth/login')
          return
        }
        
        setUser(user)
        
        // Load user's shop and products
        const userShop = await shopDB.getUserShop(user.id)
        if (userShop) {
          setShop(userShop)
          const shopProducts = await productDB.getShopProducts(userShop.id)
          setProducts(shopProducts)
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Error in dashboard:', err)
        router.push('/auth/login')
      }
    }

    getUser()
  }, [router])

  const handleSignOut = async () => {
    try {
      if (isSupabaseConfigured()) {
        await auth.signOut()
      }
    } catch (err) {
      console.error('Error signing out:', err)
    } finally {
      router.push('/')
    }
  }

  const handleShopSetupComplete = (newShop: Shop) => {
    setShop(newShop)
    setShowSetupWizard(false)
    setView('shop-edit')
  }

  const handleShopUpdate = (updatedShop: Shop) => {
    setShop(updatedShop)
  }

  const handleProductsUpdate = (updatedProducts: Product[]) => {
    setProducts(updatedProducts)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show setup wizard if user wants to create a shop
  if (showSetupWizard) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Shop</h1>
            <p className="text-muted-foreground">
              Let's set up your beautiful online shop in just a few steps
            </p>
          </div>
          <ShopSetupWizard
            userId={user.id}
            onComplete={handleShopSetupComplete}
          />
        </motion.div>
      </div>
    )
  }

  // Show shop editor or preview
  if (view === 'shop-edit' || view === 'shop-preview') {
    if (!shop) return null
    
    return (
      <ShopPage
        shop={shop}
        products={products}
        userId={user.id}
        isEditable={view === 'shop-edit'}
        onShopUpdate={handleShopUpdate}
        onProductsUpdate={handleProductsUpdate}
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Shop Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {user?.user_metadata?.full_name || user?.email}!
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>

        {/* Shop Status */}
        {shop ? (
          <div className="space-y-8">
            {/* Shop Overview Card */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BuildingStorefrontIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-card-foreground">{shop.name}</h2>
                    <p className="text-muted-foreground">
                      {products.length} product{products.length !== 1 ? 's' : ''} • 
                      {shop.grid_columns} column layout
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setView('shop-preview')}
                    className="flex items-center space-x-2 px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg transition-colors"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Preview</span>
                  </button>
                  <button
                    onClick={() => setView('shop-edit')}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Edit Shop</span>
                  </button>
                </div>
              </div>
              
              {shop.description && (
                <p className="text-muted-foreground">{shop.description}</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <BuildingStorefrontIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Total Products</h3>
                    <p className="text-2xl font-bold text-primary">{products.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-semibold">$</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Avg. Price</h3>
                    <p className="text-2xl font-bold text-primary">
                      ${products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Auto-Save</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">Enabled</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            {products.length > 0 && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Products</h3>
                <div className="space-y-3">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-muted-foreground text-xs">No Image</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-card-foreground">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(product.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // No shop created yet
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-lg border border-border p-8 max-w-md mx-auto"
            >
              <BuildingStorefrontIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Create Your Shop</h2>
              <p className="text-muted-foreground mb-6">
                Start building your beautiful online shop with our easy-to-use tools. 
                Add products, customize your layout, and share with customers.
              </p>
              <button
                onClick={() => setShowSetupWizard(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mx-auto"
              >
                <PlusIcon className="h-5 w-5" />
                <span className="font-medium">Create Shop</span>
              </button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
