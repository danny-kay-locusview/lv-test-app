import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GnssPageRoutingModule } from './gnss-routing.module';

import { GnssPage } from './gnss.page';
import { SharedModule } from "../shared/shared.module";
import { GnssService } from "./gnss.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GnssPageRoutingModule,
        SharedModule
    ],
    declarations: [GnssPage],
    providers: [
      GnssService
    ]
})
export class GnssPageModule {}
