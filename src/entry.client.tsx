import { render, type RenderOptions } from '@builder.io/qwik';
import Root from './root';

const MOUNTED_FLAG = '__shadow_mounted__';

type Bootable = Window & { [MOUNTED_FLAG]?: boolean };

const mountOnce = (opts?: RenderOptions) => {
  if (typeof window === 'undefined') return;
  const win = window as Bootable;
  if (win[MOUNTED_FLAG]) return;
  win[MOUNTED_FLAG] = true;
  render(document, <Root />, opts);
};

mountOnce();

export default function (opts: RenderOptions) {
  mountOnce(opts);
}
