import { mockComments } from './mock-comments';
import type { AssemblyCategoryId } from '../lib/assembly-types';
import type { Product, SharedInventoryItem } from '../types';

type SharedInventorySeed = Omit<SharedInventoryItem, 'specs' | 'longDesc' | 'comments'>;

const sharedInventorySeed: readonly SharedInventorySeed[] = [
  { id: 1, name: 'ThinkPad X1 Carbon (Gen 12)', desc: 'Arch Linux uyumlu, bare-metal performans. 32GB RAM.', price: 1499.0, tag: 'Laptops', sections: ['shop'] },
  { id: 2, name: 'Raspberry Pi 5 8GB', desc: 'Edge computing ve otomasyon sunucusu. Sogutuculu.', price: 85.0, tag: 'SBC', sections: ['shop'] },
  { id: 3, name: 'ErgoDox EZ', desc: 'Ortholinear split mekanik klavye. QMK firmware ile flashlanabilir.', price: 350.0, tag: 'Peripherals', sections: ['shop'] },
  { id: 4, name: 'YubiKey 5 NFC', desc: 'Donanimsal 2FA anahtari. SSH kimlik dogrulamasi icin zorunlu.', price: 50.0, tag: 'Security', sections: ['shop'] },
  { id: 5, name: 'Hak5 WiFi Pineapple', desc: 'Ag denetimi ve sizma testleri icin taktiksel arac.', price: 119.0, tag: 'Networking', sections: ['shop'] },
  { id: 6, name: 'Dell UltraSharp 27" 4K', desc: "Kusursuz terminal font render'i icin yuksek ppi.", price: 549.0, tag: 'Monitors', sections: ['shop'] },
  { id: 7, name: 'Framework Laptop 13', desc: 'Tamamen moduler, tamir edilebilir. DIY Edition.', price: 1049.0, tag: 'Laptops', sections: ['shop'] },
  { id: 8, name: 'System76 Lemur Pro', desc: 'Coreboot ve Pop!_OS/Ubuntu ile pre-installed. Hafif.', price: 1199.0, tag: 'Laptops', sections: ['shop'] },
  { id: 9, name: 'Orange Pi 5 Plus', desc: "RK3588 cip. Pi 5'e kiyasla daha guclu NPU ve I/O.", price: 140.0, tag: 'SBC', sections: ['shop'] },
  { id: 10, name: 'Arduino Uno R4 Minima', desc: '32-bit ARM Cortex-M4 tabanli klasik form faktor.', price: 20.0, tag: 'SBC', sections: ['shop'] },
  { id: 11, name: 'HHKB Professional Hybrid', desc: "Topre switch'ler, UNIX layout. VIM kullanicilari icin ideal.", price: 280.0, tag: 'Peripherals', sections: ['shop'] },
  { id: 12, name: 'Logitech MX Master 3S', desc: 'Miknatisli scroll ve spesifik workspace atamalari.', price: 99.0, tag: 'Peripherals', sections: ['shop'] },
  { id: 13, name: 'Nitrokey 3A NFC', desc: 'Acik kaynak donanim 2FA, FIDO2 ve GPG destegi.', price: 40.0, tag: 'Security', sections: ['shop'] },
  { id: 14, name: 'Flipper Zero', desc: 'RFID, Sub-1 GHz, IR ve Bluetooth multi-tool hacking cihazi.', price: 169.0, tag: 'Security', sections: ['shop'] },
  { id: 15, name: 'MikroTik hAP ax³', desc: 'RouterOS v7 ile gelen guclu ARM islemcili Wi-Fi 6 router.', price: 139.0, tag: 'Networking', sections: ['shop'] },
  { id: 16, name: 'Ubiquiti UniFi Dream Machine', desc: 'All-in-one gateway, switch ve Wi-Fi 6 AP.', price: 299.0, tag: 'Networking', sections: ['shop'] },
  { id: 17, name: 'LG DualUp 28MQ780', desc: '16:18 en boy orani. Dikey kodlama icin mukemmel.', price: 699.0, tag: 'Monitors', sections: ['shop'] },
  { id: 18, name: 'Samsung 990 PRO 2TB', desc: 'PCIe 4.0 NVMe. Root FS ve swap icin maksimum I/O.', price: 169.0, tag: 'Storage', sections: ['shop', 'assembly'], assemblyCategory: 'storage' },
  { id: 19, name: 'Noctua NH-D15', desc: "Sivi sogutma bloat'ina son. Hava sogutmanin zirvesi.", price: 119.0, tag: 'Cooling', sections: ['shop', 'assembly'], assemblyCategory: 'cooling' },
  { id: 20, name: 'Corsair RM850x', desc: '850W Gold, tam moduler guc kaynagi. Stabil voltaj.', price: 130.0, tag: 'PSU', sections: ['shop', 'assembly'], assemblyCategory: 'psu' },
  { id: 21, name: 'Fractal North', desc: 'Workstation kasasi.', price: 139.0, tag: 'Chassis', sections: ['shop', 'assembly'], assemblyCategory: 'chassis' },
  { id: 22, name: 'Sliger 4U', desc: '19-inch kabin.', price: 299.0, tag: 'Chassis', sections: ['shop', 'assembly'], assemblyCategory: 'chassis' },
  { id: 23, name: 'Arctic P12 PST', desc: 'F/P statik basinc.', price: 35.0, tag: 'Case Fans', sections: ['shop', 'assembly'], assemblyCategory: 'case_fans' },
  { id: 24, name: 'Delta 4000RPM', desc: 'Server grade fan.', price: 45.0, tag: 'Case Fans', sections: ['shop', 'assembly'], assemblyCategory: 'case_fans' },
  { id: 25, name: 'Supermicro 1200W', desc: '1+1 yedekli.', price: 450.0, tag: 'PSU', sections: ['shop', 'assembly'], assemblyCategory: 'psu' },
  { id: 26, name: 'ASUS ProArt X670E', desc: 'Stabil VRM.', price: 479.0, tag: 'Motherboards', sections: ['shop', 'assembly'], assemblyCategory: 'mobo' },
  { id: 27, name: 'ASUS WRX80E', desc: 'Multi-GPU cluster.', price: 999.0, tag: 'Motherboards', sections: ['shop', 'assembly'], assemblyCategory: 'mobo' },
  { id: 28, name: 'AMD Ryzen 9 7950X', desc: '16 Core Compute.', price: 599.0, tag: 'CPU', sections: ['shop', 'assembly'], assemblyCategory: 'cpu' },
  { id: 29, name: 'Threadripper 7995WX', desc: '96 Core Workstation.', price: 9999.0, tag: 'CPU', sections: ['shop', 'assembly'], assemblyCategory: 'cpu' },
  { id: 30, name: '32GB DDR5 6000MHz', desc: 'Dusuk CL.', price: 119.0, tag: 'Memory', sections: ['shop', 'assembly'], assemblyCategory: 'ram' },
  { id: 31, name: '256GB DDR5 RDIMM', desc: 'In-memory cache.', price: 1250.0, tag: 'Memory', sections: ['shop', 'assembly'], assemblyCategory: 'ram' },
  { id: 32, name: '1.6TB Optane U.2', desc: 'Sifir latency ZIL.', price: 2499.0, tag: 'Storage', sections: ['shop', 'assembly'], assemblyCategory: 'storage' },
  { id: 33, name: 'NVIDIA RTX 4090', desc: 'Local LLM.', price: 1599.0, tag: 'GPU', sections: ['shop', 'assembly'], assemblyCategory: 'gpu' },
  { id: 34, name: 'RTX 6000 Ada', desc: 'VRAM canavari.', price: 6799.0, tag: 'GPU', sections: ['shop', 'assembly'], assemblyCategory: 'gpu' },
  { id: 35, name: 'Arctic LF3 360', desc: '300W+ TDP.', price: 139.0, tag: 'Cooling', sections: ['shop', 'assembly'], assemblyCategory: 'cooling' },
  { id: 36, name: 'ESP32-S3 DevKitC-1', desc: 'Wi-Fi/BT destekli modern MCU karti.', price: 8.9, tag: 'Components', sections: ['shop', 'electronic'], electronicsComponentIds: ['mcu_esp32'] },
  { id: 37, name: 'LM2596 Buck Module', desc: '24V -> 5V/3.3V step-down guc modulu.', price: 2.4, tag: 'Components', sections: ['shop', 'electronic'], electronicsComponentIds: ['pwr_buck'] },
  { id: 38, name: 'SG90 Micro Servo', desc: 'Hafif projeler icin kompakt servo motor.', price: 3.2, tag: 'Components', sections: ['shop', 'electronic'], electronicsComponentIds: ['act_servo'] },
] as const;

const defaultSpecs = {
  Mimari: 'Bare-metal Optimize',
  'I/O': 'Maksimum Verimlilik',
  Uyumluluk: 'Arch/Debian/RHEL Onayli',
  Garanti: 'Sadece donanim hatalarina karsi (Kullanici hatasi = Skill issue)',
} as const;

const pickComments = (productId: number) => {
  const count = (productId % 3) + 1;
  return Array.from({ length: count }, (_, index) => mockComments[(productId + index) % mockComments.length]);
};

export const sharedInventory: readonly SharedInventoryItem[] = sharedInventorySeed.map((item) => ({
  ...item,
  specs: { ...defaultSpecs },
  longDesc: `${item.name} birimi, gereksiz bloatware'den arindirilmis, dogrudan sistem muhendisleri ve power-user'lar icin tasarlanmistir. Yuksek I/O kapasitesi ve dusuk gecikme degerleri ile mission-critical ortamlarda guvenle deploy edilebilir. Cihazin state'i tamamen kullanici kontrolundedir.`,
  comments: pickComments(item.id),
}));

export const products: readonly Product[] = sharedInventory.filter((item) => item.sections.includes('shop'));

export const productsById = Object.fromEntries(
  products.map((product) => [product.id, product]),
) as Record<number, Product>;

const createAssemblyProductIndex = (): Record<AssemblyCategoryId, Product[]> => ({
  chassis: [],
  case_fans: [],
  psu: [],
  mobo: [],
  cpu: [],
  ram: [],
  storage: [],
  gpu: [],
  cooling: [],
});

export const assemblyProductsByCategory = sharedInventory.reduce((index, item) => {
  if (item.assemblyCategory) index[item.assemblyCategory].push(item);
  return index;
}, createAssemblyProductIndex()) as Record<AssemblyCategoryId, readonly Product[]>;

export const productByElectronicsComponentId = Object.fromEntries(
  sharedInventory.flatMap((item) => (
    item.electronicsComponentIds?.map((componentId) => [componentId, item] as const) ?? []
  )),
) as Record<string, Product>;

export const inventory = {
  items: sharedInventory,
  productsById,
  assemblyProductsByCategory,
  productByElectronicsComponentId,
} as const;
