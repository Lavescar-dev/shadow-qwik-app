import { $, component$, useComputed$, useContext } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { AppContext } from '../context/app-context';
import { guardCheckout, removeFromCart, toggleCart, updateCartQty } from '../lib/actions';
import { getCartTotals } from '../lib/cart';
import { formatCurrency } from '../lib/format';

export const CartOverlay = component$(() => {
  const { app } = useContext(AppContext);
  const nav = useNavigate();
  const totals = useComputed$(() => getCartTotals(app.cart));
  const hasItems = useComputed$(() => app.cart.length > 0);

  const onCheckout$ = $(async () => {
    if (guardCheckout(app)) {
      await nav('/checkout');
    }
  });

  return (
    <div
      class={['fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] justify-end', app.ui.cartOpen ? 'flex' : 'hidden']}
      onClick$={(event) => { if (event.target === event.currentTarget) toggleCart(app, false); }}
    >
      <div class="bg-term_bg border-l border-term_dim w-full max-w-md h-full flex flex-col">
        <div class="p-6 border-b border-term_dim flex justify-between items-center">
          <h2 class="text-xl font-bold text-term_accent">/mnt/cart</h2>
          <button
            type="button"
            onClick$={() => toggleCart(app, false)}
            class="text-gray-400 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center"
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        <div class="flex-grow p-4 overflow-y-auto flex flex-col gap-3">
          {hasItems.value ? app.cart.map((item) => (
            <div key={item.id} class="flex gap-3 border border-term_dim p-3 items-center">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  class="w-14 h-14 object-contain bg-black border border-term_dim shrink-0 p-1"
                />
              ) : (
                <div class="w-14 h-14 bg-term_dim/30 border border-term_dim shrink-0 flex items-center justify-center text-term_dim text-[8px] font-mono">
                  IMG
                </div>
              )}
              <div class="flex-grow min-w-0">
                <div class="font-bold text-sm text-gray-200 truncate">{item.name}</div>
                <div class="font-mono text-xs text-gray-500 mt-1">{formatCurrency(item.price)} / unit</div>
                <div class="flex items-center gap-1 mt-2">
                  <button
                    type="button"
                    onClick$={() => updateCartQty(app, item.id, -1)}
                    class="w-7 h-7 border border-term_dim hover:border-term_accent hover:text-term_accent text-base flex items-center justify-center font-bold leading-none"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span class="font-mono text-sm text-term_accent w-8 text-center">{item.qty}</span>
                  <button
                    type="button"
                    onClick$={() => updateCartQty(app, item.id, 1)}
                    class="w-7 h-7 border border-term_dim hover:border-term_accent hover:text-term_accent text-base flex items-center justify-center font-bold leading-none"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2 shrink-0">
                <span class="font-mono text-sm">{formatCurrency(item.price * item.qty)}</span>
                <button
                  type="button"
                  onClick$={() => removeFromCart(app, item.id)}
                  class="text-red-500 hover:text-red-400 font-bold text-xs tracking-widest"
                  aria-label="Remove from cart"
                >
                  [ RM ]
                </button>
              </div>
            </div>
          )) : (
            <div class="text-gray-500 text-center mt-10 font-mono">
              <div class="text-3xl mb-2 opacity-40">∅</div>
              Sepet boş. (EOF)
            </div>
          )}
        </div>

        <div class="p-6 border-t border-term_dim">
          <div class="flex justify-between items-center mb-2 text-sm font-mono text-gray-500">
            <span>Subtotal:</span>
            <span>{formatCurrency(totals.value.subtotal)}</span>
          </div>
          <div class="flex justify-between items-center mb-4 text-sm font-mono text-gray-500">
            <span>Shipping:</span>
            <span>{formatCurrency(totals.value.shipping)}</span>
          </div>
          <div class="flex justify-between items-center mb-6 text-lg">
            <span>Toplam:</span>
            <span class="font-bold text-term_accent">{formatCurrency(totals.value.total)}</span>
          </div>
          <button
            type="button"
            onClick$={onCheckout$}
            class={[
              'w-full font-bold py-3 uppercase tracking-wider transition-colors',
              hasItems.value
                ? 'bg-term_accent text-term_bg hover:bg-white'
                : 'border border-dashed border-term_dim text-gray-700 cursor-not-allowed bg-transparent',
            ]}
            disabled={!hasItems.value}
          >
            {hasItems.value ? 'Execute Order (Sudo)' : 'Awaiting payload...'}
          </button>
        </div>
      </div>
    </div>
  );
});
