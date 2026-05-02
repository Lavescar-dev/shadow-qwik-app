import { component$ } from '@builder.io/qwik';

interface Props {
  compact?: boolean;
}

export const Footer = component$<Props>(({ compact }) => (
  <footer class={['border-t border-term_dim p-6 text-center text-sm text-gray-500', compact ? 'mt-0' : 'mt-16']}>
    <p>System operational. No bloatware detected.</p>
    <p class="mt-2 text-xs">Shadow Architecture © 2026</p>
    <p class="mt-1 text-[10px] opacity-60">
      Product imagery courtesy of{' '}
      <a href="https://commons.wikimedia.org/" target="_blank" rel="noreferrer" class="hover:text-term_accent">
        Wikimedia Commons
      </a>{' '}
      contributors (CC-BY-SA / public domain).
    </p>
  </footer>
));
