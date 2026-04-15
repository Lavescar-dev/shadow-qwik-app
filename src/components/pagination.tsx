import { component$, useContext } from '@builder.io/qwik';
import { AppContext } from '../context/app-context';
import { changePage } from '../lib/actions';

interface Props { currentPage: number; totalPages: number; }

export const Pagination = component$<Props>(({ currentPage, totalPages }) => {
  const { app } = useContext(AppContext);
  if (totalPages <= 1) return null;
  return (
    <div class="mt-12 flex justify-center gap-2 font-mono">
      <button type="button" onClick$={() => changePage(app, currentPage - 1, totalPages)} class={['px-3 py-1 border border-term_dim', currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'hover:border-term_accent hover:text-term_accent']} disabled={currentPage === 1}>&lt;</button>
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const activeClass = page === currentPage ? 'bg-term_accent text-term_bg' : 'hover:border-term_accent hover:text-term_accent border border-term_dim';
        return <button key={page} type="button" onClick$={() => changePage(app, page, totalPages)} class={['px-3 py-1', activeClass]}>{page}</button>;
      })}
      <button type="button" onClick$={() => changePage(app, currentPage + 1, totalPages)} class={['px-3 py-1 border border-term_dim', currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'hover:border-term_accent hover:text-term_accent']} disabled={currentPage === totalPages}>&gt;</button>
    </div>
  );
});
