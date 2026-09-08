import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function AdminCoupons(){
  const [coupons, setCoupons] = useState([])
  const [form, setForm] = useState({ code:'', discountPercentage:0, maxDiscountAmount:0, minOrderValue:0, expiresAt:'', enabled:true })

  useEffect(()=>{
    const token = localStorage.getItem('qm_token')
    api.get('/coupons', { headers: { Authorization: `Bearer ${token}` } }).then(res=> setCoupons(res.data.coupons)).catch(console.error)
  },[])

  const create = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('qm_token')
    await api.post('/coupons', form, { headers: { Authorization: `Bearer ${token}` } })
    alert('Coupon created')
    window.location.reload()
  }

  const remove = async (id) => {
    const token = localStorage.getItem('qm_token')
    await api.delete(`/coupons/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    setCoupons(coupons.filter(c=> c._id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-maroon">Admin - Coupons</h1>
      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <form onSubmit={create} className="space-y-2">
          <input placeholder="Code" value={form.code} onChange={e=> setForm({...form, code: e.target.value})} className="w-full border p-2 rounded" />
          <input placeholder="Discount %" type="number" value={form.discountPercentage} onChange={e=> setForm({...form, discountPercentage: Number(e.target.value)})} className="w-full border p-2 rounded" />
          <input placeholder="Max discount amount" type="number" value={form.maxDiscountAmount} onChange={e=> setForm({...form, maxDiscountAmount: Number(e.target.value)})} className="w-full border p-2 rounded" />
          <input placeholder="Min order value" type="number" value={form.minOrderValue} onChange={e=> setForm({...form, minOrderValue: Number(e.target.value)})} className="w-full border p-2 rounded" />
          <input placeholder="Expiry date (YYYY-MM-DD)" value={form.expiresAt} onChange={e=> setForm({...form, expiresAt: e.target.value})} className="w-full border p-2 rounded" />
          <button type="submit" className="bg-maroon text-white px-4 py-2 rounded">Create</button>
        </form>
        <div>
          <h2 className="font-semibold">Existing Coupons</h2>
          <div className="mt-3 space-y-2">
            {coupons.map(c=> (
              <div key={c._id} className="flex items-center justify-between border p-2 rounded">
                <div>
                  <div className="font-medium">{c.code} - {c.discountPercentage}%</div>
                  <div className="text-sm text-gray-600">Min ₹{c.minOrderValue} - Expires {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'N/A'}</div>
                </div>
                <button onClick={()=> remove(c._id)} className="text-red-500">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
