import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CorrectionsPageRoutingModule } from './corrections-routing.module';

import { CorrectionsPage } from './corrections.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CorrectionsPageRoutingModule,
        SharedModule
    ],
  declarations: [CorrectionsPage]
})
export class CorrectionsPageModule {}
