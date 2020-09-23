import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LoginPageModule } from './pages/login/login.module';
import { IonicStorageModule } from '@ionic/storage';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageModule,
    SharedModule,
    IonicStorageModule.forRoot(),
  ],
  declarations: [],
})
export class AuthModule {}
