"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentArrowDownIcon, 
  Cog6ToothIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { ShopBanner } from './shop-banner'
import { ProductGrid } from './product-grid'
import { ShareShop } from './share-shop'
import { Shop, Product, shopDB, productDB, autoSave } from '@/lib/shop-db'
import { pdfExport } from '@/lib/pdf-export'

interface ShopPageProps {
  shop: Shop
  products: Product[]
  userId: string
  isEditable?: boolean
  onShopUpdate?: (shop: Shop) => void
  onProductsUpdate?: (products: Product[]) => void
}

export function ShopPage({
  shop,
  products,
  userId,
  isEditable = false,
  onShopUpdate,
  onProductsUpdate
}: ShopPageProps) {
  const [currentShop, setCurrentShop] = useState(shop)
  const [currentProducts, setCurrentProducts] = useState(products)
  const [isExporting, setIsExporting] = useState(false)
  const [editMode, setEditMode] = useState(false)

  // Auto-save functions with debouncing
  const debouncedSaveShop = autoSave.debounce(autoSave.saveShop, 1000)
  const debouncedSaveProduct = autoSave.debounce(autoSave.saveProduct, 1000)

  const handleShopUpdate = (updates: Partial<Shop>) => {
    const updatedShop = { ...currentShop, ...updates }
    setCurrentShop(updatedShop)
    
    if (onShopUpdate) {
      onShopUpdate(updatedShop)
    }

    // Auto-save
    if (isEditable) {
      debouncedSaveShop(shop.id, updates)
    }
  }

  const handleProductsUpdate = (newProducts: Product[]) => {
    setCurrentProducts(newProducts)
    
    if (onProductsUpdate) {
      onProductsUpdate(newProducts)
    }
  }

  const handleBannerUpdate = (imageUrl: string) => {
    handleShopUpdate({ banner_image_url: imageUrl })
  }

  const handleBannerHeightChange = (height: number) => {
    handleShopUpdate({ banner_height: height })
  }

  const handleGridColumnsChange = (columns: 3 | 4 | 5) => {
    handleShopUpdate({ grid_columns: columns })
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await pdfExport.exportShop(currentShop, currentProducts, {
        includeImages: true,
        pageFormat: 'a4',
        orientation: 'portrait'
      })
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportCurrentView = async () => {
    setIsExporting(true)
    try {
      await pdfExport.exportCurrentView(
        'shop-content',
        `${currentShop.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_preview.pdf`
      )
    } catch (error) {
      console.error('Error exporting current view:', error)
      alert('Failed to export current view. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Action Bar */}
      {isEditable && (
        <div className="bg-card border-b border-border sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    editMode
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {editMode ? <EyeIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                  <span className="text-sm font-medium">
                    {editMode ? 'Preview' : 'Edit'}
                  </span>
                </button>
                
                <div className="text-sm text-muted-foreground">
                  {currentProducts.length} product{currentProducts.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <ShareShop shopId={shop.id} shopName={shop.name} />
                
                <button
                  onClick={handleExportCurrentView}
                  disabled={isExporting}
                  className="flex items-center space-x-2 px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg transition-colors disabled:opacity-50"
                  title="Export current view as PDF"
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {isExporting ? 'Exporting...' : 'Export View'}
                  </span>
                </button>

                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
                  title="Export catalog as PDF"
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {isExporting ? 'Exporting...' : 'Export Catalog'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shop Content */}
      <div id="shop-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shop Banner */}
        <ShopBanner
          shopName={currentShop.name}
          description={currentShop.description}
          bannerImageUrl={currentShop.banner_image_url}
          bannerHeight={currentShop.banner_height}
          isEditable={isEditable && editMode}
          onBannerUpdate={handleBannerUpdate}
          onHeightChange={handleBannerHeightChange}
          userId={userId}
        />

        {/* Products Grid */}
        <div className="mt-12">
          <ProductGrid
            products={currentProducts}
            gridColumns={currentShop.grid_columns}
            shopId={currentShop.id}
            userId={userId}
            isEditable={isEditable && editMode}
            onProductsChange={handleProductsUpdate}
            onGridColumnsChange={handleGridColumnsChange}
          />
        </div>
      </div>

      {/* Auto-save indicator */}
      {isEditable && (
        <div className="fixed bottom-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500 text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg"
          >
            ✓ Auto-saved
          </motion.div>
        </div>
      )}
    </div>
  )
}
