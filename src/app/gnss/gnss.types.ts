import { MeasurementSystem } from "lv-converter";

export enum FixQuality {
  NoFix,
  ExternalGPS,
  DGPS,
  PPS,
  FixedRTK,
  FloatRTK,
  Estimated,
  Manual,
  Simulation,
}

export interface GNSSSettings {
  measurementSystem: MeasurementSystem;
  trimbleAppId: string;
  host: string;
  port: number;
  username: string;
  password: string;
  disconnectionThreshold: number
  setGgaSentenceRate: number;
}
