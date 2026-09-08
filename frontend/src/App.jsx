import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'

export default function App(){
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-maroon text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">Queens Masala</Link>
          <nav className="space-x-4">
            <Link to="/products">Shop</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </main>
      <footer className="bg-gray-100 p-6 text-center text-sm">
        © {new Date().getFullYear()} Queens Masala. All rights reserved.
      </footer>
    </div>
  )
}
