"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BuildingStorefrontIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Shop } from '@/lib/shop-db'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadShops = async () => {
      try {
        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
          console.warn('Supabase is not configured. Using empty shops list.')
          setShops([])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error loading shops:', error)
        } else {
          setShops(data || [])
        }
      } catch (err) {
        console.error('Error loading shops:', err)
      } finally {
        setLoading(false)
      }
    }

    loadShops()
  }, [])

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (shop.description && shop.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading shops...</p>
        </div>
      </div>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Discover Amazing Shops
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our collection of beautiful online shops and discover unique products from talented creators.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search shops..."
            />
          </div>
        </div>

        {/* Shops Grid */}
        {filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShops.map((shop, index) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/shop/${shop.id}`} className="block group">
                  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105">
                    {/* Shop Banner */}
                    <div
                      className="relative h-48 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20"
                      style={shop.banner_image_url ? {
                        backgroundImage: `url(${shop.banner_image_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {}}
                    >
                      <div className="absolute inset-0 bg-black/30"></div>
                      <div className="relative h-full flex items-center justify-center p-6">
                        <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">
                          {shop.name}
                        </h3>
                      </div>
                    </div>

                    {/* Shop Info */}
                    <div className="p-6">
                      {shop.description && (
                        <p className="text-muted-foreground line-clamp-2 mb-4">
                          {shop.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <BuildingStorefrontIcon className="h-4 w-4" />
                          <span>{shop.grid_columns} column layout</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(shop.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BuildingStorefrontIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm ? 'No shops found' : 'No shops yet'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Try adjusting your search terms or browse all shops.' 
                : 'Be the first to create a beautiful shop!'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
