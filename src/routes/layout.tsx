import { component$, Slot, useContext, useTask$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { CartOverlay } from '../components/cart-overlay';
import { ToastContainer } from '../components/toasts';
import { AppContext } from '../context/app-context';
import type { SectionKey } from '../types';

const pathToSection = (pathname: string): SectionKey => {
  if (pathname.startsWith('/assembly')) return 'assembly';
  if (pathname.startsWith('/electronic')) return 'electronic';
  return 'shop';
};

export default component$(() => {
  const loc = useLocation();
  const { app } = useContext(AppContext);

  useTask$(({ track }) => {
    const pathname = track(() => loc.url.pathname);
    app.ui.activeSection = pathToSection(pathname);
  });

  const isWorkspaceRoute =
    loc.url.pathname.startsWith('/assembly') || loc.url.pathname.startsWith('/electronic');

  return (
    <div
      class={[
        'font-mono antialiased flex flex-col bg-term_bg text-term_fg selection:bg-term_accent selection:text-term_bg',
        isWorkspaceRoute ? 'h-screen overflow-hidden' : 'min-h-screen',
      ]}
    >
      <Header />
      <main
        class={
          isWorkspaceRoute
            ? 'flex-grow min-h-0 w-full overflow-hidden'
            : 'flex-grow max-w-6xl mx-auto w-full p-4 mt-8'
        }
      >
        <Slot />
      </main>
      {!isWorkspaceRoute && <Footer />}
      <CartOverlay />
      <ToastContainer />
    </div>
  );
});
