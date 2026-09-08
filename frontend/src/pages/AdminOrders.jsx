import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function AdminOrders(){
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    const token = localStorage.getItem('qm_token')
    api.get('/orders/admin/all', { headers: { Authorization: `Bearer ${token}` } }).then(res=> setOrders(res.data.orders)).catch(console.error)
  },[])

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('qm_token')
    await api.put(`/orders/admin/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } })
    setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: status } : o))
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-maroon">Admin - Orders</h1>
      <div className="mt-4 space-y-3">
        {orders.map(o=> (
          <div key={o._id} className="border p-3 rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{o.orderId} - ₹{o.totalAmount}</div>
                <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <select value={o.orderStatus} onChange={(e)=> updateStatus(o._id, e.target.value)} className="border p-1 rounded">
                  <option>ORDER PLACED</option>
                  <option>CONFIRMED</option>
                  <option>PACKED</option>
                  <option>SHIPPED</option>
                  <option>OUT FOR DELIVERY</option>
                  <option>DELIVERED</option>
                  <option>CANCELLED</option>
                </select>
              </div>
            </div>
            <div className="mt-2 text-sm">{o.shippingAddress?.fullName} - {o.shippingAddress?.pincode}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
