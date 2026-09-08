import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function AdminCustomers(){
  const [users, setUsers] = useState([])

  useEffect(()=>{
    const token = localStorage.getItem('qm_token')
    api.get('/admin/users', { headers: { Authorization: `Bearer ${token}` } }).then(res=> setUsers(res.data.users)).catch(console.error)
  },[])

  const toggle = async (id) => {
    const token = localStorage.getItem('qm_token')
    await api.put(`/admin/users/${id}/toggle`, {}, { headers: { Authorization: `Bearer ${token}` } })
    setUsers(users.map(u => u._id === id ? { ...u, disabled: !u.disabled } : u))
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-maroon">Admin - Customers</h1>
      <div className="mt-4 space-y-2">
        {users.map(u=> (
          <div key={u._id} className="flex items-center justify-between border p-2 rounded">
            <div>
              <div className="font-medium">{u.name} ({u.email})</div>
              <div className="text-sm text-gray-600">{u.phone}</div>
            </div>
            <div>
              <button onClick={()=> toggle(u._id)} className="px-3 py-1 border rounded">{u.disabled ? 'Enable' : 'Disable'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
