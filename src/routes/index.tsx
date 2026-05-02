import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { CatalogView } from '../components/catalog-view';

export default component$(() => <CatalogView />);

export const head: DocumentHead = {
  title: 'SHADOW // Shop',
};
