import type { AppStore, Product, SectionKey, SortKey } from '../types';
import { addCartItem, bumpCartItem, removeCartItem } from './cart';
import { pushToast } from './toasts';

const scrollTop = (behavior: ScrollBehavior = 'auto') => {
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior });
};

export const setSearchQuery = (app: AppStore, query: string) => { app.controls.searchQuery = query; app.controls.currentPage = 1; };
export const setCategory = (app: AppStore, category: string) => { app.controls.category = category; app.controls.currentPage = 1; };
export const setSort = (app: AppStore, sort: SortKey) => { app.controls.sort = sort; app.controls.currentPage = 1; };
export const changePage = (app: AppStore, page: number, totalPages: number) => { if (page >= 1 && page <= totalPages) { app.controls.currentPage = page; scrollTop('smooth'); } };
export const openCatalog = (app: AppStore, section: SectionKey = app.ui.activeSection) => {
  app.ui.currentView = 'catalog';
  app.ui.activeSection = section;
  app.ui.detailOriginSection = null;
  app.ui.selectedProductId = null;
  scrollTop('auto');
};
export const openDetail = (app: AppStore, productId: number, originSection: SectionKey = app.ui.activeSection) => {
  app.ui.currentView = 'detail';
  app.ui.detailOriginSection = originSection;
  app.ui.selectedProductId = productId;
  scrollTop('auto');
};
export const toggleCart = (app: AppStore, force?: boolean) => { app.ui.cartOpen = typeof force === 'boolean' ? force : !app.ui.cartOpen; };
export const addToCart = (app: AppStore, product: Product) => { addCartItem(app.cart, product); pushToast(app, `+ ${product.name} belleğe eklendi.`, 'success'); };
export const removeFromCart = (app: AppStore, productId: number) => { removeCartItem(app.cart, productId); };
export const updateCartQty = (app: AppStore, productId: number, delta: number) => { bumpCartItem(app.cart, productId, delta); };
export const openCheckout = (app: AppStore) => { if (!app.cart.length) { pushToast(app, 'HATA: Sepet boş. /dev/null a işlem yapılamaz.', 'error'); return false; } app.ui.currentView = 'checkout'; app.ui.cartOpen = false; scrollTop('auto'); return true; };
export const completeCheckout = (app: AppStore, form?: HTMLFormElement | null) => { form?.reset(); app.cart.splice(0, app.cart.length); app.ui.processingPayment = false; app.ui.currentView = 'catalog'; app.ui.detailOriginSection = null; scrollTop('auto'); pushToast(app, 'Transaction confirmed. Handshake successful.', 'success'); };
