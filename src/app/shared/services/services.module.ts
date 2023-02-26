import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from "./toast.service";
import { BleService } from "./ble.service";
import { AlertService } from "./alert.service";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ToastService,
    BleService,
    AlertService
  ]
})
export class ServicesModule { }
