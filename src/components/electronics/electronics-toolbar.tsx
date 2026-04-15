import { component$, type PropFunction } from '@builder.io/qwik';

interface Props {
  onClearTraces$: PropFunction<() => void>;
  onClearBoard$: PropFunction<() => void>;
}

export const ElectronicsToolbar = component$<Props>(({ onClearTraces$, onClearBoard$ }) => (
  <header class="border-b border-[#262626] p-2 flex justify-between items-center bg-black z-20 text-sm shrink-0 shadow-md">
    <div class="flex items-center gap-4">
      <span class="text-[#00ffcc] font-bold px-2 tracking-widest text-lg">SHADOW // EDA</span>
      <span class="text-gray-500 hidden md:inline border-l border-gray-800 pl-4">v4.1 Coordinate Engine [BOM Refactor]</span>
    </div>
    <div class="flex gap-3">
      <button
        type="button"
        onClick$={onClearTraces$}
        class="px-4 py-1.5 bg-[#111] border border-[#262626] hover:border-[#ffcc00] hover:text-[#ffcc00] transition-colors text-xs uppercase font-bold"
      >
        [ Cut Copper ]
      </button>
      <button
        type="button"
        onClick$={onClearBoard$}
        class="px-4 py-1.5 bg-[#111] border border-[#262626] hover:border-[#ff3366] hover:text-[#ff3366] transition-colors text-xs uppercase font-bold"
      >
        [ Format Board ]
      </button>
    </div>
  </header>
));
