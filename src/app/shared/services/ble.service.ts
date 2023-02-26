import { Injectable, NgZone } from '@angular/core';
import {
  BleClient,
  BleDevice,
  BleService as BleDeviceService,
  numbersToDataView,
  ScanResult,
  textToDataView
} from "@capacitor-community/bluetooth-le";
import { RequestBleDeviceOptions } from "@capacitor-community/bluetooth-le/dist/esm/definitions";
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class BleService {

  private readonly ScanDuration = 2500;

  constructor(
    private _loadingController: LoadingController,
    private _ngZone: NgZone
  ) {
    this.initialize();
  }

  //#region Public Methods

  async scan(duration?: number, serviceUUIDs?: string[]): Promise<BleDevice[]> {
    return new Promise(async(resolve, reject) => {
      const services: string[] = serviceUUIDs || [];
      const options: RequestBleDeviceOptions = { allowDuplicates: false, services: services };
      const devices: BleDevice[] = [];
      const loader = await this._loadingController.create({
        message: "Scanning..."
      });

      try {
        await loader.present();
        await BleClient.requestLEScan(options, (result: ScanResult) => {
          if (result.localName && !result.device?.name) {
            result.device.name = result.localName;
          }
          if (result.device.name) {
            devices.push(result.device);
          }
        });

        setTimeout(async () => {
          await BleClient.stopLEScan();
          await loader.dismiss();
          resolve(devices);
        }, duration || this.ScanDuration);
      } catch (e) {
        await loader.dismiss();
        reject(e);
      }
    });
  }

  async connect(deviceId: string): Promise<void> {
    return BleClient.connect(deviceId, () => {
      console.warn("DISCONNECTED!");
    });
  }

  async disconnect(deviceId: string): Promise<void> {
    return BleClient.disconnect(deviceId);
  }

  async getServices(deviceId: string): Promise<BleDeviceService[]> {
    return BleClient.getServices(deviceId);
  }

  async startNotifications(deviceId: string, serviceUuid: string, characteristicUuid: string, callback: (res: DataView) => any): Promise<void> {
    await BleClient.startNotifications(deviceId, serviceUuid, characteristicUuid, callback);
  }

  async stopNotifications(deviceId: string, serviceUuid: string, characteristicUuid: string): Promise<void> {
    return BleClient.stopNotifications(deviceId, serviceUuid, characteristicUuid);
  }

  async read(deviceId: string, serviceUuid: string, characteristicUuid: string): Promise<DataView> {
    return BleClient.read(deviceId, serviceUuid, characteristicUuid);
  }

  async write(deviceId: string, serviceUuid: string, characteristicUuid: string, data: string): Promise<void> {
    let dataArray: string[] = data?.split(" ");
    let chunkSize = 20;

    for (let index = 0; index < dataArray?.length; index += chunkSize) {
      let chunkedData = dataArray.slice(index, index + chunkSize);
      let dataToWrite: DataView;
      if (!isNaN(parseFloat(chunkedData[0]))) {
        dataToWrite = numbersToDataView(chunkedData.map(parseFloat));
      } else {
        dataToWrite = textToDataView(chunkedData.join(" "));
      }

      await BleClient.write(deviceId, serviceUuid, characteristicUuid, dataToWrite);
    }
  }

  //#endregion

  //#region Private Methods

  private async initialize(): Promise<void> {
    try {
      await BleClient.initialize();
    } catch (e) {
      console.error(e);
    }
  }

  //#endregion
}
