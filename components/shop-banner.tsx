"use client"

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { PhotoIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import { imageDB } from '@/lib/shop-db'

interface ShopBannerProps {
  shopName: string
  description?: string
  bannerImageUrl?: string
  bannerHeight: number
  isEditable?: boolean
  onBannerUpdate?: (imageUrl: string) => void
  onHeightChange?: (height: number) => void
  userId?: string
}

export function ShopBanner({
  shopName,
  description,
  bannerImageUrl,
  bannerHeight,
  isEditable = false,
  onBannerUpdate,
  onHeightChange,
  userId
}: ShopBannerProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [showHeightControl, setShowHeightControl] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: !isEditable,
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles.length || !userId || !onBannerUpdate) return
      
      setIsUploading(true)
      const file = acceptedFiles[0]
      
      try {
        const imageUrl = await imageDB.uploadImage(file, 'banner-images', userId)
        if (imageUrl) {
          onBannerUpdate(imageUrl)
        }
      } catch (error) {
        console.error('Error uploading banner:', error)
      } finally {
        setIsUploading(false)
      }
    }
  })

  const handleHeightChange = (newHeight: number) => {
    if (onHeightChange) {
      onHeightChange(newHeight)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full overflow-hidden rounded-lg shadow-lg"
      style={{ height: `${bannerHeight}px` }}
    >
      {/* Banner Background */}
      <div
        className={`absolute inset-0 ${
          bannerImageUrl
            ? 'bg-cover bg-center bg-no-repeat'
            : 'bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20'
        }`}
        style={bannerImageUrl ? { backgroundImage: `url(${bannerImageUrl})` } : {}}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Banner Content */}
      <div className="relative h-full flex items-center justify-center px-6">
        <div className="text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
          >
            {shopName}
          </motion.h1>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg md:text-xl text-white/90 drop-shadow-lg max-w-2xl mx-auto"
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>

      {/* Upload Area (only visible when editable and no image) */}
      {isEditable && !bannerImageUrl && (
        <div
          {...getRootProps()}
          className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-colors ${
            isDragActive ? 'bg-primary/20' : 'hover:bg-primary/10'
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center text-white">
            <PhotoIcon className="h-12 w-12 mx-auto mb-4 drop-shadow-lg" />
            <p className="text-lg font-semibold drop-shadow-lg">
              {isDragActive ? 'Drop banner image here' : 'Click or drag to upload banner'}
            </p>
            <p className="text-sm text-white/80 drop-shadow-lg">
              Supports JPEG, PNG, GIF, WebP
            </p>
          </div>
        </div>
      )}

      {/* Upload Overlay (when uploading) */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Uploading banner...</p>
          </div>
        </div>
      )}

      {/* Edit Controls */}
      {isEditable && (
        <div className="absolute top-4 right-4 space-y-2">
          {/* Height Control Toggle */}
          <button
            onClick={() => setShowHeightControl(!showHeightControl)}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
            title="Adjust banner height"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
          </button>

          {/* Change Image Button */}
          {bannerImageUrl && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
              title="Change banner image"
            >
              <PhotoIcon className="h-5 w-5" />
            </button>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file || !userId || !onBannerUpdate) return
              
              setIsUploading(true)
              try {
                const imageUrl = await imageDB.uploadImage(file, 'banner-images', userId)
                if (imageUrl) {
                  onBannerUpdate(imageUrl)
                }
              } catch (error) {
                console.error('Error uploading banner:', error)
              } finally {
                setIsUploading(false)
              }
            }}
          />
        </div>
      )}

      {/* Height Control Panel */}
      {isEditable && showHeightControl && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-16 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-border"
        >
          <h4 className="text-sm font-semibold text-foreground mb-3">Banner Height</h4>
          <div className="space-y-2">
            {[150, 200, 250, 300, 400].map((height) => (
              <button
                key={height}
                onClick={() => handleHeightChange(height)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  bannerHeight === height
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                {height}px {height === 200 && '(Default)'}
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <label className="text-xs text-muted-foreground">Custom Height</label>
            <input
              type="range"
              min="150"
              max="600"
              value={bannerHeight}
              onChange={(e) => handleHeightChange(parseInt(e.target.value))}
              className="w-full mt-1"
            />
            <div className="text-xs text-muted-foreground mt-1">{bannerHeight}px</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
