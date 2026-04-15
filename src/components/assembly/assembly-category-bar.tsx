import { component$, type PropFunction } from '@builder.io/qwik';
import { assemblyRepo } from '../../data/assembly-repo';
import type { AssemblyCategoryId, AssemblyState } from '../../lib/assembly-types';

interface Props {
  state: AssemblyState;
  onToggleCategory$: PropFunction<(categoryId: AssemblyCategoryId) => void>;
  onSelectComponent$: PropFunction<(categoryId: AssemblyCategoryId, itemId: number) => void>;
}

export const AssemblyCategoryBar = component$<Props>(({ state, onToggleCategory$, onSelectComponent$ }) => (
  <nav class="relative z-50 flex-shrink-0 border border-term_border bg-panel_bg shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
    <div class="px-2 py-1 border-b border-term_border bg-pane_hdr flex items-center gap-2">
      <div class="w-2 h-2 bg-term_accent" />
      <span class="text-[10px] uppercase tracking-widest text-gray-500">/var/lib/repo/select_node</span>
    </div>

    <div class="flex flex-wrap gap-2 p-2">
      {assemblyRepo.map((category) => {
        const selectedItemId = state.selections[category.id];
        const isSelected = selectedItemId !== null;
        const isOpen = state.activeCategory === category.id;

        return (
          <div key={category.id} class="relative group">
            <button
              type="button"
              onClick$={(event) => {
                event.stopPropagation();
                onToggleCategory$(category.id);
              }}
              class={[
                'px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors flex items-center gap-2',
                isSelected ? 'border-term_accent text-term_accent bg-term_accent/5' : 'border-term_border text-gray-400 bg-black hover:border-gray-500 hover:text-white',
              ]}
            >
              <span>{category.title}</span>
              {isSelected && <span class="w-1.5 h-1.5 rounded-full bg-term_accent shadow-[0_0_5px_#00ffcc]" />}
            </button>

            <div class={[isOpen ? 'block' : 'hidden', 'absolute left-0 top-full mt-1 w-64 border border-term_border bg-[#050505] shadow-[0_10px_30px_rgba(0,0,0,0.9)] z-[100]']}>
              {category.items.map((item) => (
                <div
                  key={item.id}
                  class={[
                    'border-b border-term_border/50 last:border-0 p-3 flex flex-col hover:bg-term_accent/10 hover:border-l-2 hover:border-l-term_accent cursor-pointer transition-all border-l-2',
                    selectedItemId === item.id ? 'bg-term_accent/5 border-l-term_accent' : 'border-l-transparent',
                  ]}
                  onClick$={() => onSelectComponent$(category.id, item.id)}
                >
                  <div class="flex justify-between items-center mb-1">
                    <div class="font-bold text-gray-200 text-xs truncate pr-2">{item.name}</div>
                    <div class="text-white font-mono font-bold text-[10px] shrink-0">${item.price.toFixed(2)}</div>
                  </div>
                  <div class="text-[9px] text-gray-500 truncate">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </nav>
));
