import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function AdminReviews(){
  const [products, setProducts] = useState([])

  useEffect(()=>{
    const token = localStorage.getItem('qm_token')
    api.get('/products', { headers: { Authorization: `Bearer ${token}` } }).then(res=> setProducts(res.data.products)).catch(console.error)
  },[])

  const approve = async (productId, reviewId) => {
    const token = localStorage.getItem('qm_token')
    await api.put(`/reviews/admin/${productId}/${reviewId}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } })
    alert('Approved')
    window.location.reload()
  }

  const remove = async (productId, reviewId) => {
    const token = localStorage.getItem('qm_token')
    await api.delete(`/reviews/admin/${productId}/${reviewId}`, { headers: { Authorization: `Bearer ${token}` } })
    alert('Deleted')
    window.location.reload()
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-maroon">Admin - Reviews</h1>
      <div className="mt-4 space-y-4">
        {products.map(p=> (
          <div key={p._id} className="border p-3 rounded">
            <div className="font-medium">{p.name}</div>
            <div className="mt-2 space-y-2">
              {(p.reviews || []).filter(r=> !r.approved).map(r=> (
                <div key={r._id} className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-sm text-gray-600">{r.comment}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={()=> approve(p._id, r._id)} className="text-green-600">Approve</button>
                    <button onClick={()=> remove(p._id, r._id)} className="text-red-500">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
