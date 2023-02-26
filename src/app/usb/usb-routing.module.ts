import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsbPage } from './usb.page';

const routes: Routes = [
  {
    path: '',
    component: UsbPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsbPageRoutingModule {}
