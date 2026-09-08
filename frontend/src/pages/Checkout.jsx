import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import api from '../services/api'
import { clearCart } from '../store/slices/cartSlice'
import loadRazorpay from '../utils/loadRazorpay'

export default function Checkout(){
  const items = useSelector(state => state.cart.items)
  const dispatch = useDispatch()
  const [address, setAddress] = useState({ fullName: '', phone: '', house: '', street: '', area: '', city: '', district: '', state: '', pincode: '' })
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [loading, setLoading] = useState(false)

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0)
  const deliveryCharge = subtotal > 500 ? 0 : 40
  const total = subtotal + deliveryCharge

  const placeOrderCOD = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('qm_token')
      const res = await api.post('/orders', { items, subtotal, deliveryCharge, discount: 0, totalAmount: total, paymentMethod: 'COD', shippingAddress: address }, { headers: { Authorization: `Bearer ${token}` } })
      dispatch(clearCart())
      window.location.href = `/order-success?orderId=${res.data.order._id}`
    } catch (err) {
      console.error(err)
      alert('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const placeOrderRazorpay = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('qm_token')
      // create razorpay order on server
      const paymentResp = await api.post('/payment/create-order', { amount: total }, { headers: { Authorization: `Bearer ${token}` } })
      const { order, keyId } = paymentResp.data
      const ok = await loadRazorpay()
      if (!ok) {
        alert('Razorpay SDK failed to load. Are you online?')
        setLoading(false)
        return
      }

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Queens Masala',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function(response){
          try {
            // verify payment on server
            const verify = await api.post('/payment/verify', { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature }, { headers: { Authorization: `Bearer ${token}` } })
            if (verify.data.valid) {
              // create order in our DB with paymentResult
              const orderRes = await api.post('/orders', { items, subtotal, deliveryCharge, discount: 0, totalAmount: total, paymentMethod: 'RAZORPAY', shippingAddress: address, paymentResult: { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature } }, { headers: { Authorization: `Bearer ${token}` } })
              dispatch(clearCart())
              window.location.href = `/order-success?orderId=${orderRes.data.order._id}`
            } else {
              alert('Payment verification failed')
            }
          } catch (err) {
            console.error('Payment handler error', err)
            alert('Payment failed or verification error')
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      console.error(err)
      alert('Payment initiation failed')
    } finally {
      setLoading(false)
    }
  }

  const placeOrder = async () => {
    if (!items.length) return alert('Cart is empty')
    if (!address.fullName || !address.phone || !address.pincode) return alert('Please fill address fields')

    if (paymentMethod === 'COD') return placeOrderCOD()
    return placeOrderRazorpay()
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-maroon">Checkout</h1>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="font-semibold">Delivery Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <input placeholder="Full name" value={address.fullName} onChange={e=> setAddress({...address, fullName: e.target.value})} className="border p-2 rounded" />
            <input placeholder="Phone" value={address.phone} onChange={e=> setAddress({...address, phone: e.target.value})} className="border p-2 rounded" />
            <input placeholder="House / Door No" value={address.house} onChange={e=> setAddress({...address, house: e.target.value})} className="border p-2 rounded" />
            <input placeholder="Street" value={address.street} onChange={e=> setAddress({...address, street: e.target.value})} className="border p-2 rounded" />
            <input placeholder="Area" value={address.area} onChange={e=> setAddress({...address, area: e.target.value})} className="border p-2 rounded" />
            <input placeholder="City" value={address.city} onChange={e=> setAddress({...address, city: e.target.value})} className="border p-2 rounded" />
            <input placeholder="State" value={address.state} onChange={e=> setAddress({...address, state: e.target.value})} className="border p-2 rounded" />
            <input placeholder="Pincode" value={address.pincode} onChange={e=> setAddress({...address, pincode: e.target.value})} className="border p-2 rounded" />
          </div>

          <h2 className="mt-6 font-semibold">Payment Method</h2>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2"><input type="radio" checked={paymentMethod==='COD'} onChange={()=> setPaymentMethod('COD')} /> Cash on Delivery</label>
            <label className="flex items-center gap-2"><input type="radio" checked={paymentMethod==='RAZORPAY'} onChange={()=> setPaymentMethod('RAZORPAY')} /> Razorpay (Online)</label>
          </div>
        </div>
        <div className="p-4 border rounded">
          <div className="flex justify-between"><span>Subtotal</span><strong>₹{subtotal}</strong></div>
          <div className="flex justify-between mt-2"><span>Delivery</span><strong>₹{deliveryCharge}</strong></div>
          <div className="flex justify-between mt-2"><span>Total</span><strong>₹{total}</strong></div>
          <button onClick={placeOrder} disabled={loading} className="mt-4 w-full bg-maroon text-white py-2 rounded">{loading ? 'Processing...' : 'Place Order'}</button>
        </div>
      </div>
    </div>
  )
}
