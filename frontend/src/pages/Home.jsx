import React from 'react'

export default function Home(){
  return (
    <div>
      <section className="bg-[url('/logo192.png')] bg-cover bg-center p-12 rounded-lg text-center">
        <h1 className="text-4xl font-semibold text-maroon">Authentic Taste. Homemade Love.</h1>
        <p className="mt-4 text-lg text-gray-700">Premium homemade masala blends crafted with love.</p>
        <div className="mt-6 space-x-4">
          <a href="/products" className="px-6 py-3 bg-maroon text-white rounded">Shop Now</a>
          <a href="/products" className="px-6 py-3 border border-maroon text-maroon rounded">Explore Products</a>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-maroon">Featured Products</h2>
        <p className="text-sm text-gray-600">Handpicked favourites</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product cards will be loaded here in future iterations */}
          <div className="border p-4 rounded">Product card placeholder</div>
          <div className="border p-4 rounded">Product card placeholder</div>
          <div className="border p-4 rounded">Product card placeholder</div>
        </div>
      </section>
    </div>
  )
}
