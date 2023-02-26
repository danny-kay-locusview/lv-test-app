import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlePageRoutingModule } from './ble-routing.module';

import { BlePage } from './ble.page';
import { SharedModule } from "../shared/shared.module";
import { BleService } from "../shared/services/ble.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlePageRoutingModule,
    SharedModule
  ],
  declarations: [BlePage],
  providers: [
    BleService
  ]
})
export class BlePageModule {}
