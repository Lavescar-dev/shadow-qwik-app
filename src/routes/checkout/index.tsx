import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { CheckoutView } from '../../components/checkout-view';

export default component$(() => <CheckoutView />);

export const head: DocumentHead = {
  title: 'SHADOW // Checkout',
};
