import { assemblyRepo } from '../data/assembly-repo';
import type {
  AssemblyCategoryId,
  AssemblyHudStatus,
  AssemblyRepoItem,
  AssemblyState,
  AssemblyStatusLevel,
} from './assembly-types';

export const getAssemblySelectedItem = (
  state: AssemblyState,
  categoryId: AssemblyCategoryId,
) => {
  const selectedId = state.selections[categoryId];
  if (!selectedId) return null;
  const category = assemblyRepo.find((item) => item.id === categoryId);
  return category?.items.find((item) => item.id === selectedId) ?? null;
};

export const getAssemblySelectedEntries = (state: AssemblyState) => (
  assemblyRepo.flatMap((category) => {
    const item = getAssemblySelectedItem(state, category.id);
    return item ? [{ category, item }] : [];
  })
);

export const getAssemblyTotal = (state: AssemblyState) => (
  getAssemblySelectedEntries(state).reduce((sum, entry) => sum + entry.item.price, 0)
);

export const getAssemblyMissingCount = (state: AssemblyState) => (
  assemblyRepo.filter((category) => state.selections[category.id] == null).length
);

export const getAssemblyHudStatus = (state: AssemblyState): AssemblyHudStatus => {
  const missing = getAssemblyMissingCount(state);
  return missing === 0
    ? { label: 'READY', tone: 'ready' }
    : { label: `MISSING (${missing})`, tone: 'warning' };
};

export const setAssemblyStatus = (
  state: AssemblyState,
  message: string,
  level: AssemblyStatusLevel,
) => {
  state.statusMessage = message;
  state.statusLevel = level;
};

export const toggleAssemblyCategory = (
  state: AssemblyState,
  categoryId: AssemblyCategoryId,
) => {
  state.activeCategory = state.activeCategory === categoryId ? null : categoryId;
};

export const closeAssemblyCategory = (state: AssemblyState) => {
  state.activeCategory = null;
};

export const selectAssemblyComponent = (
  state: AssemblyState,
  categoryId: AssemblyCategoryId,
  itemId: number,
) => {
  state.selections[categoryId] = itemId;
  state.activeCategory = null;
  setAssemblyStatus(state, `[ALLOC] /mnt/${categoryId} mapped.`, 'info');
};

export const removeAssemblyComponent = (
  state: AssemblyState,
  categoryId: AssemblyCategoryId,
) => {
  state.selections[categoryId] = null;
  setAssemblyStatus(state, `[WARN] /mnt/${categoryId} unmounted.`, 'warn');
};

export const compileAssemblyBuild = (state: AssemblyState) => {
  const missing = getAssemblyMissingCount(state);
  if (missing > 0) {
    setAssemblyStatus(state, `FATAL: Eksik dependency [${missing}].`, 'error');
    return false;
  }

  setAssemblyStatus(state, 'SUCCESS: Kernel update tamamlandi.', 'success');
  return true;
};

export const getAssemblyHudItem = (
  state: AssemblyState,
  categoryId: AssemblyCategoryId | null,
): { categoryTitle: string; item: AssemblyRepoItem | null; categoryId: AssemblyCategoryId } | null => {
  if (!categoryId) return null;
  const category = assemblyRepo.find((item) => item.id === categoryId);
  if (!category) return null;
  return {
    categoryTitle: category.title,
    item: getAssemblySelectedItem(state, category.id),
    categoryId: category.id,
  };
};
