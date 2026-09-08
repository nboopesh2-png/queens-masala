import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AdminProducts from './pages/AdminProducts'

export default function App(){
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo192.png" alt="Queens Masala" className="w-12 h-12 object-cover" />
            <div>
              <div className="text-xl font-bold text-maroon">Queens Masala</div>
              <div className="text-sm text-gray-600">Authentic Taste. Homemade Love.</div>
            </div>
          </Link>
          <nav className="space-x-4">
            <Link to="/products">Shop</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/admin/products">Admin</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/products" element={<AdminProducts />} />
        </Routes>
      </main>
      <footer className="bg-gray-50 p-6 text-center text-sm">
        © {new Date().getFullYear()} Queens Masala. All rights reserved.
      </footer>
    </div>
  )
}
