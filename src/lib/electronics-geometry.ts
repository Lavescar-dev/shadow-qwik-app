import type { ElectronicsNode } from './electronics-types';

export interface WorkspaceBounds {
  width: number;
  height: number;
}

export interface PinCenter {
  x: number;
  y: number;
}

export const GRID_SIZE = 20;

export const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

export const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const getSafeSpawnCoord = (nodes: readonly ElectronicsNode[], bounds: WorkspaceBounds) => {
  let x = snapToGrid((bounds.width / 2) - 100 + (Math.random() * 60 - 30));
  let y = snapToGrid((bounds.height / 2) - 50 + (Math.random() * 60 - 30));

  let attempts = 0;
  while (attempts < 15) {
    const collision = nodes.some((node) => (
      Math.abs(node.x - x) < 140 && Math.abs(node.y - y) < 140
    ));

    if (!collision) break;

    x += 40;
    y += 40;
    attempts += 1;
  }

  return { x, y };
};

export const getNodeId = (nodeUid: string) => `node-${nodeUid}`;
export const getPinId = (nodeUid: string, pinIdx: number) => `pin-${nodeUid}-${pinIdx}`;

export const rectsOverlap = (first: DOMRect, second: DOMRect) => (
  first.left < second.right - 2
  && first.right > second.left + 2
  && first.top < second.bottom - 2
  && first.bottom > second.top + 2
);

export const buildTracePath = (from: PinCenter, to: PinCenter) => {
  const dx = Math.abs(to.x - from.x);
  const controlOffset = Math.max(dx * 0.4, 40);
  return `M ${from.x} ${from.y} C ${from.x + controlOffset} ${from.y}, ${to.x - controlOffset} ${to.y}, ${to.x} ${to.y}`;
};
