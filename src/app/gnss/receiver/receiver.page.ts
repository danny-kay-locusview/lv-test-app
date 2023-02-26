import { Component } from '@angular/core';
import { GnssService } from "../gnss.service";
import { GNSSConnectionState, GNSSData, GNSSDevice, GNSSDeviceInfo } from "gnssplugin";
import { FixQuality } from "../gnss.types";
import { toWords } from "../../shared/helpers/string.helper";
import { ToastService } from "../../shared/services/toast.service";
import { Subject, takeUntil } from "rxjs";
import { UnitsConverter } from "lv-converter";
import { AlertService } from "../../shared/services/alert.service";

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.page.html',
  styleUrls: ['./receiver.page.scss'],
})
export class ReceiverPage {

  selected?: GNSSDevice | null;
  toggle: boolean = false;
  data?: GNSSData;
  displayAccuracy?: string;

  readonly State = GNSSConnectionState;
  readonly FixQuality = FixQuality;
  readonly toWords = toWords;

  private _onDestroy = new Subject();

  constructor(
    public gnssService: GnssService,
    private _toastService: ToastService,
    private _alertService: AlertService
  ) { }

  //#region Public Methods

  ionViewWillEnter() {
    this.selected = this.gnssService.accessory;
    this.gnssService.data$
      .pipe(takeUntil(this._onDestroy))
      .subscribe((data: GNSSData) => {
      this.data = data;
      this.displayAccuracy = this.getDisplayAccuracy();
    });
  }

  ionViewWillLeave() {
    this._onDestroy.complete();
  }

  optionsFn = async () => {
    return (await this.gnssService.listAccessories()).devices;
  }

  optionChanged(value: GNSSDevice): void {
    this.selected = this.gnssService.accessory = value;
  }

  async toggleChanged(value: boolean): Promise<void> {
    try {
      if (value) {
        await this.gnssService.connectAccessory();
      } else {
        await this.gnssService.disconnectAccessory();
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

  async getAccessoryInfo(): Promise<void> {
    try {
      const info: GNSSDeviceInfo = await this.gnssService.getAccessoryInfo();
      const displayInfo = this.getDisplayInfo(info);
      await this._alertService.info(displayInfo, "Accessory Info");
    } catch (e: any) {
      console.error(e);
      await this._toastService.error(e);
    }
  }

  async rebootAccessory(): Promise<void> {
    try {
      await this.gnssService.rebootAccessory();
      await this._toastService.success("Successfully rebooted");
    } catch (e: any) {
      console.error(e);
      await this._toastService.error(e);
    }
  }

  async getDataSnapshot(): Promise<void> {
    try {
      const data: GNSSData = await this.gnssService.readData();
      const displayInfo = this.getDisplayData(data);
      await this._alertService.info(displayInfo, "Data Snapshot");
    } catch (e: any) {
      console.error(e);
      await this._toastService.error(e);
    }
  }

  //#endregion

  private getDisplayAccuracy(): string {
    const accuracy = this.data?.accuracy;
    if (accuracy) {
      return UnitsConverter.formatInchesForAccuracy(accuracy, 1);
    }
    return "";
  }

  private getDisplayInfo(info: GNSSDeviceInfo): string {
    let displayInfo: string = "<ion-list class='ion-padding-none'>";
    for (const [key, value] of Object.entries(info)) {
      displayInfo += `<ion-item>`;
      displayInfo += `<ion-label>${key}: ${value}</ion-label>`
      displayInfo += `</ion-item>`;
    }
    displayInfo += "</ion-list>";
    return displayInfo;
  }

  private getDisplayData(data: GNSSData): string {
    let displayData: string = "<ion-list class='ion-padding-none'>";
    for (const [key, value] of Object.entries(data).sort(this.sortDataByDisplayOrder)) {
      displayData += `<ion-item>`;
      displayData += `<ion-label>${key}: ${value}</ion-label>`
      displayData += `</ion-item>`;
    }
    displayData += "</ion-list>";
    return displayData;
  }

  private sortDataByDisplayOrder(a: [string, any], b: [string, any]): number {
    const displayOrder: string[] = [
      "timestamp",
      "latitude",
      "longitude",
      "altitude",
      "latitudeSd",
      "longitudeSd",
      "altitudeSd",
      "correctionAge",
      "dsId",
      "fixQuality",
      "accuracy",
      "satellitesInView",
      "satelliteCount"
    ];
    return displayOrder.indexOf(a[0]) > -1 ? displayOrder.indexOf(a[0]) - displayOrder.indexOf(b[0]) : 0;
  }

  //#endregion
}
