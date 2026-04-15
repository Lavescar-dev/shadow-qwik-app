import { component$, type PropFunction } from '@builder.io/qwik';
import type { ElectronicsLogEntry } from '../../lib/electronics-types';

interface Props {
  logs: readonly ElectronicsLogEntry[];
  onClearLogs$: PropFunction<() => void>;
}

const levelClasses: Record<ElectronicsLogEntry['level'], string> = {
  info: 'text-gray-400',
  warn: 'text-[#ffcc00]',
  err: 'text-[#ff3366]',
  succ: 'text-[#00ffcc]',
};

const levelPrefix: Record<ElectronicsLogEntry['level'], string> = {
  info: '[INFO]',
  warn: '[WARN]',
  err: '[ERR ]',
  succ: '[ OK ]',
};

export const ElectronicsTerminal = component$<Props>(({ logs, onClearLogs$ }) => (
  <footer class="h-32 border-t border-[#262626] bg-[#000000] flex flex-col shrink-0 z-30 relative shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
    <div class="bg-[#111] border-b border-[#262626] px-4 py-1 flex justify-between items-center">
      <span class="text-[10px] uppercase tracking-widest text-gray-500 font-bold">tty1 // Kernel Output</span>
      <button type="button" onClick$={onClearLogs$} class="text-[10px] hover:text-[#00ffcc] text-gray-600 uppercase">[ flush_logs ]</button>
    </div>
    <div class="flex-grow px-4 py-2 overflow-y-auto font-mono text-[11px] space-y-1">
      {logs.map((entry) => (
        <div key={entry.id}>
          <span class="text-gray-600">[{entry.timestamp}]</span>{' '}
          <span class={levelClasses[entry.level]}>{levelPrefix[entry.level]} {entry.message}</span>
        </div>
      ))}
    </div>
  </footer>
));
