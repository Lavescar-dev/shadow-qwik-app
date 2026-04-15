import type { AppStore, ToastType } from '../types';

export const dismissToast = (app: AppStore, id: number) => {
  const index = app.toasts.findIndex((toast) => toast.id === id);
  if (index >= 0) app.toasts.splice(index, 1);
};

export const pushToast = (app: AppStore, message: string, type: ToastType = 'info') => {
  const id = app.nextToastId;
  app.nextToastId += 1;
  app.toasts.push({ id, message, type });
  if (typeof window !== 'undefined') window.setTimeout(() => dismissToast(app, id), 3000);
};
