import { createContextId } from '@builder.io/qwik';
import type { AssemblyCategoryId } from '../lib/assembly-types';
import type { AppStore, Product, SharedInventoryItem } from '../types';

export interface InventoryContextValue {
  items: readonly SharedInventoryItem[];
  productsById: Readonly<Record<number, Product>>;
  assemblyProductsByCategory: Readonly<Record<AssemblyCategoryId, readonly Product[]>>;
  productByElectronicsComponentId: Readonly<Record<string, Product>>;
}

export interface AppContextValue {
  app: AppStore;
  products: readonly Product[];
  categories: readonly string[];
  inventory: InventoryContextValue;
}

export const AppContext = createContextId<AppContextValue>('shadow.app-context');
