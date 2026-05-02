import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { AppContext } from '../context/app-context';
import { addToCart, openCatalog } from '../lib/actions';
import { createChecksum, formatCurrency, renderStars } from '../lib/format';
import { ImagePlaceholderIcon } from './icons';

export const DetailView = component$(() => {
  const { app, inventory } = useContext(AppContext);
  const product = useComputed$(() => (
    app.ui.selectedProductId ? inventory.productsById[app.ui.selectedProductId] ?? null : null
  ));

  if (!product.value) {
    return <div class="text-gray-500">Ürün verisi bulunamadı.</div>;
  }

  const selected = product.value;

  return (
    <div>
      <button type="button" onClick$={() => openCatalog(app, app.ui.detailOriginSection ?? app.ui.activeSection)} class="mb-6 flex items-center gap-2 text-gray-400 hover:text-term_accent transition-colors group"><span class="font-bold text-xl group-hover:-translate-x-1 transition-transform">&lt;</span><span class="font-mono">$ cd ..</span></button>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        <div class="aspect-square border border-term_dim bg-[#050505] flex flex-col items-center justify-center text-term_dim relative overflow-hidden group">
          {selected.image ? (
            <img
              src={selected.image}
              alt={selected.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              class="w-full h-full object-contain p-4 relative z-10"
            />
          ) : (
            <>
              <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: repeating-linear-gradient(45deg, #00ffcc 25%, transparent 25%, transparent 75%, #00ffcc 75%, #00ffcc), repeating-linear-gradient(45deg, #00ffcc 25%, #050505 25%, #050505 75%, #00ffcc 75%, #00ffcc); background-position: 0 0, 10px 10px; background-size: 20px 20px;"></div>
              <ImagePlaceholderIcon class="w-24 h-24 mb-4 relative z-10 group-hover:text-term_accent transition-colors duration-500" />
              <span class="text-xl tracking-widest uppercase relative z-10 font-bold group-hover:text-term_accent transition-colors duration-500">[ HI-RES_RENDER ]</span>
            </>
          )}
          <div class="absolute bottom-3 right-3 text-xs opacity-40 z-10 font-mono">CHECKSUM: {createChecksum(selected.name)}</div>
        </div>
        <div class="flex flex-col">
          <div class="flex justify-between items-start mb-2"><span class="text-xs bg-term_dim text-gray-300 px-2 py-1 rounded-sm">{selected.tag}</span><span class="text-xs text-gray-500 font-mono">PID: 0x{selected.id.toString(16).padStart(4, '0').toUpperCase()}</span></div>
          <h2 class="text-3xl md:text-4xl font-bold text-term_accent mb-4">{selected.name}</h2>
          <div class="text-2xl font-bold mb-6 text-white">{formatCurrency(selected.price)}</div>
          <p class="text-gray-400 mb-8 leading-relaxed">{selected.longDesc}</p>
          <div class="mb-8 border border-term_dim p-5 bg-black">
            <h4 class="text-term_accent font-bold mb-4 uppercase tracking-widest text-sm">/etc/hardware_specs.conf</h4>
            <ul class="text-sm text-gray-400 space-y-3 font-mono">
              {Object.entries(selected.specs).map(([label, value]) => <li key={label} class="flex border-b border-term_dim/50 pb-2"><span class="text-gray-500 w-32 shrink-0">{label}</span><span class="text-gray-200">{value}</span></li>)}
            </ul>
          </div>
          <button type="button" onClick$={() => addToCart(app, selected)} class="mt-auto border-2 border-term_accent bg-term_accent/10 py-4 w-full text-term_accent hover:bg-term_accent hover:text-term_bg transition-all font-bold uppercase tracking-widest text-lg shadow-[0_0_15px_rgba(0,255,204,0.1)] hover:shadow-[0_0_20px_rgba(0,255,204,0.3)]">[ Belleğe Pushla (Add to Cart) ]</button>
        </div>
      </div>
      <div class="border-t border-term_dim pt-10">
        <h3 class="text-xl font-bold mb-6 uppercase tracking-wider text-gray-300">/var/log/user_reviews.log</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selected.comments.length ? selected.comments.map((comment, index) => <div key={`${comment.user}-${index}`} class="border border-term_dim p-5 bg-[#050505] hover:border-term_dim/80 transition-colors"><div class="flex justify-between items-start mb-3"><span class="font-bold text-term_accent font-mono text-sm">@{comment.user}</span><span class="text-term_accent text-xs tracking-widest">{renderStars(comment.rate)}</span></div><p class="text-gray-400 text-sm leading-relaxed">{comment.text}</p></div>) : <div class="text-gray-500 text-sm font-mono">No feedback logs found. Be the first to compile.</div>}
        </div>
      </div>
    </div>
  );
});
