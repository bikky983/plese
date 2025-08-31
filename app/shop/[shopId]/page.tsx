"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline'
import { Shop, Product, shopDB, productDB } from '@/lib/shop-db'
import { ShopPage } from '@/components/shop-page'
import { supabase } from '@/lib/supabase'

export default function PublicShopPage() {
  const params = useParams()
  const shopId = params.shopId as string
  const [shop, setShop] = useState<Shop | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadShop = async () => {
      try {
        const shopData = await shopDB.getShopById(shopId)
        
        if (!shopData) {
          setError('Shop not found')
          setLoading(false)
          return
        }

        setShop(shopData)

        const productsData = await productDB.getShopProductsPublic(shopId)
        setProducts(productsData)
      } catch (err) {
        setError('Failed to load shop')
        console.error('Error loading shop:', err)
      } finally {
        setLoading(false)
      }
    }

    if (shopId) {
      loadShop()
    }
  }, [shopId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading shop...</p>
        </div>
      </div>
    )
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <BuildingStorefrontIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Shop Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'The shop you are looking for does not exist or has been removed.'}
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Home
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <ShopPage
      shop={shop}
      products={products}
      userId="" // No user ID for public view
      isEditable={false}
    />
  )
}
