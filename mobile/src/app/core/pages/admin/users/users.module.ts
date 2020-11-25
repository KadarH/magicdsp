import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './users.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserAddPage } from './user-add/user-add.page';
import { InputErrorPipe } from 'src/app/shared/input-error.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    UsersPageRoutingModule,
  ],
  declarations: [UsersPage, UserAddPage],

})
export class UsersPageModule {}
