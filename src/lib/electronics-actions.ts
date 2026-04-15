import type {
  ElectronicsComponentDef,
  ElectronicsLogEntry,
  ElectronicsLogLevel,
  ElectronicsNode,
  ElectronicsPinRef,
  ElectronicsStats,
  ElectronicsTrace,
  ElectronicsWorkspaceState,
} from './electronics-types';
import { getSafeSpawnCoord, type WorkspaceBounds } from './electronics-geometry';

const getTimestamp = () => new Date().toISOString().split('T')[1]?.slice(0, -1) ?? '00:00:00';

export const createInitialElectronicsState = (): ElectronicsWorkspaceState => ({
  initialized: false,
  searchQuery: '',
  nodes: [],
  traces: [],
  renderedTraces: [],
  logs: [],
  activePin: null,
  nextNodeId: 0,
  nextTraceId: 0,
  nextLogId: 0,
  layoutVersion: 0,
  dragging: {
    nodeUid: null,
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
  },
});

export const appendElectronicsLog = (
  state: ElectronicsWorkspaceState,
  message: string,
  level: ElectronicsLogLevel = 'info',
) => {
  const entry: ElectronicsLogEntry = {
    id: state.nextLogId,
    timestamp: getTimestamp(),
    level,
    message,
  };

  state.logs.push(entry);
  state.nextLogId += 1;
};

export const clearElectronicsLogs = (state: ElectronicsWorkspaceState) => {
  state.logs.splice(0, state.logs.length);
};

export const filterElectronicsComponents = (
  components: readonly ElectronicsComponentDef[],
  searchQuery: string,
) => {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return [...components];

  return components.filter((component) => (
    component.name.toLowerCase().includes(query)
    || component.type.toLowerCase().includes(query)
  ));
};

export const groupElectronicsComponents = (components: readonly ElectronicsComponentDef[]) => {
  const groups = new Map<string, ElectronicsComponentDef[]>();

  components
    .slice()
    .sort((left, right) => left.type.localeCompare(right.type) || left.name.localeCompare(right.name))
    .forEach((component) => {
      const list = groups.get(component.type) ?? [];
      list.push(component);
      groups.set(component.type, list);
    });

  return Array.from(groups.entries()).map(([type, items]) => ({ type, items }));
};

export const instantiateElectronicsNode = (
  state: ElectronicsWorkspaceState,
  component: ElectronicsComponentDef,
  bounds: WorkspaceBounds,
) => {
  const uid = `node_${state.nextNodeId.toString(16).padStart(4, '0')}`;
  state.nextNodeId += 1;

  const coords = getSafeSpawnCoord(state.nodes, bounds);
  const node: ElectronicsNode = {
    ...component,
    uid,
    x: coords.x,
    y: coords.y,
    zIndex: 20,
  };

  state.nodes.push(node);
  state.layoutVersion += 1;
  appendElectronicsLog(state, `Allocated &${uid} (${component.name}) to sector [${coords.x}, ${coords.y}]`);
};

export const destroyElectronicsNode = (state: ElectronicsWorkspaceState, uid: string) => {
  const index = state.nodes.findIndex((node) => node.uid === uid);
  if (index === -1) return;

  state.nodes.splice(index, 1);
  state.traces = state.traces.filter((trace) => trace.from.nodeUid !== uid && trace.to.nodeUid !== uid);
  if (state.activePin?.nodeUid === uid) state.activePin = null;
  state.layoutVersion += 1;
  appendElectronicsLog(state, `&${uid} desoldered.`, 'warn');
};

export const clearElectronicsBoard = (state: ElectronicsWorkspaceState) => {
  state.nodes.splice(0, state.nodes.length);
  state.traces.splice(0, state.traces.length);
  state.renderedTraces.splice(0, state.renderedTraces.length);
  state.activePin = null;
  state.layoutVersion += 1;
  appendElectronicsLog(state, 'Board formatted.', 'err');
};

export const clearElectronicsTraces = (state: ElectronicsWorkspaceState) => {
  state.traces.splice(0, state.traces.length);
  state.renderedTraces.splice(0, state.renderedTraces.length);
  state.activePin = null;
  state.layoutVersion += 1;
  appendElectronicsLog(state, 'All copper routes stripped.', 'warn');
};

export const clearActivePin = (state: ElectronicsWorkspaceState) => {
  state.activePin = null;
};

export const hasTraceBetweenPins = (
  traces: readonly ElectronicsTrace[],
  first: ElectronicsPinRef,
  second: ElectronicsPinRef,
) => traces.some((trace) => (
  (trace.from.nodeUid === first.nodeUid
    && trace.from.pinIdx === first.pinIdx
    && trace.to.nodeUid === second.nodeUid
    && trace.to.pinIdx === second.pinIdx)
  || (trace.from.nodeUid === second.nodeUid
    && trace.from.pinIdx === second.pinIdx
    && trace.to.nodeUid === first.nodeUid
    && trace.to.pinIdx === first.pinIdx)
));

export const connectElectronicsPins = (
  state: ElectronicsWorkspaceState,
  first: ElectronicsPinRef,
  second: ElectronicsPinRef,
) => {
  if (first.nodeUid === second.nodeUid) {
    appendElectronicsLog(state, 'Internal loopback forbidden.', 'err');
    state.activePin = null;
    return;
  }

  if (hasTraceBetweenPins(state.traces, first, second)) {
    appendElectronicsLog(state, 'Trace exists. Multiplexing denied.', 'warn');
    state.activePin = null;
    return;
  }

  const trace: ElectronicsTrace = {
    id: `tr_${state.nextTraceId}`,
    from: first,
    to: second,
  };

  state.nextTraceId += 1;
  state.traces.push(trace);
  state.activePin = null;
  state.layoutVersion += 1;
  appendElectronicsLog(
    state,
    `Trace bonded: &${first.nodeUid}[${first.pinIdx}] -> &${second.nodeUid}[${second.pinIdx}]`,
    'succ',
  );
};

export const deleteElectronicsTrace = (state: ElectronicsWorkspaceState, traceId: string) => {
  state.traces = state.traces.filter((trace) => trace.id !== traceId);
  state.layoutVersion += 1;
  appendElectronicsLog(state, `Trace cut: ${traceId}`, 'warn');
};

export const getElectronicsStats = (state: ElectronicsWorkspaceState): ElectronicsStats => ({
  nodeCount: state.nodes.length,
  totalPower: state.nodes.reduce((sum, node) => sum + node.current, 0),
  traceCount: state.traces.length,
  totalPrice: state.nodes.reduce((sum, node) => sum + node.price, 0),
});
