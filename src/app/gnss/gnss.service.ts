import { Injectable, NgZone } from '@angular/core';
import {
  ConnectionStateEvent,
  GNSSConnectionState,
  GNSSData,
  GNSSDevice,
  GNSSDevices,
  RTKStream,
  RTKStreams,
  RTKStreamState,
  GnssPlugin,
  GNSSDeviceInfo
} from "gnssplugin";
import { Preferences } from "@capacitor/preferences";
import { GNSSSettings } from "./gnss.types";
import { environment } from "../../environments/environment";
import { BehaviorSubject } from "rxjs";
import { Platform } from "@ionic/angular";
// import { GnssPlugin } from "./gnss.mock"
import { UnitsConverter } from "lv-converter";

@Injectable({
  providedIn: 'root'
})
export class GnssService {

  gnssState = GNSSConnectionState.NotConnected;
  rtkState = RTKStreamState.NotConnected;

  rtkConnectionTime?: number;

  data$ = new BehaviorSubject<GNSSData>({} as GNSSData);
  settings$ = new BehaviorSubject<GNSSSettings>({} as GNSSSettings);

  private _accessory: GNSSDevice | undefined;
  private _stream: RTKStream | undefined;
  private _readInterval: NodeJS.Timeout | undefined;

  get accessory(): GNSSDevice | undefined {
    return this._accessory;
  }

  set accessory(value: GNSSDevice | undefined) {
    this._accessory = value;
    this._ngZone.run(async () => {
      if (value) {
        await Preferences.set({ key: "gnss_accessory", value: JSON.stringify(value) })
      } else {
        await Preferences.remove({ key: "gnss_accessory" })
      }
    });
  }

  get stream(): RTKStream | undefined {
    return this._stream;
  }

  set stream(value: RTKStream | undefined) {
    this._stream = value;
    this._ngZone.run(async () => {
      if (value) {
        await Preferences.set({ key: "gnss_stream", value: JSON.stringify(value) })
      } else {
        await Preferences.remove({ key: "gnss_stream" })
      }
    });
  }

  get settings(): GNSSSettings {
    return this.settings$.value;
  }

  set settings(value: GNSSSettings) {
    this.settings$.next(value);
    this._ngZone.run(async () => {
      if (value) {
        await Preferences.set({ key: "gnss_settings", value: JSON.stringify(value) })
      } else {
        await Preferences.remove({ key: "gnss_settings" })
      }
    });
  }

  constructor(
    private _ngZone: NgZone,
    private _platform: Platform
  ) {
    this.initialize();
  }

  //#region Public Methods

  listAccessories(): Promise<GNSSDevices> {
    return GnssPlugin.fetchGNSSDevices();
  }

  connectAccessory(): Promise<GNSSDevice> {
    this.handleGNSSStateChange(GNSSConnectionState.Connecting);

    return GnssPlugin.connectToGNSSDevice({
      address: this._accessory?.address || "",
      trimbleAppId: this.settings$.value.trimbleAppId
    }).then((res) => {
      this.handleGNSSStateChange(GNSSConnectionState.Connected);

      GnssPlugin.subscribeToGNSSStateChanges((event: ConnectionStateEvent) => {
        this.handleGNSSStateChange(event?.state as GNSSConnectionState);
      });

      GnssPlugin.subscribeToRTKConnectionStateChanges((event: ConnectionStateEvent) => {
        this.handleRTKStateChange(event?.state as RTKStreamState);
      });

      this.handleGNSSStateChange(GNSSConnectionState.Connected);

      return res;
    }).catch((error) => {
      this.handleGNSSStateChange(GNSSConnectionState.NotConnected);
      throw error;
    })
  }

  disconnectAccessory(): Promise<void> {
    return GnssPlugin.disconnectFromGNSSDevice();
  }

  getAccessoryInfo(): Promise<GNSSDeviceInfo> {
    return GnssPlugin.fetchGNSSDeviceInfo();
  }

  readData(): Promise<GNSSData> {
    return GnssPlugin.readDataFromGNSSDevice();
  }

  rebootAccessory(): Promise<void> {
    return GnssPlugin.rebootGNSSDevice();
  }

  listStreams(): Promise<RTKStreams> {
    return GnssPlugin.fetchAvailableRTKStreams({
      host: this.settings.host,
      port: +this.settings.port,
      username: this.settings.username,
      password: this.settings.password
    });
  }

  connectStream(): Promise<RTKStream> {
    return GnssPlugin.connectToRTKStream({
      host: this.settings.host,
      port: +this.settings.port,
      username: this.settings.username,
      password: this.settings.password,
      mountPoint: this._stream?.mountPoint || "",
      disconnectionThreshold: +this.settings.disconnectionThreshold,
      setGgaSentenceRate: +this.settings.setGgaSentenceRate,
    });
  }

  disconnectStream(): Promise<void> {
    return GnssPlugin.disconnectFromRTKStream();
  }

  //#endregion

  //#region Private Methods

  private async initialize(): Promise<void> {
    try {
      const [
        accessory,
        stream,
        settings,
      ] = await Promise.all([
        Preferences.get({ key: "gnss_accessory" }),
        Preferences.get({ key: "gnss_stream" }),
        Preferences.get({ key: "gnss_settings" })
      ]);

      if (accessory?.value) {
        this._accessory = JSON.parse(accessory.value);
      }

      if (stream?.value) {
        this._stream = JSON.parse(stream.value);
      }

      let allSettings: GNSSSettings = environment.gnssSettings;
      if (settings?.value) {
        allSettings = {
          ...allSettings,
          ...JSON.parse(settings.value),
        };
      }
      this.settings$.next(allSettings);

      this.settings$.subscribe((settings) => {
        UnitsConverter.measurementSystem = settings.measurementSystem;
      });
    } catch (e) {
      console.error(e);
    }
  }

  private handleGNSSStateChange(state: GNSSConnectionState): void {
    this.gnssState = state;
    switch (state) {
      case GNSSConnectionState.Connected:
        this.startReading();
        break;
      case GNSSConnectionState.NotConnected:
        this.stopReading();
        break;
    }
  }

  private handleRTKStateChange(state: RTKStreamState): void {
    this.rtkState = state;
    switch (state) {
      case RTKStreamState.Connected:
        this.rtkConnectionTime = Date.now();
        break;
      case RTKStreamState.NotConnected:
        this.rtkConnectionTime = undefined;
        break;
    }
  }

  private startReading(): void {
    this._ngZone.runTask(() => {
      this.stopReading();
      this._readInterval = setInterval(async () => {
        try {
          const data = await this.readData();
          if (this._readInterval) {
            this.data$.next(data);
          }
        } catch (e: any) {
          console.error(e);
        }
      }, 1000);
    })
  }

  private stopReading(): void {
    this._ngZone.runTask(() => {
      if (this._readInterval) {
        clearInterval(this._readInterval);
        this._readInterval = undefined;
        this.data$.next({} as GNSSData);
      }
    });
  }

  //#endregion
}
