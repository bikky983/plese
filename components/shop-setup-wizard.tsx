"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BuildingStorefrontIcon,
  PhotoIcon,
  ViewColumnsIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import { Shop, shopDB, imageDB } from '@/lib/shop-db'

interface ShopSetupWizardProps {
  userId: string
  onComplete: (shop: Shop) => void
}

export function ShopSetupWizard({ userId, onComplete }: ShopSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const [shopData, setShopData] = useState({
    name: '',
    description: '',
    banner_image_url: '',
    banner_height: 200,
    grid_columns: 3 as 3 | 4 | 5
  })

  const steps = [
    {
      title: 'Shop Information',
      description: 'Tell us about your shop',
      icon: BuildingStorefrontIcon
    },
    {
      title: 'Banner Setup',
      description: 'Customize your shop banner',
      icon: PhotoIcon
    },
    {
      title: 'Layout Settings',
      description: 'Choose your product layout',
      icon: ViewColumnsIcon
    }
  ]

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles.length) return
      
      const file = acceptedFiles[0]
      try {
        const imageUrl = await imageDB.uploadImage(file, 'banner-images', userId)
        if (imageUrl) {
          setShopData({ ...shopData, banner_image_url: imageUrl })
        }
      } catch (error) {
        console.error('Error uploading banner:', error)
      }
    }
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    if (!shopData.name) return
    
    setIsCreating(true)
    try {
      const newShop = await shopDB.createShop({
        user_id: userId,
        name: shopData.name,
        description: shopData.description,
        banner_image_url: shopData.banner_image_url,
        banner_height: shopData.banner_height,
        grid_columns: shopData.grid_columns
      })
      
      if (newShop) {
        onComplete(newShop)
      }
    } catch (error) {
      console.error('Error creating shop:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return shopData.name.trim().length > 0
      case 1:
      case 2:
        return true
      default:
        return false
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  index <= currentStep
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-muted-foreground text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 transition-colors ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">{steps[currentStep].title}</h2>
          <p className="text-muted-foreground">{steps[currentStep].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-lg border border-border p-6"
        >
          {/* Step 0: Shop Information */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Shop Name *
                </label>
                <input
                  type="text"
                  value={shopData.name}
                  onChange={(e) => setShopData({ ...shopData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your shop name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={shopData.description}
                  onChange={(e) => setShopData({ ...shopData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Tell customers about your shop"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 1: Banner Setup */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Banner Image (Optional)
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary bg-primary/5'
                      : shopData.banner_image_url
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  <input {...getInputProps()} />
                  {shopData.banner_image_url ? (
                    <div className="space-y-2">
                      <img
                        src={shopData.banner_image_url}
                        alt="Banner preview"
                        className="w-full h-32 object-cover rounded-lg mx-auto"
                      />
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        ✓ Banner uploaded successfully
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click or drag to replace
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <PhotoIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="text-sm font-medium text-foreground">
                        {isDragActive ? 'Drop banner image here' : 'Upload banner image'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Drag & drop or click to browse (JPEG, PNG, GIF, WebP)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Banner Height
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="150"
                    max="400"
                    value={shopData.banner_height}
                    onChange={(e) => setShopData({ ...shopData, banner_height: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>150px</span>
                    <span className="font-medium">{shopData.banner_height}px</span>
                    <span>400px</span>
                  </div>
                </div>
              </div>

              {/* Banner Preview */}
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-3">Preview:</p>
                <div
                  className="relative rounded-lg overflow-hidden"
                  style={{ height: `${shopData.banner_height / 2}px` }}
                >
                  <div
                    className={`absolute inset-0 ${
                      shopData.banner_image_url
                        ? 'bg-cover bg-center bg-no-repeat'
                        : 'bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20'
                    }`}
                    style={shopData.banner_image_url ? { backgroundImage: `url(${shopData.banner_image_url})` } : {}}
                  >
                    <div className="absolute inset-0 bg-black/30"></div>
                  </div>
                  <div className="relative h-full flex items-center justify-center">
                    <h3 className="text-white font-bold text-lg drop-shadow-lg">
                      {shopData.name || 'Your Shop Name'}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Layout Settings */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Product Grid Layout
                </label>
                <div className="grid grid-cols-1 gap-4">
                  {[3, 4, 5].map((cols) => (
                    <button
                      key={cols}
                      onClick={() => setShopData({ ...shopData, grid_columns: cols as 3 | 4 | 5 })}
                      className={`p-4 rounded-lg border-2 transition-colors text-left ${
                        shopData.grid_columns === cols
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">{cols} Columns</h4>
                          <p className="text-sm text-muted-foreground">
                            {cols === 3 && 'Best for detailed product showcases'}
                            {cols === 4 && 'Balanced layout for most shops'}
                            {cols === 5 && 'Compact layout for many products'}
                          </p>
                        </div>
                        <div className={`grid grid-cols-${cols} gap-1 w-16`}>
                          {Array.from({ length: cols }).map((_, i) => (
                            <div
                              key={i}
                              className="aspect-square bg-primary/20 rounded-sm"
                            />
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Preview */}
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-3">Preview:</p>
                <div className={`grid gap-2 ${
                  shopData.grid_columns === 3 ? 'grid-cols-3' :
                  shopData.grid_columns === 4 ? 'grid-cols-4' : 'grid-cols-5'
                }`}>
                  {Array.from({ length: shopData.grid_columns * 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-card rounded border border-border flex items-center justify-center"
                    >
                      <PhotoIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-primary' : 
                index < currentStep ? 'bg-primary/50' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleComplete}
            disabled={!isStepValid() || isCreating}
            className="flex items-center space-x-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Creating Shop...</span>
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                <span>Create Shop</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )

  function isStepValid() {
    switch (currentStep) {
      case 0:
        return shopData.name.trim().length > 0
      case 1:
      case 2:
        return true
      default:
        return false
    }
  }
}
