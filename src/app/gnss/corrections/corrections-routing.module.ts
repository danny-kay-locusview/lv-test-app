import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CorrectionsPage } from './corrections.page';

const routes: Routes = [
  {
    path: '',
    component: CorrectionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CorrectionsPageRoutingModule {}
