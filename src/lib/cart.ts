import type { CartItem, Product } from '../types';

export const addCartItem = (cart: CartItem[], product: Product) => {
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.qty += 1;
    return;
  }
  cart.push({ ...product, qty: 1 });
};

export const removeCartItem = (cart: CartItem[], productId: number) => {
  const index = cart.findIndex((item) => item.id === productId);
  if (index >= 0) cart.splice(index, 1);
};

export const bumpCartItem = (cart: CartItem[], productId: number, delta: number) => {
  const index = cart.findIndex((item) => item.id === productId);
  if (index < 0) return;
  const next = cart[index].qty + delta;
  if (next <= 0) cart.splice(index, 1);
  else cart[index].qty = next;
};

export const getCartTotals = (cart: readonly CartItem[]) => {
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const shipping = cart.length ? 15 : 0;
  return { itemCount, subtotal, shipping, total: subtotal + shipping };
};
