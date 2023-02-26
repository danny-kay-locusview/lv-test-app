import { Injectable } from '@angular/core';
import { ToastController } from "@ionic/angular";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private _toastController: ToastController,
    private _router: Router
  ) { }

  //#region Public Methods

  async error(message: string): Promise<void> {
    const toast = await this._toastController.create({
      message: message,
      duration: 1500,
      position: "bottom",
      color: "danger",
      cssClass: `toast${this._router.url.replace(/\//g, "-")}`
    });
    await toast.present();
  }

  async success(message: string): Promise<void> {
    const toast = await this._toastController.create({
      message: message,
      duration: 1500,
      position: "bottom",
      color: "success",
      cssClass: `toast${this._router.url.replace(/\//g, "-")}`
    });
    await toast.present();
  }

  async info(message: string): Promise<void> {
    const toast = await this._toastController.create({
      message: message,
      duration: 1500,
      position: "bottom",
      color: "light",
      cssClass: `toast${this._router.url.replace(/\//g, "-")}`
    });
    await toast.present();
  }

  //#endregion
}
