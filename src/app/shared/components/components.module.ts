import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectCardComponent } from "./select-card/select-card.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "./header/header.component";



@NgModule({
  declarations: [
    SelectCardComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    SelectCardComponent,
    HeaderComponent
  ]
})
export class ComponentsModule { }
