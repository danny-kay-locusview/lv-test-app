import { Component } from '@angular/core';
import { BleCharacteristic, BleDevice, BleService as BleClientService } from "@capacitor-community/bluetooth-le";
import { BleService } from "../shared/services/ble.service";
import { ToastService } from "../shared/services/toast.service";

@Component({
  selector: 'app-ble',
  templateUrl: './ble.page.html',
  styleUrls: ['./ble.page.scss'],
})
export class BlePage {

  selected: BleDevice | null = null;
  toggle: boolean = false;
  service: BleClientService | null = null;
  characteristic: BleCharacteristic | null = null;

  scanDuration: number = 2500;
  services: BleClientService[] = [];
  characteristics: BleCharacteristic[] = [];
  data: string = "2 36 0 0 84 101 106 97 115 104 32 80 97 116 101 108 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -101";

  constructor(
    private _bleService: BleService,
    private _toastService: ToastService
  ) { }

  optionsFn = async () => {
    return this._bleService.scan(this.scanDuration);
  }

  optionChanged(value: BleDevice): void {
    this.selected = value;
  }

  async toggleChanged(value: boolean): Promise<void> {
    try {
      if (value) {
        await this._bleService.connect(this.selected?.deviceId || "");
      } else {
        await this._bleService.disconnect(this.selected?.deviceId || "");
      }
      await this._toastService.success(`Successfully ${value ? "connected" : "disconnected" }`);
    } catch (e: any) {
      console.error(e);
      await this._toastService.error(e);
      if (value) {
        setTimeout(() => {
          this.toggle = !value;
        }, 100);
      }
    }
  }

  async getServices(): Promise<void> {
    try {
      await this._bleService.getServices(this.selected?.deviceId || "");
    } catch (e: any) {
      console.error(e);
      await this._toastService.error(e);
    }
  }

  async startNotifications(): Promise<void> {
    let buffer: Uint8Array[] = [];
    let timeout: NodeJS.Timeout | null = null;

    try {
      await this._bleService.startNotifications(
        this.selected?.deviceId || "",
        this.service?.uuid || "",
        this.characteristic?.uuid || "",
        (res: DataView) => {
          buffer.push(new Uint8Array(res.buffer));

          if (!timeout) {
            timeout = setTimeout(() => {
              const result = buffer.reduce((a: string, b: Uint8Array) => a + b.toString(), "");
              console.log(result);
              timeout = null;
            }, 2500);
          }
        });
    } catch (e: any) {
      console.error(e);
      await this._toastService.error(e);
    }
  }

  async stopNotifications(): Promise<void> {
    try {
      await this._bleService.stopNotifications(
        this.selected?.deviceId || "",
        this.service?.uuid || "",
        this.characteristic?.uuid || "",
      );
    } catch (e: any) {
      console.error(e);
      await this._toastService.error(e);
    }
  }

  async read(): Promise<void> {
    try {
      await this._bleService.read(
        this.selected?.deviceId || "",
        this.service?.uuid || "",
        this.characteristic?.uuid || "",
      );
    } catch (e: any) {
      console.error(e);
      await this._toastService.error(e);
    }
  }

  async write(): Promise<void> {
    try {
      await this._bleService.read(
        this.selected?.deviceId || "",
        this.service?.uuid || "",
        this.characteristic?.uuid || ""
      );
    } catch (e: any) {
      console.error(e);
      await this._toastService.error(e);
    }
  }

  //#endregion

  //#region Private Methods

  //#endregion

}
