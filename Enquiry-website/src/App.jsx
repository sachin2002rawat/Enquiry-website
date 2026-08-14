import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './page/Home'
import Product from './page/Product'
import './App.css'
import ProductDetails from './page/ProductDetails'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/home" element={<Home />} /> */}
      <Route path="/product" element={<Product />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/productDetail" element={<ProductDetails />} />
    </Routes>
  )
}

export default React.memo(App)

