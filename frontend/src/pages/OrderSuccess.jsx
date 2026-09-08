import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useLocation, Link } from 'react-router-dom'

export default function OrderSuccess(){
  const [order, setOrder] = useState(null)
  const params = new URLSearchParams(window.location.search)
  const orderId = params.get('orderId')

  useEffect(()=>{
    if (!orderId) return
    const token = localStorage.getItem('qm_token')
    api.get(`/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` } }).then(res=> setOrder(res.data.order)).catch(console.error)
  }, [orderId])

  if (!order) return <div>Loading order details...</div>

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-maroon">Order Placed</h1>
      <p className="mt-2">Thank you! Your order <strong>{order.orderId}</strong> has been placed.</p>
      <div className="mt-4 border p-4 rounded">
        <div className="flex justify-between"><span>Order ID</span><strong>{order.orderId}</strong></div>
        <div className="flex justify-between mt-2"><span>Total</span><strong>₹{order.totalAmount}</strong></div>
        <div className="flex justify-between mt-2"><span>Payment</span><strong>{order.paymentMethod}</strong></div>
        <div className="mt-4">
          <h3 className="font-semibold">Shipping Address</h3>
          <div className="text-sm text-gray-700">{order.shippingAddress.fullName}, {order.shippingAddress.house}, {order.shippingAddress.street}, {order.shippingAddress.area}, {order.shippingAddress.city} - {order.shippingAddress.pincode}</div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Items</h3>
          <ul className="mt-2 space-y-2">
            {order.items.map(it=> (
              <li key={it._id} className="flex justify-between"><div>{it.name} ({it.weight}) x {it.qty}</div><div>₹{it.price * it.qty}</div></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <Link to="/my-orders" className="text-maroon">View My Orders</Link>
      </div>
    </div>
  )
}
