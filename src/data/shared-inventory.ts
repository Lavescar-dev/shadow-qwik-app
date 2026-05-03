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

// Wikimedia Commons hotlinks. Where exact-model photos do not exist on Commons,
// a same-brand or same-category representative is used (acceptable for demo display).
const productImages: Record<number, string> = {
  1: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/ThinkPad_X1_Carbon_gen7_%280%29.jpg/960px-ThinkPad_X1_Carbon_gen7_%280%29.jpg',
  2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Raspberry_Pi_5.jpg/960px-Raspberry_Pi_5.jpg',
  3: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Ergodox_%2815322160951%29.jpg/960px-Ergodox_%2815322160951%29.jpg',
  4: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/YubiKey_5_NFC.png',
  6: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Dell_U3415W_%281%29.jpg/960px-Dell_U3415W_%281%29.jpg',
  7: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Framework_laptop_sway_community_forum_small.png/960px-Framework_laptop_sway_community_forum_small.png',
  8: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/System76_product_lemp13.webp/960px-System76_product_lemp13.webp.png',
  9: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Orange_Pi_Plus_%2817626347582%29.png/960px-Orange_Pi_Plus_%2817626347582%29.png',
  10: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg',
  11: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Happy_Hacking_Keyboard_Professional_2.jpg/960px-Happy_Hacking_Keyboard_Professional_2.jpg',
  12: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/2017_Mysz_komputerowa_Logitech_MX_Master.jpg/960px-2017_Mysz_komputerowa_Logitech_MX_Master.jpg',
  14: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Flipper_Zero.jpg/960px-Flipper_Zero.jpg',
  15: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/MikroTik_hAP_ac2.jpg/960px-MikroTik_hAP_ac2.jpg',
  16: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Ubiquiti_UniFi_Cloud_Gateway_Fiber.jpg/960px-Ubiquiti_UniFi_Cloud_Gateway_Fiber.jpg',
  18: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Samsung_980_PRO_PCIe_4.0_NVMe_SSD_1TB-top_PNr%C2%B00915.jpg/960px-Samsung_980_PRO_PCIe_4.0_NVMe_SSD_1TB-top_PNr%C2%B00915.jpg',
  19: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/NH-D15_with_classic_fans.jpg/960px-NH-D15_with_classic_fans.jpg',
  22: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/FSC_Primergy_TX200_0005.JPG/960px-FSC_Primergy_TX200_0005.JPG',
  23: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Arctic_P12_Pro_A-RGB.jpg/960px-Arctic_P12_Pro_A-RGB.jpg',
  24: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Delta_Electronics_FFB0812SHE.png/960px-Delta_Electronics_FFB0812SHE.png',
  28: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/AMD_Ryzen_9_9950X.jpg/960px-AMD_Ryzen_9_9950X.jpg',
  29: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Threadripper_7970X_in_the_Box_20240402_HOF1248_000225.png/960px-Threadripper_7970X_in_the_Box_20240402_HOF1248_000225.png',
  30: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/DDR5_SDRAM_IMGP6304_smial_wp.jpg/960px-DDR5_SDRAM_IMGP6304_smial_wp.jpg',
  31: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/DIMMs.jpg',
  32: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Intel_optane_P4800x.jpg/960px-Intel_optane_P4800x.jpg',
  33: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/NVIDIA_RTX_4090_Founders_Edition_-_Nahaufnahme_%28ZMASLO%29.png/960px-NVIDIA_RTX_4090_Founders_Edition_-_Nahaufnahme_%28ZMASLO%29.png',
  36: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/ESP32-S3_on_paper.jpg/960px-ESP32-S3_on_paper.jpg',
  37: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/DC_to_DC_Power_Module_%2850837516042%29.jpg/960px-DC_to_DC_Power_Module_%2850837516042%29.jpg',
  38: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Tower_Pro_SG90_micro_servo_motor.jpg/960px-Tower_Pro_SG90_micro_servo_motor.jpg',
  // Same-brand or same-category fallbacks (Commons has no exact-model photo for these):
  5: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/GL-iNet_Travel_Router_and_Wyze_Camera_-_Hotel_Room_Security.jpg/960px-GL-iNet_Travel_Router_and_Wyze_Camera_-_Hotel_Room_Security.jpg',
  13: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Google_Titan_Security_Key_-_Two_Factor_Authentication_%2847400104011%29.jpg/960px-Google_Titan_Security_Key_-_Two_Factor_Authentication_%2847400104011%29.jpg',
  17: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/LG_UltraWide_monitors.jpg/960px-LG_UltraWide_monitors.jpg',
  20: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Corsair_CX430.JPG/960px-Corsair_CX430.JPG',
  21: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Fractal_Design_Focus_G.jpg/960px-Fractal_Design_Focus_G.jpg',
  25: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png/960px-Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png',
  26: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_P%C5%82yta_g%C5%82%C3%B3wna_Asus_ROG_STRIX_Z690-A_GAMING_WIFI.jpg/960px-2023_P%C5%82yta_g%C5%82%C3%B3wna_Asus_ROG_STRIX_Z690-A_GAMING_WIFI.jpg',
  27: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/ASRock_TRX50_WS_20240406_HOF1812-HDR_RAW-Export_000182.png/960px-ASRock_TRX50_WS_20240406_HOF1812-HDR_RAW-Export_000182.png',
  34: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/PNY_Nvidia_Quadro_P1000.jpg/960px-PNY_Nvidia_Quadro_P1000.jpg',
  35: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Corsair_H100i_240mm_CPU_cooler._On_MSI_Z590_Torpedo_motherboard._%2851987363353%29.jpg/960px-Corsair_H100i_240mm_CPU_cooler._On_MSI_Z590_Torpedo_motherboard._%2851987363353%29.jpg',
};

const pickComments = (productId: number) => {
  const count = (productId % 3) + 1;
  return Array.from({ length: count }, (_, index) => mockComments[(productId + index) % mockComments.length]);
};

export const sharedInventory: readonly SharedInventoryItem[] = sharedInventorySeed.map((item) => ({
  ...item,
  specs: { ...defaultSpecs },
  longDesc: `${item.name} birimi, gereksiz bloatware'den arindirilmis, dogrudan sistem muhendisleri ve power-user'lar icin tasarlanmistir. Yuksek I/O kapasitesi ve dusuk gecikme degerleri ile mission-critical ortamlarda guvenle deploy edilebilir. Cihazin state'i tamamen kullanici kontrolundedir.`,
  comments: pickComments(item.id),
  image: productImages[item.id],
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
