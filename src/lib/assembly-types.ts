export type AssemblyCategoryId =
  | 'chassis'
  | 'case_fans'
  | 'psu'
  | 'mobo'
  | 'cpu'
  | 'ram'
  | 'storage'
  | 'gpu'
  | 'cooling';

export interface AssemblyRepoItem {
  id: number;
  name: string;
  desc: string;
  price: number;
}

export interface AssemblyRepoCategory {
  id: AssemblyCategoryId;
  title: string;
  items: readonly AssemblyRepoItem[];
}

export type AssemblySelections = Record<AssemblyCategoryId, number | null>;

export type AssemblyStatusLevel = 'idle' | 'info' | 'warn' | 'error' | 'success';

export interface AssemblyState {
  selections: AssemblySelections;
  activeCategory: AssemblyCategoryId | null;
  hoveredCategory: AssemblyCategoryId | null;
  uptimeSeconds: number;
  statusMessage: string;
  statusLevel: AssemblyStatusLevel;
}

export interface AssemblyHudStatus {
  label: string;
  tone: 'ready' | 'warning';
}
