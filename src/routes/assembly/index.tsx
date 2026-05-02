import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { AssemblyView } from '../../components/assembly/assembly-view';

export default component$(() => <AssemblyView />);

export const head: DocumentHead = {
  title: 'SHADOW // Assembly',
};
