import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LoginPageModule } from './pages/login/login.module';
import { IonicStorageModule } from '@ionic/storage';
import { Router, RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LoginPage } from './pages/login/login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageModule,
    SharedModule,
    RouterModule.forChild(routes),
    IonicStorageModule.forRoot(),
  ],
  declarations: [],
})
export class AuthModule {}
