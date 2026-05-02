import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { DetailView } from '../../../components/detail-view';

export default component$(() => <DetailView />);

export const head: DocumentHead = ({ params }) => ({
  title: `SHADOW // Product #${params.id}`,
});
