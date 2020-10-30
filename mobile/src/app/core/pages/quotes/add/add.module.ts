import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPageRoutingModule } from './add-routing.module';

import { AddPage } from './add.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputErrorPipe } from 'src/app/shared/input-error.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    IonicModule,
    AddPageRoutingModule,
  ],
  declarations: [AddPage, InputErrorPipe],
})
export class AddPageModule {}
