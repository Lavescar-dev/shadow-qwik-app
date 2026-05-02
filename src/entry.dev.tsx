// Qwik vite plugin hardcodes this filename in dev mode and imports its default export
// to bootstrap the app. We re-export from entry.client so production and dev share one mount path.
export { default } from './entry.client';
