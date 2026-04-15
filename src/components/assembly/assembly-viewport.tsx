import { component$, type PropFunction, type Signal } from '@builder.io/qwik';
import type { AssemblyCategoryId, AssemblyHudStatus, AssemblyState } from '../../lib/assembly-types';
import { getAssemblyHudItem } from '../../lib/assembly-actions';

interface Props {
  containerRef: Signal<HTMLElement | undefined>;
  state: AssemblyState;
  hudStatus: AssemblyHudStatus;
  onCanvasMouseLeave$: PropFunction<() => void>;
}

export const AssemblyViewport = component$<Props>(({ containerRef, state, hudStatus, onCanvasMouseLeave$ }) => {
  const hudItem = getAssemblyHudItem(state, state.hoveredCategory);

  return (
    <main class="relative z-10 flex-grow border border-term_border bg-[#000000] min-h-0 shadow-[0_0_40px_rgba(0,0,0,1)_inset]">
      <div class="absolute top-4 left-4 z-20 pointer-events-none bg-black p-3 border border-term_border">
        <div class="text-[10px] text-term_accent uppercase tracking-widest mb-2 border-b border-term_border pb-1">Raycaster_V7.0_Widescreen</div>
        <div class="flex flex-col gap-1 min-w-[200px]">
          {hudItem ? hudItem.item ? (
            <>
              <div class="text-white font-bold text-[10px] mb-1 truncate">{hudItem.item.name}</div>
              <div class="text-gray-400 text-[9px] mb-2 truncate">{hudItem.item.desc}</div>
              <div class="flex justify-between border-t border-term_border pt-2">
                <span class="text-gray-500 text-[9px]">ADDR:</span>
                <span class="text-white text-[9px] font-mono">0x{hudItem.item.id.toString(16).padStart(8, '0').toUpperCase()}</span>
              </div>
              <div class="flex justify-between mt-1">
                <span class="text-gray-500 text-[9px]">STAT:</span>
                <span class="text-[9px] text-black bg-term_accent px-1 font-bold">MOUNTED</span>
              </div>
            </>
          ) : (
            <>
              <div class="text-white font-bold text-[10px] mb-1">{hudItem.categoryTitle}</div>
              <div class="text-[9px] text-black bg-yellow-500 px-1 inline-block font-bold">[ NULL_PTR ]</div>
              <div class="text-gray-500 text-[9px] mt-2">Status: Unallocated</div>
            </>
          ) : (
            <div class="text-gray-500 italic text-[10px]">&gt; Awaiting interrupt...</div>
          )}
        </div>
      </div>

      <div class="absolute top-4 right-4 z-20 pointer-events-none text-right bg-black p-3 border border-term_border">
        <div class="text-[10px] text-gray-500 uppercase tracking-widest">SYS_STATE</div>
        <div class={['text-[10px] font-bold', hudStatus.tone === 'ready' ? 'text-term_accent animate-pulse' : 'text-yellow-500']}>
          {hudStatus.label}
        </div>
      </div>

      <div ref={containerRef} class="topo-container w-full h-full" onMouseLeave$={onCanvasMouseLeave$} />
    </main>
  );
});
