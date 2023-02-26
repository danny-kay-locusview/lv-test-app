import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { GnssService } from "../gnss.service";
import { GNSSSettings } from "../gnss.types";
import { Subject, takeUntil } from "rxjs";
import { MeasurementSystem } from "lv-converter";
import { ToastService } from "../../shared/services/toast.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  settings: FormGroup = new FormGroup<any>({
    measurementSystem: new FormControl(),
    trimbleAppId: new FormControl(),
    host: new FormControl(),
    port: new FormControl(),
    username: new FormControl(),
    password: new FormControl(),
    disconnectionThreshold: new FormControl(),
    setGgaSentenceRate: new FormControl(),
  });

  readonly MeasurementSystem = MeasurementSystem;

  private _onDestroy = new Subject();

  constructor(
    private _formBuilder: FormBuilder,
    private _gnssService: GnssService,
    private _toastService: ToastService
  ) { }

  //#region Public Methods

  ionViewWillEnter() {
    this._gnssService.settings$
      .pipe(takeUntil(this._onDestroy))
      .subscribe((settings: GNSSSettings) => {
      this.initialize(settings);
    });
  }

  ionViewWillLeave() {
    this._onDestroy.complete();
  }

  async submit() {
    try {
      this._gnssService.settings = this.settings.value;
      await this._toastService.success("Settings saved");
    } catch (e: any) {
      console.error(e);
      await this._toastService.error(e);
    }
  }

  //#endregion

  //#region Private Methods

  private initialize(settings: GNSSSettings) {
    for (const [key, value] of Object.entries(settings)) {
      const control = this.settings.get(key);
      if (control) {
        control.setValue(value);
      }
    }
  }

  //#endregion
}
