export type ElectronicsLogLevel = 'info' | 'warn' | 'err' | 'succ';

export interface ElectronicsComponentDef {
  id: string;
  name: string;
  type: string;
  package: 'dip' | 'breakout' | 'module' | 'mech';
  vcc: number;
  current: number;
  pins: number;
  price: number;
  linkedProductId?: number;
}

export interface ElectronicsNode extends ElectronicsComponentDef {
  uid: string;
  x: number;
  y: number;
  zIndex: number;
}

export interface ElectronicsPinRef {
  nodeUid: string;
  pinIdx: number;
}

export interface ElectronicsTrace {
  id: string;
  from: ElectronicsPinRef;
  to: ElectronicsPinRef;
}

export interface ElectronicsRenderedTrace {
  id: string;
  path: string;
}

export interface ElectronicsLogEntry {
  id: number;
  timestamp: string;
  level: ElectronicsLogLevel;
  message: string;
}

export interface ElectronicsDragState {
  nodeUid: string | null;
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
}

export interface ElectronicsWorkspaceState {
  initialized: boolean;
  searchQuery: string;
  nodes: ElectronicsNode[];
  traces: ElectronicsTrace[];
  renderedTraces: ElectronicsRenderedTrace[];
  logs: ElectronicsLogEntry[];
  activePin: ElectronicsPinRef | null;
  nextNodeId: number;
  nextTraceId: number;
  nextLogId: number;
  layoutVersion: number;
  dragging: ElectronicsDragState;
}

export interface ElectronicsStats {
  nodeCount: number;
  totalPower: number;
  traceCount: number;
  totalPrice: number;
}
