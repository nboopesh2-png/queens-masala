import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function AdminProducts(){
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name:'', slug:'', price:0, mrp:0, category:'', weights:'100g', description:'', ingredients:'', images:[] })
  const [imageFile, setImageFile] = useState(null)

  useEffect(()=>{
    api.get('/products').then(res=> setProducts(res.data.products)).catch(console.error)
  },[])

  const uploadImage = async () => {
    if (!imageFile) return null
    const formData = new FormData()
    formData.append('image', imageFile)
    const token = localStorage.getItem('qm_token')
    const res = await api.post('/upload/image', formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } })
    return res.data.url
  }

  const createProduct = async (e) => {
    e.preventDefault()
    try {
      const imageUrl = await uploadImage()
      const token = localStorage.getItem('qm_token')
      const payload = { ...form, images: imageUrl ? [imageUrl] : [], weights: form.weights.split(',').map(s => s.trim()) }
      await api.post('/products', payload, { headers: { Authorization: `Bearer ${token}` } })
      alert('Product created')
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert('Create failed')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-maroon">Admin - Products</h1>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={createProduct} className="space-y-2">
            <input placeholder="Name" value={form.name} onChange={e=> setForm({...form, name: e.target.value})} className="w-full border p-2 rounded" />
            <input placeholder="Slug" value={form.slug} onChange={e=> setForm({...form, slug: e.target.value})} className="w-full border p-2 rounded" />
            <input placeholder="Price" type="number" value={form.price} onChange={e=> setForm({...form, price: Number(e.target.value)})} className="w-full border p-2 rounded" />
            <input placeholder="MRP" type="number" value={form.mrp} onChange={e=> setForm({...form, mrp: Number(e.target.value)})} className="w-full border p-2 rounded" />
            <input placeholder="Weights (comma separated) e.g. 50g,100g" value={form.weights} onChange={e=> setForm({...form, weights: e.target.value})} className="w-full border p-2 rounded" />
            <textarea placeholder="Description" value={form.description} onChange={e=> setForm({...form, description: e.target.value})} className="w-full border p-2 rounded" />
            <input type="file" onChange={e=> setImageFile(e.target.files[0])} />
            <button type="submit" className="mt-2 bg-maroon text-white px-4 py-2 rounded">Create Product</button>
          </form>
        </div>
        <div>
          <h2 className="font-semibold">Existing Products</h2>
          <div className="mt-3 space-y-2">
            {products.map(p=> (
              <div key={p._id} className="flex items-center gap-3 border p-2 rounded">
                <img src={p.images?.[0] || 'https://via.placeholder.com/60'} alt={p.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">₹{p.price}</div>
                </div>
                {/* edit/delete buttons can be added later */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
