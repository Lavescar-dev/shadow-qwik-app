import { component$, type PropFunction } from '@builder.io/qwik';
import { assemblyRepo } from '../../data/assembly-repo';
import { getAssemblySelectedItem, getAssemblyTotal } from '../../lib/assembly-actions';
import type { AssemblyCategoryId, AssemblyState } from '../../lib/assembly-types';

interface Props {
  state: AssemblyState;
  onRemoveComponent$: PropFunction<(categoryId: AssemblyCategoryId) => void>;
  onCompile$: PropFunction<() => void>;
}

const statusToneClasses: Record<AssemblyState['statusLevel'], string> = {
  idle: 'text-gray-500',
  info: 'text-term_accent',
  warn: 'text-yellow-500',
  error: 'text-red-500',
  success: 'text-term_accent',
};

export const AssemblyFooter = component$<Props>(({ state, onRemoveComponent$, onCompile$ }) => {
  const total = getAssemblyTotal(state);
  const selectedEntries = assemblyRepo.flatMap((category) => {
    const item = getAssemblySelectedItem(state, category.id);
    return item ? [{ categoryId: category.id, title: category.title, item }] : [];
  });

  return (
    <footer class="relative z-20 flex-shrink-0 border border-term_border bg-panel_bg shadow-[0_-5px_15px_rgba(0,0,0,0.8)] flex flex-col md:flex-row h-auto md:h-44">
      <div class="flex-grow flex flex-col min-w-0 border-b md:border-b-0 md:border-r border-term_border">
        <div class="px-3 py-1 border-b border-term_border bg-pane_hdr flex justify-between items-center">
          <span class="text-[10px] uppercase tracking-widest text-term_accent font-bold">/etc/build_manifest.conf</span>
          <span class="text-[9px] text-gray-600">root@shadow</span>
        </div>

        <div class="flex-grow overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 content-start">
          {selectedEntries.length ? selectedEntries.map(({ categoryId, title, item }) => (
            <div key={`${categoryId}-${item.id}`} class="border border-term_border bg-black p-2 flex justify-between items-center group hover:border-red-900/50 transition-colors">
              <div class="min-w-0 flex-1 pr-2">
                <div class="text-[8px] text-term_accent uppercase tracking-widest opacity-70 mb-0.5">&gt;&gt; {title.toLowerCase()}</div>
                <div class="text-[10px] font-bold text-gray-200 truncate">{item.name}</div>
              </div>
              <div class="flex flex-col items-end shrink-0 gap-1">
                <span class="text-white text-[10px] font-mono font-bold">${item.price.toFixed(2)}</span>
                <button
                  type="button"
                  onClick$={() => onRemoveComponent$(categoryId)}
                  class="text-[8px] text-gray-600 group-hover:text-red-500 transition-colors uppercase font-bold tracking-wider hover:underline"
                >
                  unmount
                </button>
              </div>
            </div>
          )) : (
            <div class="col-span-full text-gray-600 opacity-50 text-[10px] italic flex h-full items-center justify-center">
              Manifest bos. (EOF)
            </div>
          )}
        </div>
      </div>

      <div class="w-full md:w-64 flex-shrink-0 flex flex-col bg-pane_hdr p-4 justify-between">
        <div>
          <span class="text-gray-500 uppercase tracking-widest text-[9px] block mb-1">Total Allocated CAPEX</span>
          <span class="font-bold text-2xl text-white block">
            ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div class="mt-4">
          <button
            type="button"
            onClick$={onCompile$}
            class="w-full border border-term_accent bg-term_accent/10 text-term_accent hover:bg-term_accent hover:text-term_bg py-3 text-xs font-bold uppercase tracking-widest transition-all"
          >
            ./make_install
          </button>
          <div class={['text-center text-[9px] mt-2 h-3 uppercase tracking-widest truncate', statusToneClasses[state.statusLevel]]}>
            {state.statusMessage}
          </div>
        </div>
      </div>
    </footer>
  );
});
