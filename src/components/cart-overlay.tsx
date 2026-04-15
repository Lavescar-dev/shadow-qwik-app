import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { AppContext } from '../context/app-context';
import { openCheckout, removeFromCart, toggleCart } from '../lib/actions';
import { getCartTotals } from '../lib/cart';
import { formatCurrency } from '../lib/format';

export const CartOverlay = component$(() => {
  const { app } = useContext(AppContext);
  const totals = useComputed$(() => getCartTotals(app.cart));
  return (
    <div class={['fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] justify-end', app.ui.cartOpen ? 'flex' : 'hidden']} onClick$={(event) => { if (event.target === event.currentTarget) toggleCart(app, false); }}>
      <div class="bg-term_bg border-l border-term_dim w-full max-w-md h-full flex flex-col">
        <div class="p-6 border-b border-term_dim flex justify-between items-center"><h2 class="text-xl font-bold text-term_accent">/mnt/cart</h2><button type="button" onClick$={() => toggleCart(app, false)} class="text-gray-400 hover:text-white text-2xl leading-none">&times;</button></div>
        <div class="flex-grow p-6 overflow-y-auto flex flex-col gap-4">
          {app.cart.length ? app.cart.map((item) => <div key={item.id} class="flex justify-between items-center border border-term_dim p-3"><div><div class="font-bold text-sm text-gray-200">{item.name}</div><div class="text-xs text-term_accent">QTY: {item.qty}</div></div><div class="flex items-center gap-4"><span class="font-mono text-sm">{formatCurrency(item.price * item.qty)}</span><button type="button" onClick$={() => removeFromCart(app, item.id)} class="text-red-500 hover:text-red-400 font-bold">X</button></div></div>) : <div class="text-gray-500 text-center mt-10">Sepet boş. (EOF)</div>}
        </div>
        <div class="p-6 border-t border-term_dim"><div class="flex justify-between items-center mb-6 text-lg"><span>Toplam:</span><span class="font-bold text-term_accent">{formatCurrency(totals.value.subtotal)}</span></div><button type="button" onClick$={() => openCheckout(app)} class="w-full bg-term_accent text-term_bg font-bold py-3 uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!app.cart.length}>Execute Order (Sudo)</button></div>
      </div>
    </div>
  );
});
