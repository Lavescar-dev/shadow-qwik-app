import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { ElectronicsView } from '../../components/electronics/electronics-view';

export default component$(() => <ElectronicsView />);

export const head: DocumentHead = {
  title: 'SHADOW // Electronic',
};
