import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

export default function ProductDetail(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(()=>{
    api.get(`/products/${id}`).then(res => setProduct(res.data)).catch(console.error)
  },[id])

  if(!product) return <div>Loading...</div>

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <img src={product.images?.[0] || 'https://via.placeholder.com/500'} alt={product.name} className="w-full rounded" />
      <div>
        <h1 className="text-2xl font-semibold text-maroon">{product.name}</h1>
        <p className="mt-2 text-gray-700">{product.description}</p>
        <div className="mt-4 text-2xl font-bold">₹{product.price}</div>
        <button className="mt-6 px-4 py-2 bg-maroon text-white rounded">Add to Cart</button>
      </div>
    </div>
  )
}
