import { assemblyRepo } from '../data/assembly-repo';
import type { AssemblyCategoryId, AssemblyState } from './assembly-types';

export const assemblyCategoryIds = assemblyRepo.map((category) => category.id);

export const createInitialAssemblyState = (): AssemblyState => ({
  selections: {
    chassis: null,
    case_fans: null,
    psu: null,
    mobo: null,
    cpu: null,
    ram: null,
    storage: null,
    gpu: null,
    cooling: null,
  },
  activeCategory: null,
  hoveredCategory: null,
  uptimeSeconds: 0,
  statusMessage: 'Idle',
  statusLevel: 'idle',
});

export const isAssemblyCategoryId = (value: string): value is AssemblyCategoryId => (
  assemblyCategoryIds.includes(value as AssemblyCategoryId)
);
