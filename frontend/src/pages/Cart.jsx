import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateQty, removeItem } from '../store/slices/cartSlice'
import { Link, useNavigate } from 'react-router-dom'

export default function Cart(){
  const items = useSelector(state => state.cart.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0)

  return (
    <div>
      <h1 className="text-2xl font-semibold text-maroon">Your Cart</h1>
      {items.length === 0 ? (
        <div className="mt-6 text-center">
          <p className="text-gray-600">Your cart is empty.</p>
          <Link to="/products" className="mt-4 inline-block text-maroon">Shop Products</Link>
        </div>
      ) : (
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {items.map(it=> (
              <div key={it.product + it.weight} className="flex items-center gap-4 border-b py-4">
                <img src={it.image || 'https://via.placeholder.com/80'} alt={it.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-600">{it.weight}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=> dispatch(updateQty({ product: it.product, weight: it.weight, qty: Math.max(1, it.qty-1) }))} className="px-2 py-1 border">-</button>
                  <div>{it.qty}</div>
                  <button onClick={()=> dispatch(updateQty({ product: it.product, weight: it.weight, qty: it.qty+1 }))} className="px-2 py-1 border">+</button>
                </div>
                <div className="w-28 text-right">₹{it.price * it.qty}</div>
                <button onClick={()=> dispatch(removeItem({ product: it.product, weight: it.weight }))} className="ml-4 text-red-500">Remove</button>
              </div>
            ))}
          </div>
          <div className="p-4 border rounded">
            <div className="flex justify-between"><span>Subtotal</span><strong>₹{subtotal}</strong></div>
            <div className="mt-4">
              <button onClick={()=> navigate('/checkout')} className="w-full bg-maroon text-white py-2 rounded">Proceed to Checkout</button>
              <Link to="/products" className="block text-center mt-3 text-maroon">Continue Shopping</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
