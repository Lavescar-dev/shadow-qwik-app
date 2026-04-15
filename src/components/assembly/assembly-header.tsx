import { component$ } from '@builder.io/qwik';

interface Props {
  uptimeLabel: string;
}

export const AssemblyHeader = component$<Props>(({ uptimeLabel }) => (
  <header class="relative z-10 flex-shrink-0 border-l-4 border-term_accent pl-4 flex justify-between items-end">
    <div>
      <h1 class="text-3xl font-bold uppercase tracking-tighter break-words">
        Build.sh <span class="text-gray-600 text-lg sm:text-xl">// TMUX Pipeline Layout</span>
      </h1>
    </div>
    <div class="hidden md:block text-right">
      <div class="text-[10px] text-gray-500 tracking-widest uppercase">Kernel Uptime</div>
      <div class="text-term_accent font-bold">{uptimeLabel}</div>
    </div>
  </header>
));
