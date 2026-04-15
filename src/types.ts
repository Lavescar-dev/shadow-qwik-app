import type { AssemblyCategoryId, AssemblyState } from './lib/assembly-types';
import type { ElectronicsWorkspaceState } from './lib/electronics-types';

export type SortKey = 'DEFAULT' | 'PRICE_ASC' | 'PRICE_DESC';
export type ViewKey = 'catalog' | 'detail' | 'checkout';
export type ToastType = 'info' | 'success' | 'error';
export type SectionKey = 'shop' | 'assembly' | 'electronic';

export interface ProductComment {
  user: string;
  text: string;
  rate: number;
}

export interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  tag: string;
  specs: Record<string, string>;
  longDesc: string;
  comments: ProductComment[];
}

export interface SharedInventoryItem extends Product {
  sections: readonly SectionKey[];
  assemblyCategory?: AssemblyCategoryId;
  electronicsComponentIds?: readonly string[];
}

export interface CartItem extends Product {
  qty: number;
}

export interface ControlsState {
  searchQuery: string;
  category: string;
  sort: SortKey;
  currentPage: number;
  itemsPerPage: number;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export interface AppStore {
  controls: ControlsState;
  cart: CartItem[];
  ui: {
    currentView: ViewKey;
    activeSection: SectionKey;
    detailOriginSection: SectionKey | null;
    selectedProductId: number | null;
    cartOpen: boolean;
    processingPayment: boolean;
  };
  assembly: AssemblyState;
  electronics: ElectronicsWorkspaceState;
  toasts: ToastMessage[];
  nextToastId: number;
}
