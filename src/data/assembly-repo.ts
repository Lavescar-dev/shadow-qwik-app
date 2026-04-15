import { assemblyProductsByCategory } from './shared-inventory';
import type { AssemblyRepoCategory } from '../lib/assembly-types';

const assemblyCategoryMeta = [
  { id: 'chassis', title: 'CHASSIS' },
  { id: 'case_fans', title: 'CASE FANS' },
  { id: 'psu', title: 'POWER' },
  { id: 'mobo', title: 'MOBO' },
  { id: 'cpu', title: 'CPU' },
  { id: 'ram', title: 'RAM' },
  { id: 'storage', title: 'STORAGE' },
  { id: 'gpu', title: 'GPU' },
  { id: 'cooling', title: 'COOLING' },
] as const satisfies ReadonlyArray<Pick<AssemblyRepoCategory, 'id' | 'title'>>;

export const assemblyRepo: readonly AssemblyRepoCategory[] = assemblyCategoryMeta.map((category) => ({
  id: category.id,
  title: category.title,
  items: assemblyProductsByCategory[category.id].map((product) => ({
    id: product.id,
    name: product.name,
    desc: product.desc,
    price: product.price,
  })),
}));
