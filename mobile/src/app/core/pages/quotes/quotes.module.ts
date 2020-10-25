import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { ModalShowComponent } from './modal-show/modal-show.component';

const routes: Routes = [
  {
    path: 'add',
    loadChildren: () => import('./add/add.module').then((m) => m.AddPageModule),
  },
  {
    path: 'list',
    loadChildren: () =>
      import('./list/list.module').then((m) => m.ListPageModule),
  },
  {
    path: 'show',
    loadChildren: () =>
      import('./show/show.module').then((m) => m.ShowPageModule),
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ModalShowComponent],
})
export class QuotesModule {}
