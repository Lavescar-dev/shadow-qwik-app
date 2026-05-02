import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { AppContext } from '../context/app-context';

const MAX_VISIBLE_TOASTS = 3;

export const ToastContainer = component$(() => {
  const { app } = useContext(AppContext);
  const visibleToasts = useComputed$(() => app.toasts.slice(-MAX_VISIBLE_TOASTS));
  const hiddenCount = useComputed$(() => Math.max(0, app.toasts.length - MAX_VISIBLE_TOASTS));

  return (
    <div class="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none max-w-[calc(100vw-2rem)] sm:max-w-sm">
      {hiddenCount.value > 0 && (
        <div class="self-end bg-term_bg/90 border border-term_dim text-gray-500 text-[10px] font-mono px-2 py-1 tracking-widest">
          +{hiddenCount.value} STACKED
        </div>
      )}
      {visibleToasts.value.map((toast) => {
        const colorClass = toast.type === 'error' ? 'border-red-500 text-red-500' : 'border-term_accent text-term_accent';
        return (
          <div
            key={toast.id}
            class={['bg-term_bg/95 border-l-2 p-3 text-sm font-mono shadow-lg toast-anim flex items-start gap-2', colorClass]}
          >
            <span class="shrink-0">&gt;</span>
            <span class="break-words">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
});
