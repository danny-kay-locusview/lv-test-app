import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GnssPage } from './gnss.page';

const routes: Routes = [
  {
    path: '',
    component: GnssPage,
    children: [
      {
        path: '',
        redirectTo: 'receiver',
        pathMatch: 'full'
      },
      {
        path: 'receiver',
        loadChildren: () => import('./receiver/receiver.module').then( m => m.ReceiverPageModule)
      },
      {
        path: 'corrections',
        loadChildren: () => import('./corrections/corrections.module').then(m => m.CorrectionsPageModule)
      },
      {
        path: 'map',
        loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GnssPageRoutingModule {}
