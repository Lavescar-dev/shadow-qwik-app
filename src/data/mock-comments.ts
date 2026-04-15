import type { ProductComment } from '../types';

export const mockComments: ProductComment[] = [
  { user: 'root', text: 'Beklentimi karşıladı. Kernel derleme süresi yarı yarıya düştü. Kesinlikle tavsiye.', rate: 5 },
  { user: 'kernel_panic', text: 'Documentation eksik ama kaynak koddan çözülüyor. Klasik RTFM durumu.', rate: 4 },
  { user: 'script_kiddie', text: 'Bunu nasıl kuruyoruz? Çift tıklanacak .exe dosyası çıkmadı içinden.', rate: 1 },
  { user: 'sysadmin_99', text: 'Uptime 400 gün oldu, cihaz hala stabil. Ağda drop yok.', rate: 5 },
  { user: 'null_ptr', text: 'Malzeme kalitesi iyi ama fiyat performans olarak daha iyi alternatifler var.', rate: 3 }
];
