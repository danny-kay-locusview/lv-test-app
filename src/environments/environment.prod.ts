import { UnitsConverter } from "lv-converter";

export const environment = {
  production: true,
  gnssSettings: {
    measurementSystem: UnitsConverter.measurementSystem,
    trimbleAppId: "8ee8f5be-3442-40da-848e-b820c9448daf",
    host: "lvs.lvsrtk.com",
    port: 10000,
    username: "corrections",
    password: "corrections",
    disconnectionThreshold: 5,
    setGgaSentenceRate: 60,
  }
};
