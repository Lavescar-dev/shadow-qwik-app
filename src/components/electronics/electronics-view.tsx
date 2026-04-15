import { $, component$, useComputed$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { AppContext } from '../../context/app-context';
import { electronicsComponents } from '../../data/electronics-components';
import {
  appendElectronicsLog,
  clearActivePin,
  clearElectronicsBoard,
  clearElectronicsLogs,
  clearElectronicsTraces,
  connectElectronicsPins,
  deleteElectronicsTrace,
  destroyElectronicsNode,
  filterElectronicsComponents,
  getElectronicsStats,
  groupElectronicsComponents,
  instantiateElectronicsNode,
} from '../../lib/electronics-actions';
import { buildTracePath, clamp, getNodeId, getPinId, rectsOverlap, snapToGrid } from '../../lib/electronics-geometry';
import { openDetail } from '../../lib/actions';
import './electronics.css';
import { ElectronicsBoard } from './electronics-board';
import { ElectronicsSidebar } from './electronics-sidebar';
import { ElectronicsTerminal } from './electronics-terminal';
import { ElectronicsToolbar } from './electronics-toolbar';

export const ElectronicsView = component$(() => {
  const { app, inventory } = useContext(AppContext);
  const state = app.electronics;
  const boardRef = useSignal<HTMLElement>();
  const traceFrame = useSignal<number>();

  const filteredComponents = useComputed$(() => filterElectronicsComponents(electronicsComponents, state.searchQuery));
  const groupedComponents = useComputed$(() => groupElectronicsComponents(filteredComponents.value));
  const stats = useComputed$(() => getElectronicsStats(state));

  const scheduleTraceRender = () => {
    if (typeof window === 'undefined' || traceFrame.value) return;

    traceFrame.value = window.requestAnimationFrame(() => {
      state.layoutVersion += 1;
      traceFrame.value = undefined;
    });
  };

  const renderTraces = () => {
    if (!boardRef.value) {
      state.renderedTraces = [];
      return;
    }

    const bounds = boardRef.value.getBoundingClientRect();
    state.renderedTraces = state.traces.flatMap((trace) => {
      const fromEl = document.getElementById(getPinId(trace.from.nodeUid, trace.from.pinIdx));
      const toEl = document.getElementById(getPinId(trace.to.nodeUid, trace.to.pinIdx));
      if (!fromEl || !toEl) return [];

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();
      const path = buildTracePath(
        {
          x: fromRect.left + (fromRect.width / 2) - bounds.left,
          y: fromRect.top + (fromRect.height / 2) - bounds.top,
        },
        {
          x: toRect.left + (toRect.width / 2) - bounds.left,
          y: toRect.top + (toRect.height / 2) - bounds.top,
        },
      );

      return [{ id: trace.id, path }];
    });
  };

  useVisibleTask$(({ cleanup }) => {
    if (!state.initialized) {
      appendElectronicsLog(
        state,
        `EDA Core Loaded. Database contains ${electronicsComponents.length} modules. Trace rendering stable.`,
        'succ',
      );
      state.initialized = true;
    }

    const handleResize = () => scheduleTraceRender();
    window.addEventListener('resize', handleResize);

    cleanup(() => {
      window.removeEventListener('resize', handleResize);
      if (traceFrame.value) window.cancelAnimationFrame(traceFrame.value);
    });
  });

  useVisibleTask$(({ track }) => {
    track(() => state.layoutVersion);
    renderTraces();
  });

  useVisibleTask$(({ cleanup }) => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!state.dragging.nodeUid || !boardRef.value) return;

      const node = state.nodes.find((item) => item.uid === state.dragging.nodeUid);
      const nodeEl = document.getElementById(getNodeId(state.dragging.nodeUid));
      if (!node || !nodeEl) return;

      const bounds = boardRef.value.getBoundingClientRect();
      const maxX = bounds.width - nodeEl.clientWidth;
      const maxY = bounds.height - nodeEl.clientHeight;
      const nextX = snapToGrid(clamp(event.clientX - bounds.left - state.dragging.offsetX, 0, maxX));
      const nextY = snapToGrid(clamp(event.clientY - bounds.top - state.dragging.offsetY, 0, maxY));

      node.x = nextX;
      node.y = nextY;
      scheduleTraceRender();
    };

    const handleMouseUp = () => {
      if (!state.dragging.nodeUid) return;

      const nodeUid = state.dragging.nodeUid;
      const node = state.nodes.find((item) => item.uid === nodeUid);
      const activeNode = document.getElementById(getNodeId(nodeUid));
      if (!node || !activeNode) {
        state.dragging.nodeUid = null;
        return;
      }

      const activeRect = activeNode.getBoundingClientRect();
      const collision = state.nodes.some((candidate) => {
        if (candidate.uid === nodeUid) return false;
        const candidateEl = document.getElementById(getNodeId(candidate.uid));
        return candidateEl ? rectsOverlap(activeRect, candidateEl.getBoundingClientRect()) : false;
      });

      if (collision) {
        node.x = state.dragging.startX;
        node.y = state.dragging.startY;
        activeNode.classList.add('collision');
        window.setTimeout(() => activeNode.classList.remove('collision'), 300);
        appendElectronicsLog(state, 'Hardware overlap detected. Short circuit prevented.', 'err');
      } else {
        appendElectronicsLog(state, `Vector locked: &${node.uid} at [${node.x}, ${node.y}]`);
      }

      state.dragging.nodeUid = null;
      scheduleTraceRender();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    cleanup(() => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    });
  });

  const onSearchChange$ = $((value: string) => {
    state.searchQuery = value;
  });

  const onInstantiate$ = $((componentId: string) => {
    const component = electronicsComponents.find((item) => item.id === componentId);
    if (!component || !boardRef.value) return;

    const bounds = boardRef.value.getBoundingClientRect();
    instantiateElectronicsNode(state, component, { width: bounds.width, height: bounds.height });
    scheduleTraceRender();
  });

  const onOpenLinkedProduct$ = $((componentId: string) => {
    const product = inventory.productByElectronicsComponentId[componentId];
    if (!product) return;
    openDetail(app, product.id, 'electronic');
  });

  const onClearTraces$ = $(() => {
    clearElectronicsTraces(state);
    scheduleTraceRender();
  });

  const onClearBoard$ = $(() => {
    clearElectronicsBoard(state);
    scheduleTraceRender();
  });

  const onClearLogs$ = $(() => {
    clearElectronicsLogs(state);
  });

  const onBoardMouseDown$ = $((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const clickIsCanvas = target.id === 'board-container' || target.id === 'board-canvas';
    if (clickIsCanvas && state.activePin) {
      clearActivePin(state);
      appendElectronicsLog(state, 'Route aborted.');
    }
  });

  const onNodeMouseDown$ = $((event: MouseEvent, nodeUid: string) => {
    if (event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (target.closest('button') || target.classList.contains('hw-pin')) return;

    const node = state.nodes.find((item) => item.uid === nodeUid);
    const nodeEl = document.getElementById(getNodeId(nodeUid));
    if (!node || !nodeEl) return;

    const rect = nodeEl.getBoundingClientRect();
    state.nodes.forEach((item) => {
      item.zIndex = 20;
    });
    node.zIndex = 50;
    state.dragging.nodeUid = nodeUid;
    state.dragging.offsetX = event.clientX - rect.left;
    state.dragging.offsetY = event.clientY - rect.top;
    state.dragging.startX = node.x;
    state.dragging.startY = node.y;
    scheduleTraceRender();
    event.preventDefault();
  });

  const onPinClick$ = $((event: MouseEvent, nodeUid: string, pinIdx: number) => {
    event.stopPropagation();

    if (state.activePin?.nodeUid === nodeUid && state.activePin.pinIdx === pinIdx) {
      clearActivePin(state);
      appendElectronicsLog(state, 'Route aborted.');
      return;
    }

    if (!state.activePin) {
      state.activePin = { nodeUid, pinIdx };
      appendElectronicsLog(state, `Routing copper from &${nodeUid}[${pinIdx}]...`);
      return;
    }

    connectElectronicsPins(state, state.activePin, { nodeUid, pinIdx });
    scheduleTraceRender();
  });

  const onDeleteNode$ = $((nodeUid: string) => {
    destroyElectronicsNode(state, nodeUid);
    scheduleTraceRender();
  });

  const onDeleteTrace$ = $((traceId: string) => {
    deleteElectronicsTrace(state, traceId);
    scheduleTraceRender();
  });

  return (
    <div class="electronics-view h-full min-h-0 flex flex-col overflow-hidden">
      <ElectronicsToolbar onClearTraces$={onClearTraces$} onClearBoard$={onClearBoard$} />

      <main class="flex-grow min-h-0 flex flex-col md:flex-row overflow-hidden relative">
        <ElectronicsSidebar
          searchQuery={state.searchQuery}
          groups={groupedComponents.value}
          stats={stats.value}
          onSearchChange$={onSearchChange$}
          onInstantiate$={onInstantiate$}
          onOpenLinkedProduct$={onOpenLinkedProduct$}
        />

        <ElectronicsBoard
          boardRef={boardRef}
          nodes={state.nodes}
          traces={state.renderedTraces}
          activePin={state.activePin}
          draggingNodeUid={state.dragging.nodeUid}
          onBoardMouseDown$={onBoardMouseDown$}
          onNodeMouseDown$={onNodeMouseDown$}
          onPinClick$={onPinClick$}
          onDeleteNode$={onDeleteNode$}
          onDeleteTrace$={onDeleteTrace$}
          onOpenLinkedProduct$={onOpenLinkedProduct$}
        />
      </main>

      <ElectronicsTerminal logs={state.logs} onClearLogs$={onClearLogs$} />
    </div>
  );
});
