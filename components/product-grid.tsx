"use client"

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  PlusIcon,
  PhotoIcon,
  PencilIcon,
  TrashIcon,
  ViewColumnsIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { Product, productDB, imageDB } from '@/lib/shop-db'

interface ProductGridProps {
  products: Product[]
  gridColumns: 3 | 4 | 5
  shopId: string
  userId: string
  isEditable?: boolean
  onProductsChange?: (products: Product[]) => void
  onGridColumnsChange?: (columns: 3 | 4 | 5) => void
}

interface ProductCardProps {
  product: Product
  isEditable: boolean
  userId: string
  onUpdate: (product: Product) => void
  onDelete: (productId: string) => void
}

function ProductCard({ product, isEditable, userId, onUpdate, onDelete }: ProductCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [editData, setEditData] = useState({
    name: product.name,
    description: product.description || '',
    price: product.price
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: !isEditable,
    noClick: !isEditable || !!product.image_url,
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles.length) return
      
      setIsUploading(true)
      const file = acceptedFiles[0]
      
      try {
        const imageUrl = await imageDB.uploadImage(file, 'product-images', userId)
        if (imageUrl) {
          const updatedProduct = await productDB.updateProduct(product.id, { image_url: imageUrl })
          if (updatedProduct) {
            onUpdate(updatedProduct)
          }
        }
      } catch (error) {
        console.error('Error uploading product image:', error)
      } finally {
        setIsUploading(false)
      }
    }
  })

  const handleSave = async () => {
    const updatedProduct = await productDB.updateProduct(product.id, editData)
    if (updatedProduct) {
      onUpdate(updatedProduct)
      setIsEditing(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    try {
      const imageUrl = await imageDB.uploadImage(file, 'product-images', userId)
      if (imageUrl) {
        const updatedProduct = await productDB.updateProduct(product.id, { image_url: imageUrl })
        if (updatedProduct) {
          onUpdate(updatedProduct)
        }
      }
    } catch (error) {
      console.error('Error uploading product image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Product Image */}
      <div
        {...getRootProps()}
        className={`relative aspect-square ${
          isEditable && !product.image_url ? 'cursor-pointer' : ''
        }`}
      >
        <input {...getInputProps()} />
        
        {product.image_url ? (
          <div className="relative w-full h-full">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {isEditable && (
              <div className="absolute top-2 right-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
                  title="Change image"
                >
                  <PhotoIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center bg-muted ${
              isEditable ? 'hover:bg-muted/80' : ''
            } ${isDragActive ? 'bg-primary/10 border-primary border-2 border-dashed' : ''}`}
          >
            {isUploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div className="text-center p-4">
                <PhotoIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                {isEditable ? (
                  <p className="text-sm text-muted-foreground">
                    {isDragActive ? 'Drop image here' : 'Click or drag to add image'}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">No image</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Hidden file input for image change */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Product name"
            />
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Product description"
              rows={2}
            />
            <div className="relative">
              <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={editData.price}
                onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) || 0 })}
                className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditData({
                    name: product.name,
                    description: product.description || '',
                    price: product.price
                  })
                }}
                className="flex-1 bg-muted text-muted-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground text-lg line-clamp-2">{product.name}</h3>
              {isEditable && (
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
                    title="Edit product"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-muted-foreground hover:text-red-500 p-1 rounded transition-colors"
                    title="Delete product"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
            {product.description && (
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function AddProductCard({ onAdd, shopId }: { onAdd: (product: Product) => void; shopId: string }) {
  const [isAdding, setIsAdding] = useState(false)
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0
  })

  const handleAdd = async () => {
    if (!productData.name || productData.price <= 0) return
    
    const newProduct = await productDB.createProduct({
      shop_id: shopId,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      position: Date.now(), // Simple position system
      is_active: true
    })
    
    if (newProduct) {
      onAdd(newProduct)
      setProductData({ name: '', description: '', price: 0 })
      setIsAdding(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-lg border border-dashed border-border overflow-hidden"
    >
      {isAdding ? (
        <div className="p-4 space-y-3">
          <input
            type="text"
            value={productData.name}
            onChange={(e) => setProductData({ ...productData, name: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Product name"
          />
          <textarea
            value={productData.description}
            onChange={(e) => setProductData({ ...productData, description: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Product description"
            rows={2}
          />
          <div className="relative">
            <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="number"
              step="0.01"
              min="0"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: parseFloat(e.target.value) || 0 })}
              className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.00"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAdd}
              disabled={!productData.name || productData.price <= 0}
              className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Product
            </button>
            <button
              onClick={() => {
                setIsAdding(false)
                setProductData({ name: '', description: '', price: 0 })
              }}
              className="flex-1 bg-muted text-muted-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full aspect-square flex items-center justify-center hover:bg-muted/50 transition-colors"
        >
          <div className="text-center">
            <PlusIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-medium">Add Product</p>
          </div>
        </button>
      )}
    </motion.div>
  )
}

export function ProductGrid({
  products,
  gridColumns,
  shopId,
  userId,
  isEditable = false,
  onProductsChange,
  onGridColumnsChange
}: ProductGridProps) {
  const [showColumnControl, setShowColumnControl] = useState(false)

  const handleProductUpdate = (updatedProduct: Product) => {
    if (onProductsChange) {
      const newProducts = products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      )
      onProductsChange(newProducts)
    }
  }

  const handleProductAdd = (newProduct: Product) => {
    if (onProductsChange) {
      onProductsChange([...products, newProduct])
    }
  }

  const handleProductDelete = async (productId: string) => {
    const success = await productDB.deleteProduct(productId)
    if (success && onProductsChange) {
      const newProducts = products.filter(p => p.id !== productId)
      onProductsChange(newProducts)
    }
  }

  const gridColsClass = {
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
  }

  return (
    <div className="space-y-6">
      {/* Grid Controls */}
      {isEditable && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
          <div className="relative">
            <button
              onClick={() => setShowColumnControl(!showColumnControl)}
              className="flex items-center space-x-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <ViewColumnsIcon className="h-5 w-5" />
              <span className="text-sm font-medium">{gridColumns} Columns</span>
            </button>

            {/* Column Control Panel */}
            <AnimatePresence>
              {showColumnControl && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-3 z-10"
                >
                  <p className="text-sm font-semibold text-foreground mb-2">Grid Layout</p>
                  <div className="space-y-1">
                    {[3, 4, 5].map((cols) => (
                      <button
                        key={cols}
                        onClick={() => {
                          if (onGridColumnsChange) {
                            onGridColumnsChange(cols as 3 | 4 | 5)
                          }
                          setShowColumnControl(false)
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          gridColumns === cols
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        {cols} columns
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <motion.div
        layout
        className={`grid gap-6 ${gridColsClass[gridColumns]}`}
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isEditable={isEditable}
              userId={userId}
              onUpdate={handleProductUpdate}
              onDelete={handleProductDelete}
            />
          ))}
          
          {/* Add Product Card */}
          {isEditable && (
            <AddProductCard onAdd={handleProductAdd} shopId={shopId} />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {products.length === 0 && !isEditable && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <PhotoIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No products yet</h3>
          <p className="text-muted-foreground">This shop hasn't added any products yet.</p>
        </motion.div>
      )}
    </div>
  )
}
