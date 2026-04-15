import { component$, type PropFunction } from '@builder.io/qwik';
import { getNodeId, getPinId } from '../../lib/electronics-geometry';
import type { ElectronicsNode as ElectronicsNodeType, ElectronicsPinRef } from '../../lib/electronics-types';

interface Props {
  node: ElectronicsNodeType;
  activePin: ElectronicsPinRef | null;
  isDragging: boolean;
  onNodeMouseDown$: PropFunction<(event: MouseEvent, nodeUid: string) => void>;
  onPinClick$: PropFunction<(event: MouseEvent, nodeUid: string, pinIdx: number) => void>;
  onDeleteNode$: PropFunction<(nodeUid: string) => void>;
  onOpenLinkedProduct$: PropFunction<(componentId: string) => void>;
}

const pinIsActive = (activePin: ElectronicsPinRef | null, nodeUid: string, pinIdx: number) => (
  activePin?.nodeUid === nodeUid && activePin.pinIdx === pinIdx
);

export const ElectronicsNode = component$<Props>(({
  node,
  activePin,
  isDragging,
  onNodeMouseDown$,
  onPinClick$,
  onDeleteNode$,
  onOpenLinkedProduct$,
}) => {
  const renderPin = (pinIdx: number) => (
    <button
      key={pinIdx}
      id={getPinId(node.uid, pinIdx)}
      type="button"
      title={`Pin ${pinIdx}`}
      class={['hw-pin', pinIsActive(activePin, node.uid, pinIdx) && 'active-pin']}
      onMouseDown$={(event) => event.stopPropagation()}
      onClick$={(event) => onPinClick$(event, node.uid, pinIdx)}
    />
  );

  const renderDeleteButton = () => (
    <button
      type="button"
      onMouseDown$={(event) => event.stopPropagation()}
      onClick$={() => onDeleteNode$(node.uid)}
      class="absolute -top-2 -right-2 bg-[#050505] border border-gray-600 text-gray-500 hover:border-[#ff3366] hover:bg-[#ff3366] hover:text-black w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-all z-30 font-bold rounded-sm"
    >
      X
    </button>
  );

  const renderProductLink = () => (
    typeof node.linkedProductId === 'number' && (
      <button
        type="button"
        onMouseDown$={(event) => event.stopPropagation()}
        onClick$={() => onOpenLinkedProduct$(node.id)}
        class="mt-2 text-[9px] uppercase tracking-widest text-[#00ffcc] hover:text-white"
      >
        [ View Product ]
      </button>
    )
  );

  const renderNodeBody = () => {
    if (node.package === 'dip') {
      const half = Math.ceil(node.pins / 2);
      const minHeight = Math.max(100, half * 16);
      return (
        <div class="flex gap-1 h-full w-full">
          <div class="flex flex-col justify-evenly py-2 gap-1.5 z-0">
            {Array.from({ length: half }, (_, index) => renderPin(index))}
          </div>
          <div class="ic-body flex-grow border border-gray-700 flex flex-col items-center justify-center z-10 shadow-[0_5px_15px_rgba(0,0,0,1)]" style={{ minHeight: `${minHeight}px`, minWidth: '90px' }}>
            <div class="ic-notch" />
            {renderDeleteButton()}
            <div class="flex flex-col text-center rotate-[-90deg] whitespace-nowrap">
              <span class="font-bold text-[13px] text-gray-200 tracking-widest opacity-90">{node.name}</span>
              <span class="text-[9px] text-gray-500 font-mono tracking-tight mt-1">{node.vcc}V | {node.current}mA</span>
              {renderProductLink()}
            </div>
          </div>
          <div class="flex flex-col justify-evenly py-2 gap-1.5 z-0">
            {Array.from({ length: node.pins - half }, (_, index) => renderPin(index + half))}
          </div>
        </div>
      );
    }

    if (node.package === 'breakout') {
      return (
        <div class="flex flex-col items-center h-full w-full">
          <div class="breakout-body w-full p-4 flex flex-col items-center justify-center min-h-[90px] z-10 shadow-inner min-w-[120px]">
            <div class="breakout-hole top-1 left-1" />
            <div class="breakout-hole top-1 right-1" />
            <div class="breakout-hole bottom-1 left-1" />
            <div class="breakout-hole bottom-1 right-1" />
            {renderDeleteButton()}
            <div class="font-bold text-sm text-[#00ffcc] mt-1">{node.name}</div>
            <div class="text-[9px] text-gray-400 uppercase">{node.vcc}V | {node.current}mA</div>
            {renderProductLink()}
          </div>
          <div class="flex justify-center gap-1.5 mt-[-4px] z-0 bg-[#0a1f14] px-3 rounded-b-sm border-x border-b border-[#143d29]">
            {Array.from({ length: node.pins }, (_, index) => renderPin(index))}
          </div>
        </div>
      );
    }

    if (node.package === 'module') {
      const inputPins = Math.floor(node.pins / 2);
      const outputPins = node.pins - inputPins;
      return (
        <div class="flex justify-between items-center h-full w-full gap-1">
          <div class="flex flex-col gap-3 z-20">
            {Array.from({ length: inputPins }, (_, index) => renderPin(index))}
          </div>
          <div class="power-body flex-grow min-h-[70px] min-w-[140px] flex items-center justify-center relative z-10 shadow-md">
            {renderDeleteButton()}
            <div class="bg-black/95 px-3 py-1.5 border border-gray-600 text-center shadow-[0_0_10px_rgba(0,0,0,1)]">
              <div class="font-bold text-sm text-[#ffcc00]">{node.name}</div>
              <div class="text-[9px] text-gray-500 uppercase">{node.vcc}V | {node.current}mA MAX</div>
              {renderProductLink()}
            </div>
          </div>
          <div class="flex flex-col gap-3 z-20">
            {Array.from({ length: outputPins }, (_, index) => renderPin(index + inputPins))}
          </div>
        </div>
      );
    }

    return (
      <div class="flex flex-col items-center h-full w-full">
        <div class="mech-body w-full p-3 flex flex-col items-center justify-center min-h-[100px] min-w-[100px] z-10 shadow-lg">
          {renderDeleteButton()}
          <div class="mech-shaft mb-2 shadow-[0_2px_5px_rgba(0,0,0,0.8)]" />
          <div class="font-bold text-xs text-gray-300">{node.name}</div>
          <div class="text-[8px] text-gray-500 uppercase">{node.current}mA limit</div>
          {renderProductLink()}
        </div>
        <div class="flex gap-1.5 justify-center mt-2">
          {Array.from({ length: node.pins }, (_, index) => renderPin(index))}
        </div>
      </div>
    );
  };

  return (
    <div
      id={getNodeId(node.uid)}
      data-uid={node.uid}
      class={['hw-node group', isDragging && 'dragging']}
      style={{ left: `${node.x}px`, top: `${node.y}px`, zIndex: node.zIndex }}
      onMouseDown$={(event) => onNodeMouseDown$(event, node.uid)}
    >
      {renderNodeBody()}
    </div>
  );
});
