import type { ElectronicsComponentDef } from '../lib/electronics-types';
import { productByElectronicsComponentId } from './shared-inventory';

const baseElectronicsComponents = [
  { id: 'mcu_esp32', name: 'ESP32-S3', type: 'MCU', package: 'dip', vcc: 3.3, current: 240, pins: 40, price: 5.50 },
  { id: 'mcu_stm32', name: 'STM32F401', type: 'MCU', package: 'dip', vcc: 3.3, current: 30, pins: 64, price: 3.20 },
  { id: 'mcu_rp2040', name: 'RP2040', type: 'MCU', package: 'dip', vcc: 3.3, current: 25, pins: 30, price: 1.00 },
  { id: 'mcu_mega328', name: 'ATmega328P', type: 'MCU', package: 'dip', vcc: 5.0, current: 15, pins: 28, price: 2.50 },
  { id: 'mcu_tiny85', name: 'ATTiny85', type: 'MCU', package: 'dip', vcc: 5.0, current: 5, pins: 8, price: 1.20 },
  { id: 'ic_74hc595', name: '74HC595', type: 'Logic', package: 'dip', vcc: 5.0, current: 1, pins: 16, price: 0.30 },
  { id: 'ic_ne555', name: 'NE555 Timer', type: 'Logic', package: 'dip', vcc: 5.0, current: 3, pins: 8, price: 0.20 },
  { id: 'ic_l293d', name: 'L293D Driver', type: 'Logic', package: 'dip', vcc: 5.0, current: 600, pins: 16, price: 1.50 },
  { id: 'ic_cd4017', name: 'CD4017 Counter', type: 'Logic', package: 'dip', vcc: 5.0, current: 5, pins: 16, price: 0.45 },
  { id: 'sen_bme280', name: 'BME280 Env', type: 'Sensor', package: 'breakout', vcc: 3.3, current: 1, pins: 6, price: 4.80 },
  { id: 'sen_mpu6050', name: 'MPU-6050 IMU', type: 'Sensor', package: 'breakout', vcc: 3.3, current: 4, pins: 8, price: 2.10 },
  { id: 'sen_dht22', name: 'DHT22', type: 'Sensor', package: 'breakout', vcc: 5.0, current: 2, pins: 3, price: 3.50 },
  { id: 'sen_hc_sr04', name: 'HC-SR04 Sonar', type: 'Sensor', package: 'breakout', vcc: 5.0, current: 15, pins: 4, price: 1.50 },
  { id: 'sen_ina219', name: 'INA219 Power', type: 'Sensor', package: 'breakout', vcc: 3.3, current: 1, pins: 6, price: 2.80 },
  { id: 'sen_vl53l0x', name: 'VL53L0X ToF', type: 'Sensor', package: 'breakout', vcc: 3.3, current: 10, pins: 6, price: 5.90 },
  { id: 'act_stepper', name: 'NEMA 17', type: 'Actuator', package: 'mech', vcc: 12.0, current: 1500, pins: 4, price: 12.50 },
  { id: 'act_servo', name: 'SG90 Servo', type: 'Actuator', package: 'mech', vcc: 5.0, current: 250, pins: 3, price: 2.00 },
  { id: 'act_dc_motor', name: '130 DC Motor', type: 'Actuator', package: 'mech', vcc: 5.0, current: 500, pins: 2, price: 0.80 },
  { id: 'act_relay', name: '5V Relay Mod', type: 'Actuator', package: 'breakout', vcc: 5.0, current: 70, pins: 3, price: 1.50 },
  { id: 'act_solenoid', name: '12V Solenoid', type: 'Actuator', package: 'mech', vcc: 12.0, current: 800, pins: 2, price: 4.50 },
  { id: 'pwr_buck', name: 'LM2596 Buck', type: 'Power', package: 'module', vcc: 24.0, current: 3000, pins: 4, price: 1.80 },
  { id: 'pwr_boost', name: 'MT3608 Boost', type: 'Power', package: 'module', vcc: 5.0, current: 2000, pins: 4, price: 1.20 },
  { id: 'pwr_tp4056', name: 'TP4056 Lipo', type: 'Power', package: 'module', vcc: 5.0, current: 1000, pins: 6, price: 0.90 },
  { id: 'pwr_lipo', name: '18650 Cell', type: 'Power', package: 'module', vcc: 3.7, current: 5000, pins: 2, price: 8.00 },
  { id: 'pwr_ams1117', name: 'AMS1117 3.3V', type: 'Power', package: 'module', vcc: 5.0, current: 800, pins: 3, price: 0.25 },
  { id: 'pas_dip_sw', name: '8x DIP Switch', type: 'Passive', package: 'dip', vcc: 5.0, current: 0, pins: 16, price: 0.50 },
  { id: 'pas_oled', name: '0.96 OLED', type: 'Interface', package: 'breakout', vcc: 3.3, current: 20, pins: 4, price: 3.50 },
  { id: 'pas_lcd1602', name: 'LCD 16x2 I2C', type: 'Interface', package: 'breakout', vcc: 5.0, current: 40, pins: 4, price: 4.20 },
  { id: 'pas_button_m', name: 'Matrix Keypad', type: 'Interface', package: 'breakout', vcc: 5.0, current: 0, pins: 8, price: 1.10 },
] as const;

export const electronicsComponents: readonly ElectronicsComponentDef[] = baseElectronicsComponents.map((component) => ({
  ...component,
  linkedProductId: productByElectronicsComponentId[component.id]?.id,
}));
