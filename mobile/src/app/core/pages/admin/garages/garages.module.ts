import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GaragesPageRoutingModule } from './garages-routing.module';

import { GaragesPage } from './garages.page';
import { GarageAddPage } from './garage-add/garage-add.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListLoadingComponent } from 'src/app/shared/components/list-loading/list-loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GaragesPageRoutingModule,
    SharedModule,
  ],
  declarations: [GaragesPage, GarageAddPage, ListLoadingComponent],
})
export class GaragesPageModule {}
