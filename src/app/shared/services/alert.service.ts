import { Injectable } from '@angular/core';
import { AlertController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private _alertController: AlertController,
  ) { }

  //#region Public Methods

  async info(message: string, title?: string): Promise<void> {
    const alert = await this._alertController.create({
      message: message,
      header: title,
      cssClass: "lv-alert"
    });
    await alert.present();
  }

  //#endregion
}
