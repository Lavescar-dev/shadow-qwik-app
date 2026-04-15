import { component$, type PropFunction } from '@builder.io/qwik';
import type { ElectronicsComponentDef, ElectronicsStats } from '../../lib/electronics-types';

interface ComponentGroup {
  type: string;
  items: readonly ElectronicsComponentDef[];
}

interface Props {
  searchQuery: string;
  groups: readonly ComponentGroup[];
  stats: ElectronicsStats;
  onSearchChange$: PropFunction<(value: string) => void>;
  onInstantiate$: PropFunction<(componentId: string) => void>;
  onOpenLinkedProduct$: PropFunction<(componentId: string) => void>;
}

export const ElectronicsSidebar = component$<Props>(({
  searchQuery,
  groups,
  stats,
  onSearchChange$,
  onInstantiate$,
  onOpenLinkedProduct$,
}) => (
  <aside class="w-full md:w-80 border-r border-[#262626] bg-[#0a0a0a] flex flex-col h-1/3 md:h-full z-30 shrink-0 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
    <div class="p-3 border-b border-[#262626] flex justify-between items-center bg-black shrink-0">
      <span class="text-xs uppercase tracking-widest text-gray-400 font-bold">/sys/components</span>
      <input
        type="text"
        value={searchQuery}
        placeholder="grep..."
        onInput$={(event) => onSearchChange$((event.target as HTMLInputElement).value)}
        class="bg-transparent border-b border-[#262626] text-[#e5e5e5] px-2 focus:border-[#00ffcc] focus:outline-none text-xs w-24"
      />
    </div>

    <div class="flex-grow overflow-y-auto pb-4 relative">
      {groups.length ? groups.map((group) => (
        <div key={group.type}>
          <div class="category-header px-4 py-2 text-[10px] uppercase font-bold text-[#00ffcc] tracking-widest flex justify-between items-center shadow-sm">
            <span>{group.type}</span>
            <span class="text-gray-600">[{group.items.length}]</span>
          </div>

          {group.items.map((component) => (
            <div
              key={component.id}
              class="border-b border-[#262626]/50 p-3 hover:border-l-2 hover:border-l-[#00ffcc] bg-[#111] hover:bg-[#151515] cursor-pointer transition-all"
              onClick$={() => onInstantiate$(component.id)}
            >
              <div class="flex justify-between items-center mb-1">
                <span class="font-bold text-sm text-gray-300">{component.name}</span>
                <span class="text-[9px] bg-[#050505] border border-gray-800 px-1.5 py-0.5 text-gray-500 uppercase font-bold">
                  {component.package}
                </span>
              </div>
              <div class="text-[10px] text-gray-500 flex justify-between gap-3">
                <span>P:{component.pins} | {component.vcc}V | {component.current}mA</span>
                <span class="text-gray-400">${component.price.toFixed(2)}</span>
              </div>

              {typeof component.linkedProductId === 'number' && (
                <button
                  type="button"
                  class="mt-2 text-[10px] uppercase tracking-widest text-[#00ffcc] hover:text-white"
                  onClick$={(event) => {
                    event.stopPropagation();
                    onOpenLinkedProduct$(component.id);
                  }}
                >
                  [ View Product ]
                </button>
              )}
            </div>
          ))}
        </div>
      )) : (
        <div class="p-4 text-xs text-gray-500">grep: No match found.</div>
      )}
    </div>

    <div class="p-4 bg-black border-t border-[#262626] shrink-0">
      <div class="text-[10px] uppercase text-[#00ffcc] mb-2 border-b border-gray-800 pb-1 tracking-widest font-bold">Live Netlist Data</div>
      <div class="flex justify-between gap-2 text-xs mb-1.5">
        <span class="text-gray-500">Component Count:</span>
        <span class="font-bold text-gray-200">{stats.nodeCount}</span>
      </div>
      <div class="flex justify-between gap-2 text-xs mb-1.5">
        <span class="text-gray-500">Total Power Draw:</span>
        <span class={stats.totalPower > 2000 ? 'font-bold text-[#ff3366]' : stats.totalPower > 500 ? 'font-bold text-[#ffcc00]' : 'font-bold text-gray-200'}>
          {stats.totalPower} mA
        </span>
      </div>
      <div class="flex justify-between gap-2 text-xs mb-1.5">
        <span class="text-gray-500">Active Copper Traces:</span>
        <span class="font-bold text-[#c87b3f]">{stats.traceCount}</span>
      </div>
      <div class="flex justify-between gap-2 text-sm mt-3 pt-2 border-t border-gray-800">
        <span class="text-[#00ffcc] font-bold">Total BOM Cost:</span>
        <span class="font-bold text-[#00ffcc]">${stats.totalPrice.toFixed(2)}</span>
      </div>
    </div>
  </aside>
));
