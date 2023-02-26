import {
  ConnectionStateEvent,
  GNSSConnectionState,
  GNSSData,
  GNSSDevice,
  GNSSDeviceInfo,
  GNSSDeviceManufacturer,
  GNSSDevices,
  GNSSOptions,
  GnssPluginError,
  GnssPluginPlugin,
  RTKOptions,
  RTKSettings,
  RTKStream,
  RTKStreams,
  RTKStreamState
} from "gnssplugin";

const mockDevices: GNSSDevice[] = [
  { name: "Arrow Gold GNSS 19080054", address: "00:00:00:00:00:01", manufacturer: GNSSDeviceManufacturer.Eos },
  { name: "Arrow Gold GNSS 19093900", address: "00:00:00:00:00:A1", manufacturer: GNSSDeviceManufacturer.Eos },
  { name: "Arrow Gold GNSS 19099534", address: "00:00:00:00:00:02", manufacturer: GNSSDeviceManufacturer.Eos },
  { name: "R2, 5951S13503: trimble", address: "00:00:00:00:00:B2", manufacturer: GNSSDeviceManufacturer.Trimble },
  { name: "Trimble DA2, 6142100052", address: "00:00:00:00:00:03", manufacturer: GNSSDeviceManufacturer.Trimble },
];

const mockStreams: RTKStream[] = [
  { mountPoint: "Automatic-Selection", latitude: 0.00, longitude: 0.00, nmeaRequired: true },
  { mountPoint: "Chicago", latitude: 41.88, longitude: -87.64, nmeaRequired: false },
  { mountPoint: "Detroit", latitude: 42.30, longitude: -83.09, nmeaRequired: false },
  { mountPoint: "MA-Milton", latitude: 42.27, longitude: -71.05, nmeaRequired: false },
  { mountPoint: "Mumbai", latitude: 19.11, longitude: 72.86, nmeaRequired: false },
  { mountPoint: "Orland-Park", latitude: 41.62, longitude: -87.82, nmeaRequired: false },
  { mountPoint: "TLV-Trimble", latitude: 32.16, longitude: 34.81, nmeaRequired: false },
];

const mockDeviceInfo: GNSSDeviceInfo = {
  firmwareVersion: "6.0Aa04ay",
  manufacturer: GNSSDeviceManufacturer.Eos,
  serialNumber: "19080054"

}

const mockData: GNSSData = {
  timestamp: Date.now(),
  latitude: 32.1589791843,
  longitude: 34.808916048,
  altitude: 929.685,
  latitudeSd: 0.2756,
  longitudeSd: 0.3937,
  altitudeSd: 0.123,
  fixQuality: 4,
  accuracy: 0.9611,
  satelliteCount: 11,
  satellitesInView: 49,
  satelliteSystems: {},
  dsId: "49",
  correctionAge: 0,
  lastSentToRTK: 0,
  lastReceivedFromRTK: 0,
}

class MockGnssPlugin implements GnssPluginPlugin {
  private device?: GNSSDevice | null;

  fetchGNSSDevices(): Promise<GNSSDevices> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ devices: mockDevices }), 500);
    });
  }

  connectToGNSSDevice(options: GNSSOptions): Promise<GNSSDevice> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const address = options.address;
        const device = mockDevices.find((md) => md.address === address);
        if (device) {
          this.device = device;
          resolve(device);
          this.gnssStateChangesEmitter({ state: GNSSConnectionState.Connected });
        } else {
          reject(GnssPluginError.FailedToConnectToDevice);
        }
      }, 2000);
    });
  }

  fetchGNSSDeviceInfo(): Promise<GNSSDeviceInfo> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDeviceInfo), 2000);
    });
  }

  readDataFromGNSSDevice(): Promise<GNSSData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = {...mockData};
        const factor = 1;

        data.timestamp = Date.now();
        data.latitudeSd = (data.latitudeSd || 32) + (Math.random() * factor / 1000) * (Math.random() < 0.5 ? 1 : -1);
        data.longitudeSd = (data.longitudeSd || 34) + (Math.random() * factor / 1000) * (Math.random() < 0.5 ? 1 : -1);
        data.altitudeSd = (data.altitudeSd || 929) + (Math.random() * factor / 1000) * (Math.random() < 0.5 ? 1 : -1);
        data.latitude += (data.latitudeSd / 1000) * (Math.random() < 0.5 ? 1 : -1);
        data.longitude += (data.longitudeSd / 1000) * (Math.random() < 0.5 ? 1 : -1);
        data.altitude = (data.altitude || 0) + (data.altitudeSd / 1000) * (Math.random() < 0.5 ? 1 : -1);
        data.accuracy = 2 * Math.sqrt((data.latitudeSd ** 2) + (data.longitudeSd ** 2));
        data.satellitesInView = (data.satellitesInView || 49) + (Math.random() > 1 ? 1 : -1);

        resolve(data);
      }, 500);
    });
  }

  rebootGNSSDevice(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 4000);
    });
  }

  disconnectFromGNSSDevice(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
        this.gnssStateChangesEmitter({ state: GNSSConnectionState.NotConnected });
      }, 2000);
    });
  }

  fetchAvailableRTKStreams(settings: RTKSettings): Promise<RTKStreams> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ streams: mockStreams }), 1000);
    });
  }

  connectToRTKStream(options: RTKOptions): Promise<RTKStream> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mountPoint = options.mountPoint;
        const stream = mockStreams.find((ms) => ms.mountPoint === mountPoint);
        if (stream) {
          resolve(stream);
          this.rtkStateChangesEmitter({ state: RTKStreamState.Connected });
        } else {
          reject(GnssPluginError.FailedToConnectToStream);
        }
      }, 2000);
    });
  }

  disconnectFromRTKStream(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
        this.rtkStateChangesEmitter({ state: RTKStreamState.NotConnected });
      }, 2000);
    });
  }

  subscribeToGNSSStateChanges(callback: (state: ConnectionStateEvent) => any): void {
    if (callback) {
      this.gnssStateChangesEmitter = callback;
    } else {
      this.gnssStateChangesEmitter = () => {};
    }
  }

  subscribeToRTKConnectionStateChanges(callback: (state: ConnectionStateEvent) => any): void {
    if (callback) {
      this.rtkStateChangesEmitter = callback;
    } else {
      this.rtkStateChangesEmitter = () => {};
    }
  }

  private gnssStateChangesEmitter(state: ConnectionStateEvent) {}

  private rtkStateChangesEmitter(state: ConnectionStateEvent) {}
}

export const GnssPlugin = new MockGnssPlugin();
