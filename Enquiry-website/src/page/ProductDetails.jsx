import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import productsData from '../ProductsData.json'
import categoryDataMap from '../CategoryProductsData.json'
import beautyProductsData from '../BeautyProductsData.json'
import ProductNavbar from '../components/ProductNavbar'
import ProductDetailNavbar from '../components/ProductDeatils/ProductDetailNavbar'
import ProductHero from '../components/ProductDeatils/ProductHero'
import SecondHero from '../components/ProductDeatils/SecondHero'
import RelatedProduct from '../components/ProductDeatils/RelatedProduct'
import Footer from '../components/Footer'

// Combine main catalog, category variant catalog, and beauty catalog into one search pool
const categoryVariantProducts = Object.values(categoryDataMap).flatMap((group) => group.products || []);
const combinedCatalog = [...productsData, ...categoryVariantProducts, ...beautyProductsData];

const ProductDetails = () => {
  const { id } = useParams()

  // Scroll to top whenever the product ID changes
  useEffect(() => {
    window.scrollTo(0, 0)  
  }, [id])

  // Find matching product by slug, ID, or normalized product name across combined catalog
  
  const paramLower = id ? id.toLowerCase().trim() : ''
  const product = id
    ? combinedCatalog.find((p) => 
        (p.slug && p.slug.toLowerCase() === paramLower) ||
        String(p.id) === String(id) ||
        p.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-') === paramLower
      )    
    : productsData[0]

  // Handle invalid product ID gracefully
  if (id && !product) {
    return (
      <div>
        <ProductNavbar />
        <div style={{ 
          textAlign: 'center', 
          padding: '100px 20px', 
          minHeight: '60vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #FFF4EC 0%, #FDF8F3 100%)'
        }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '12px', color: '#1e293b' }}>
            Product Not Found
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '28px', maxWidth: '450px' }}>
            The requested product could not be found. It may have been removed or the URL might be invalid.
          </p>
          <Link 
            to="/product" 
            style={{ 
              padding: '12px 28px', 
              background: '#2563eb', 
              color: '#ffffff', 
              borderRadius: '999px', 
              textDecoration: 'none', 
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
            }}
          >
            Back to All Products
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const activeProduct = product || productsData[0]

  return (
    <div>
      <ProductNavbar />
      <ProductDetailNavbar product={activeProduct} />   
      <ProductHero product={activeProduct} />
      <RelatedProduct currentProduct={activeProduct} />
      <Footer /> 
    </div>
  )
}

export default ProductDetails