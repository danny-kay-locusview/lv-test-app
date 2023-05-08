import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from "./components/components.module";
import { ServicesModule } from "./services/services.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponentsModule
  ],
  exports: [
    ComponentsModule,
    ServicesModule
  ]
})
export class SharedModule { }
