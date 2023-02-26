import { Component } from '@angular/core';
import { GNSSConnectionState, GNSSData, RTKStream } from "gnssplugin";
import { GnssService } from "../gnss.service";
import { toWords } from "../../shared/helpers/string.helper";
import { ToastService } from "../../shared/services/toast.service";
import { Subject, takeUntil } from "rxjs";
import { DatumConstants, DatumHelper } from "lv-datum";

@Component({
  selector: 'app-corrections',
  templateUrl: './corrections.page.html',
  styleUrls: ['./corrections.page.scss'],
})
export class CorrectionsPage {
  selected?: RTKStream | null;
  toggle: boolean = false;
  data?: GNSSData;
  duration?: number | null;

  activeSegment: string = "rtk";

  fromDatum?: DatumConstants | null;
  fromLat?: number | null;
  fromLon?: number | null;
  toDatum?: DatumConstants | null;
  toLat?: number | null;
  toLon?: number | null;

  readonly State = GNSSConnectionState;
  readonly Datums = DatumConstants;
  readonly toWords = toWords;

  private _onDestroy$ = new Subject();

  constructor(
    public gnssService: GnssService,
    private _toastService: ToastService
  ) { }

  //#region Public Methods

  ionViewWillEnter() {
    this.selected = this.gnssService.stream;
    this.gnssService.data$
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((data) => {
        this.data = data;
        this.duration = this.getConnectionDuration();
      });
  }

  ionViewWillLeave() {
    this._onDestroy$.complete();
  }

  optionsFn = async () => {
    return (await this.gnssService.listStreams()).streams;
  }

  optionChanged(value: RTKStream): void {
    this.selected = this.gnssService.stream = value;
  }

  async toggleChanged(value: boolean): Promise<void> {
    try {
      if (value) {
        await this.gnssService.connectStream();
      } else {
        await this.gnssService.disconnectStream();
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

  datumShift(): void {
    if (!this.fromDatum || !this.toDatum || !this.fromLat || !this.fromLon) {
      return;
    }
    const result = DatumHelper.datumShift(this.fromDatum, this.toDatum, this.fromLat, this.fromLon);
    this.toLat = result.latitude;
    this.toLon = result.longitude;
  }

  //#endregion

  private getConnectionDuration(): number | null {
    if (this.gnssService.rtkConnectionTime) {
      return Math.floor(Date.now()) - Math.floor(this.gnssService.rtkConnectionTime);
    }
    return null;
  }

  //#endregion
}
