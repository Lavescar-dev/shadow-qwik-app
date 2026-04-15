import { component$, type PropFunction, type Signal } from '@builder.io/qwik';
import type { ElectronicsNode as ElectronicsNodeType, ElectronicsPinRef, ElectronicsRenderedTrace } from '../../lib/electronics-types';
import { ElectronicsNode } from './electronics-node';

interface Props {
  boardRef: Signal<HTMLElement | undefined>;
  nodes: readonly ElectronicsNodeType[];
  traces: readonly ElectronicsRenderedTrace[];
  activePin: ElectronicsPinRef | null;
  draggingNodeUid: string | null;
  onBoardMouseDown$: PropFunction<(event: MouseEvent) => void>;
  onNodeMouseDown$: PropFunction<(event: MouseEvent, nodeUid: string) => void>;
  onPinClick$: PropFunction<(event: MouseEvent, nodeUid: string, pinIdx: number) => void>;
  onDeleteNode$: PropFunction<(nodeUid: string) => void>;
  onDeleteTrace$: PropFunction<(traceId: string) => void>;
  onOpenLinkedProduct$: PropFunction<(componentId: string) => void>;
}

export const ElectronicsBoard = component$<Props>(({
  boardRef,
  nodes,
  traces,
  activePin,
  draggingNodeUid,
  onBoardMouseDown$,
  onNodeMouseDown$,
  onPinClick$,
  onDeleteNode$,
  onDeleteTrace$,
  onOpenLinkedProduct$,
}) => (
  <section
    id="board-container"
    ref={boardRef}
    class="flex-grow relative eda-workspace m-2 rounded-sm overflow-hidden min-h-[420px]"
    onMouseDown$={onBoardMouseDown$}
  >
    <svg id="svg-layer" class="electronics-svg-layer absolute inset-0 w-full h-full z-10">
      {traces.map((trace) => (
        <path key={trace.id} d={trace.path} class="trace-line" onClick$={() => onDeleteTrace$(trace.id)} />
      ))}
    </svg>

    {!nodes.length && (
      <div id="empty-state" class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40 z-0">
        <svg class="w-16 h-16 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span class="text-[#262626] text-xl tracking-widest uppercase font-bold">Deploy Hardware to Sector</span>
      </div>
    )}

    <div id="board-canvas" class="absolute inset-0 z-20">
      {nodes.map((node) => (
        <ElectronicsNode
          key={node.uid}
          node={node}
          activePin={activePin}
          isDragging={draggingNodeUid === node.uid}
          onNodeMouseDown$={onNodeMouseDown$}
          onPinClick$={onPinClick$}
          onDeleteNode$={onDeleteNode$}
          onOpenLinkedProduct$={onOpenLinkedProduct$}
        />
      ))}
    </div>
  </section>
));
