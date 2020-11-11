import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from 'src/app/auth/guards/admin-guard.service';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'users',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./users/users.module').then((m) => m.UsersPageModule),
          },
        ],
      },
      {
        path: 'garages',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./garages/garages.module').then(
                (m) => m.GaragesPageModule
              ),
          },
        ],
      },
      {
        path: 'quotes',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./devis/devis.module').then((m) => m.DevisPageModule),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
