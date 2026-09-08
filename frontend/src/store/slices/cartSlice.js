import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: JSON.parse(localStorage.getItem('qm_cart') || '[]')
}

const save = (items) => localStorage.setItem('qm_cart', JSON.stringify(items))

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const item = action.payload;
      const exists = state.items.find(i => i.product === item.product && i.weight === item.weight);
      if (exists) {
        exists.qty += item.qty;
      } else {
        state.items.push(item);
      }
      save(state.items);
    },
    updateQty(state, action) {
      const { product, weight, qty } = action.payload;
      const it = state.items.find(i => i.product === product && i.weight === weight);
      if (it) it.qty = qty;
      save(state.items);
    },
    removeItem(state, action) {
      const { product, weight } = action.payload;
      state.items = state.items.filter(i => !(i.product === product && i.weight === weight));
      save(state.items);
    },
    clearCart(state) {
      state.items = [];
      save(state.items);
    }
  }
})

export const { addItem, updateQty, removeItem, clearCart } = cartSlice.actions
export default cartSlice.reducer
