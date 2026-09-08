import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function MyOrders(){
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    const token = localStorage.getItem('qm_token')
    api.get('/orders/my-orders', { headers: { Authorization: `Bearer ${token}` } }).then(res=> setOrders(res.data.orders)).catch(console.error)
  },[])

  return (
    <div>
      <h1 className="text-2xl font-semibold text-maroon">My Orders</h1>
      <div className="mt-4 space-y-3">
        {orders.map(o=> (
          <div key={o._id} className="border p-3 rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{o.orderId} - ₹{o.totalAmount}</div>
                <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <a href={`/orders/${o._id}`} className="text-maroon">View</a>
              </div>
            </div>
            <div className="mt-2 text-sm">Status: {o.orderStatus}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
