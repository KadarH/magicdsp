import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowPage } from './show.page';

const routes: Routes = [
  {
    path: ':id',
    component: ShowPage,
  },
  {
    path: ':id/communications',
    loadChildren: () =>
      import('./communications/communications.module').then(
        (m) => m.CommunicationsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowPageRoutingModule {}
