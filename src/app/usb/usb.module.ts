import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsbPageRoutingModule } from './usb-routing.module';

import { UsbPage } from './usb.page';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsbPageRoutingModule,
    SharedModule
  ],
  declarations: [UsbPage]
})
export class UsbPageModule {}
