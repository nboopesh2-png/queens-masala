import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function Products(){
  const [products, setProducts] = useState([])

  useEffect(()=>{
    api.get('/products').then(res=> setProducts(res.data.products)).catch(console.error)
  },[])

  return (
    <div>
      <h1 className="text-2xl font-semibold text-maroon">Products</h1>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(p=> (
          <div key={p._id} className="border p-4 rounded shadow-sm">
            <img src={p.images?.[0] || 'https://via.placeholder.com/300'} alt={p.name} className="h-44 w-full object-cover rounded" />
            <h3 className="mt-2 font-medium">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.description?.slice(0,80)}</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-lg font-semibold">₹{p.price}</div>
              <Link to={`/products/${p._id}`} className="text-maroon">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
