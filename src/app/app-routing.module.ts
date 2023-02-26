import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'gnss',
    loadChildren: () => import('./gnss/gnss.module').then( m => m.GnssPageModule)
  },
  {
    path: 'ble',
    loadChildren: () => import('./ble/ble.module').then( m => m.BlePageModule)
  },
  {
    path: 'usb',
    loadChildren: () => import('./usb/usb.module').then( m => m.UsbPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
