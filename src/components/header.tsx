import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { AppContext } from '../context/app-context';
import { toggleCart } from '../lib/actions';
import { getCartTotals } from '../lib/cart';
import { CartIcon } from './icons';

const NAV_ITEMS = [
  { href: '/', label: './shop' },
  { href: '/assembly', label: './assembly' },
  { href: '/electronic', label: './electronic' },
] as const;

const sectionLabel = (pathname: string, fromParam: string | null): string => {
  if (pathname.startsWith('/assembly')) return 'assembly';
  if (pathname.startsWith('/electronic')) return 'electronic';
  if (pathname.startsWith('/checkout')) return fromParam || 'cart';
  if (pathname.startsWith('/product/')) return fromParam || 'shop';
  return 'shop';
};

export const Header = component$(() => {
  const { app } = useContext(AppContext);
  const loc = useLocation();
  const totals = useComputed$(() => getCartTotals(app.cart));
  const section = useComputed$(() =>
    sectionLabel(loc.url.pathname, loc.url.searchParams.get('from')),
  );

  const isActive = (href: string) => {
    const path = loc.url.pathname;
    if (href === '/assembly') return path.startsWith('/assembly');
    if (href === '/electronic') return path.startsWith('/electronic');
    return !path.startsWith('/assembly') && !path.startsWith('/electronic');
  };

  return (
    <header class="sticky top-0 z-50 flex flex-col shadow-md shadow-term_dim/20">
      <div class="bg-term_dim text-[10px] sm:text-xs py-1.5 px-4 border-b border-black/50 text-term_fg/70 font-mono tracking-widest">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
          <div class="flex gap-4">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-term_accent animate-pulse"></span>
              <span class="text-term_accent font-bold">SYS_ONLINE</span>
            </div>
            <span class="hidden sm:inline opacity-70">| NODE: shadow-alpha</span>
          </div>
          <div class="flex gap-4 opacity-70">
            <span class="hidden sm:inline">SECURE_CHNL: ACTIVE</span>
            <span>v1.0.4</span>
          </div>
        </div>
      </div>

      <nav class="bg-term_bg/95 backdrop-blur border-b border-term_dim p-4">
        <div class="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div class="flex items-center gap-2 sm:gap-6 flex-wrap">
            <Link
              href="/"
              class="text-xl sm:text-2xl font-bold tracking-tighter hover:text-term_accent transition-colors flex items-center gap-1"
            >
              <span class="text-term_accent">root@shadow</span>
              <div class="inline-flex items-center w-[180px] sm:w-[220px] whitespace-nowrap">
                <span class="opacity-80">:~/{section.value}$</span>
                <span class="w-2.5 h-6 bg-term_fg/50 animate-pulse ml-1 inline-block align-middle shrink-0"></span>
              </div>
            </Link>

            <div class="flex gap-4 sm:gap-6 text-sm sm:text-base font-mono overflow-x-auto scrollbar-hide items-center">
              {NAV_ITEMS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  class={`transition-all whitespace-nowrap ${
                    isActive(href) ? 'text-term_accent font-bold' : 'text-term_fg/60 hover:text-term_accent'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick$={() => toggleCart(app)}
            class="flex items-center gap-2 hover:text-term_accent transition-colors border border-term_dim hover:border-term_accent/50 px-3 py-1.5 rounded bg-term_bg hover:bg-term_dim/50 shadow-sm ml-auto"
            type="button"
            title="Sepeti Aç"
          >
            <CartIcon class="w-5 h-5" />
            <span class="hidden sm:inline">Sepet</span>
            <span class="font-bold text-term_accent">[ {totals.value.itemCount} ]</span>
          </button>
        </div>
      </nav>
    </header>
  );
});
