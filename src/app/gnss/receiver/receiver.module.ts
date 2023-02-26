import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceiverPageRoutingModule } from './receiver-routing.module';

import { ReceiverPage } from './receiver.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReceiverPageRoutingModule,
        SharedModule
    ],
  declarations: [ReceiverPage]
})
export class ReceiverPageModule {}
