import { configMaster } from '../data-layer/data-layer';

export function getTitlefromConfig(key) {
  return configMaster[key];
}
