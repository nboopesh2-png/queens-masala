import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useDispatch } from 'react-redux'
import { addItem } from '../store/slices/cartSlice'
import { useParams } from 'react-router-dom'

export default function ProductDetail(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedWeight, setSelectedWeight] = useState('')
  const [qty, setQty] = useState(1)
  const dispatch = useDispatch()

  useEffect(()=>{
    api.get(`/products/${id}`).then(res => {
      setProduct(res.data)
      setSelectedWeight(res.data.weights?.[0] || '')
    }).catch(console.error)
  },[id])

  if(!product) return <div>Loading...</div>

  const addToCart = () => {
    const item = { product: product._id, name: product.name, image: product.images?.[0], weight: selectedWeight, qty, price: product.price }
    dispatch(addItem(item))
    alert('Added to cart')
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <img src={product.images?.[0] || 'https://via.placeholder.com/500'} alt={product.name} className="w-full rounded" />
      <div>
        <h1 className="text-2xl font-semibold text-maroon">{product.name}</h1>
        <p className="mt-2 text-gray-700">{product.description}</p>
        <div className="mt-4 text-2xl font-bold">₹{product.price}</div>

        <div className="mt-4">
          <label className="block text-sm text-gray-600">Weight</label>
          <select value={selectedWeight} onChange={e=> setSelectedWeight(e.target.value)} className="border p-2 rounded mt-1">
            {product.weights?.map(w=> <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button onClick={()=> setQty(Math.max(1, qty-1))} className="px-3 py-1 border">-</button>
          <div>{qty}</div>
          <button onClick={()=> setQty(qty+1)} className="px-3 py-1 border">+</button>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button onClick={addToCart} className="px-4 py-2 bg-maroon text-white rounded">Add to Cart</button>
          <a href="/checkout" className="px-4 py-2 border border-maroon text-maroon rounded">Buy Now</a>
        </div>
      </div>
    </div>
  )
}
