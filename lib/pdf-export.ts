import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Shop, Product } from './shop-db'

export interface ExportOptions {
  includeImages: boolean
  pageFormat: 'a4' | 'letter'
  orientation: 'portrait' | 'landscape'
}

export const pdfExport = {
  // Export shop as PDF
  exportShop: async (
    shop: Shop,
    products: Product[],
    options: ExportOptions = {
      includeImages: true,
      pageFormat: 'a4',
      orientation: 'portrait'
    }
  ): Promise<void> => {
    try {
      // Create PDF document
      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: 'mm',
        format: options.pageFormat
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      const contentWidth = pageWidth - (margin * 2)
      
      let yPosition = margin

      // Add shop title
      pdf.setFontSize(24)
      pdf.setTextColor(0, 0, 0)
      pdf.text(shop.name, margin, yPosition)
      yPosition += 15

      // Add shop description
      if (shop.description) {
        pdf.setFontSize(12)
        pdf.setTextColor(100, 100, 100)
        const descriptionLines = pdf.splitTextToSize(shop.description, contentWidth)
        pdf.text(descriptionLines, margin, yPosition)
        yPosition += descriptionLines.length * 6 + 10
      }

      // Add banner image if available and requested
      if (options.includeImages && shop.banner_image_url) {
        try {
          const bannerImg = new Image()
          bannerImg.crossOrigin = 'anonymous'
          await new Promise((resolve, reject) => {
            bannerImg.onload = resolve
            bannerImg.onerror = reject
            bannerImg.src = shop.banner_image_url!
          })

          const bannerHeight = 40
          const bannerWidth = contentWidth
          
          // Check if we need a new page
          if (yPosition + bannerHeight > pageHeight - margin) {
            pdf.addPage()
            yPosition = margin
          }

          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')!
          canvas.width = bannerImg.width
          canvas.height = bannerImg.height
          ctx.drawImage(bannerImg, 0, 0)
          
          const imgData = canvas.toDataURL('image/jpeg', 0.8)
          pdf.addImage(imgData, 'JPEG', margin, yPosition, bannerWidth, bannerHeight)
          yPosition += bannerHeight + 15
        } catch (error) {
          console.warn('Could not load banner image for PDF:', error)
        }
      }

      // Add products section
      if (products.length > 0) {
        // Check if we need a new page
        if (yPosition + 20 > pageHeight - margin) {
          pdf.addPage()
          yPosition = margin
        }

        pdf.setFontSize(18)
        pdf.setTextColor(0, 0, 0)
        pdf.text('Products', margin, yPosition)
        yPosition += 15

        // Calculate grid layout
        const cols = shop.grid_columns
        const productWidth = (contentWidth - ((cols - 1) * 10)) / cols
        const productHeight = options.includeImages ? 80 : 40

        let currentCol = 0
        let currentRow = 0

        for (const product of products) {
          const x = margin + (currentCol * (productWidth + 10))
          const y = yPosition + (currentRow * (productHeight + 10))

          // Check if we need a new page
          if (y + productHeight > pageHeight - margin) {
            pdf.addPage()
            yPosition = margin
            currentRow = 0
            currentCol = 0
          }

          const actualY = yPosition + (currentRow * (productHeight + 10))

          // Add product image if available and requested
          if (options.includeImages && product.image_url) {
            try {
              const productImg = new Image()
              productImg.crossOrigin = 'anonymous'
              await new Promise((resolve, reject) => {
                productImg.onload = resolve
                productImg.onerror = reject
                productImg.src = product.image_url!
              })

              const imgSize = 30
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')!
              canvas.width = productImg.width
              canvas.height = productImg.height
              ctx.drawImage(productImg, 0, 0)
              
              const imgData = canvas.toDataURL('image/jpeg', 0.8)
              pdf.addImage(imgData, 'JPEG', x, actualY, imgSize, imgSize)
            } catch (error) {
              console.warn('Could not load product image for PDF:', error)
            }
          }

          // Add product details
          const textX = options.includeImages && product.image_url ? x + 35 : x
          const textWidth = options.includeImages && product.image_url ? productWidth - 35 : productWidth

          pdf.setFontSize(12)
          pdf.setTextColor(0, 0, 0)
          const nameLines = pdf.splitTextToSize(product.name, textWidth)
          pdf.text(nameLines, textX, actualY + 8)

          if (product.description) {
            pdf.setFontSize(10)
            pdf.setTextColor(100, 100, 100)
            const descLines = pdf.splitTextToSize(product.description, textWidth)
            pdf.text(descLines, textX, actualY + 8 + (nameLines.length * 5))
          }

          // Add price
          pdf.setFontSize(14)
          pdf.setTextColor(0, 100, 0)
          pdf.text(`$${product.price.toFixed(2)}`, textX, actualY + productHeight - 5)

          // Move to next position
          currentCol++
          if (currentCol >= cols) {
            currentCol = 0
            currentRow++
          }
        }
      }

      // Add footer
      const totalPages = pdf.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setTextColor(150, 150, 150)
        pdf.text(
          `Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${totalPages}`,
          margin,
          pageHeight - 10
        )
      }

      // Save the PDF
      pdf.save(`${shop.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_catalog.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    }
  },

  // Export current view as PDF (using html2canvas)
  exportCurrentView: async (elementId: string, filename: string): Promise<void> => {
    try {
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error('Element not found')
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(filename)
    } catch (error) {
      console.error('Error exporting current view:', error)
      throw error
    }
  }
}
