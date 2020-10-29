import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GaragesPage } from './garages.page';

const routes: Routes = [
  {
    path: '',
    component: GaragesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GaragesPageRoutingModule {}
