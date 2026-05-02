import { $, component$, useComputed$, useContext } from '@builder.io/qwik';
import { Link, useNavigate } from '@builder.io/qwik-city';
import { AppContext } from '../context/app-context';
import { completeCheckout } from '../lib/actions';
import { getCartTotals } from '../lib/cart';
import { formatCurrency } from '../lib/format';
import { LockIcon } from './icons';

export const CheckoutView = component$(() => {
  const { app } = useContext(AppContext);
  const nav = useNavigate();
  const totals = useComputed$(() => getCartTotals(app.cart));

  const onSubmit$ = $((_: unknown, form: HTMLFormElement) => {
    if (app.ui.processingPayment) return;
    app.ui.processingPayment = true;
    window.setTimeout(() => {
      completeCheckout(app, form);
      void nav('/');
    }, 2000);
  });

  return (
    <div>
      <Link
        href="/"
        class="mb-6 flex items-center gap-2 text-gray-400 hover:text-term_accent transition-colors group"
      >
        <span class="font-bold text-xl group-hover:-translate-x-1 transition-transform">&lt;</span>
        <span class="font-mono">$ cd /mnt/cart</span>
      </Link>
      <div class="mb-8 border-l-4 border-term_accent pl-4">
        <h2 class="text-2xl font-bold uppercase mb-2">Secure Transaction Terminal</h2>
        <p class="text-gray-400 font-mono text-sm">Bağlantı şifrelendi: TLS 1.3 / X25519 / AES-256-GCM</p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div class="lg:col-span-2">
          <form class="space-y-8" preventdefault:submit onSubmit$={onSubmit$}>
            <div class="border border-term_dim p-6 bg-black">
              <h3 class="text-term_accent font-bold mb-4 uppercase tracking-widest text-sm border-b border-term_dim pb-2">/etc/shipping_config</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-500 text-xs mb-1 font-mono">&gt; ALICI_ID (Full Name)</label>
                  <input type="text" required class="w-full bg-[#050505] border border-term_dim text-term_fg px-3 py-2 focus:border-term_accent focus:outline-none font-mono" />
                </div>
                <div>
                  <label class="block text-gray-500 text-xs mb-1 font-mono">&gt; İLETİŞİM_PORT (Email)</label>
                  <input type="email" required class="w-full bg-[#050505] border border-term_dim text-term_fg px-3 py-2 focus:border-term_accent focus:outline-none font-mono" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-gray-500 text-xs mb-1 font-mono">&gt; HEDEF_NODE (Address Line)</label>
                  <input type="text" required class="w-full bg-[#050505] border border-term_dim text-term_fg px-3 py-2 focus:border-term_accent focus:outline-none font-mono" />
                </div>
                <div>
                  <label class="block text-gray-500 text-xs mb-1 font-mono">&gt; SUBNET (City)</label>
                  <input type="text" required class="w-full bg-[#050505] border border-term_dim text-term_fg px-3 py-2 focus:border-term_accent focus:outline-none font-mono" />
                </div>
                <div>
                  <label class="block text-gray-500 text-xs mb-1 font-mono">&gt; POSTA_KODU</label>
                  <input type="text" required class="w-full bg-[#050505] border border-term_dim text-term_fg px-3 py-2 focus:border-term_accent focus:outline-none font-mono" />
                </div>
              </div>
            </div>
            <div class="border border-term_dim p-6 bg-black relative overflow-hidden">
              <div class="absolute right-0 top-0 opacity-10 pointer-events-none"><LockIcon class="w-48 h-48" /></div>
              <h3 class="text-term_accent font-bold mb-4 uppercase tracking-widest text-sm border-b border-term_dim pb-2 relative z-10">/dev/crypto_module</h3>
              <div class="space-y-4 relative z-10">
                <div>
                  <label class="block text-gray-500 text-xs mb-1 font-mono">&gt; KART_NUMARASI</label>
                  <input type="text" required pattern="[0-9]{16}" inputMode="numeric" placeholder="0000000000000000" class="w-full bg-[#050505] border border-term_dim text-term_fg px-3 py-2 focus:border-term_accent focus:outline-none font-mono tracking-widest" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-gray-500 text-xs mb-1 font-mono">&gt; EXP (MM/YY)</label>
                    <input type="text" required pattern="[0-9]{2}/[0-9]{2}" placeholder="12/26" class="w-full bg-[#050505] border border-term_dim text-term_fg px-3 py-2 focus:border-term_accent focus:outline-none font-mono" />
                  </div>
                  <div>
                    <label class="block text-gray-500 text-xs mb-1 font-mono">&gt; CVC</label>
                    <input type="password" required pattern="[0-9]{3,4}" inputMode="numeric" placeholder="***" class="w-full bg-[#050505] border border-term_dim text-term_fg px-3 py-2 focus:border-term_accent focus:outline-none font-mono tracking-widest" />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              class={[
                'w-full border-2 border-term_accent py-4 font-bold uppercase tracking-widest transition-all',
                app.ui.processingPayment
                  ? 'bg-term_accent/10 text-term_accent opacity-50 cursor-not-allowed'
                  : 'bg-term_accent/10 text-term_accent hover:bg-term_accent hover:text-term_bg',
              ]}
              disabled={app.ui.processingPayment}
            >
              {app.ui.processingPayment ? '[ ENCRYPTING PAYLOAD... ]' : '[ Execute Transaction ]'}
            </button>
          </form>
        </div>
        <div class="border border-term_dim p-6 bg-[#050505] h-fit sticky top-24">
          <h3 class="text-gray-300 font-bold mb-6 uppercase tracking-widest text-sm border-b border-term_dim pb-2">Transaction Payload</h3>
          <div class="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
            {app.cart.map((item) => (
              <div key={item.id} class="flex justify-between items-start text-sm">
                <div class="pr-4">
                  <div class="text-gray-200">{item.name}</div>
                  <div class="text-term_accent text-xs">QTY: {item.qty}</div>
                </div>
                <div class="font-mono text-gray-400 shrink-0">{formatCurrency(item.price * item.qty)}</div>
              </div>
            ))}
          </div>
          <div class="border-t border-term_dim pt-4 space-y-2 font-mono text-sm">
            <div class="flex justify-between text-gray-400"><span>Subtotal:</span><span>{formatCurrency(totals.value.subtotal)}</span></div>
            <div class="flex justify-between text-gray-400"><span>Network Fee (Shipping):</span><span>{formatCurrency(totals.value.shipping)}</span></div>
            <div class="flex justify-between text-term_accent font-bold text-lg mt-4 pt-4 border-t border-term_dim/50"><span>TOTAL:</span><span>{formatCurrency(totals.value.total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
});
