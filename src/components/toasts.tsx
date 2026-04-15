import { component$, useContext } from '@builder.io/qwik';
import { AppContext } from '../context/app-context';

export const ToastContainer = component$(() => {
  const { app } = useContext(AppContext);
  return (
    <div class="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      {app.toasts.map((toast) => {
        const colorClass = toast.type === 'error' ? 'border-red-500 text-red-500' : 'border-term_accent text-term_accent';
        return <div key={toast.id} class={['bg-term_bg border-l-2 p-3 text-sm font-mono shadow-lg toast-anim flex items-center gap-2', colorClass]}><span>&gt;</span><span>{toast.message}</span></div>;
      })}
    </div>
  );
});
