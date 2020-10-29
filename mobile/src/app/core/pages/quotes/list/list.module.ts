import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPageRoutingModule } from './list-routing.module';

import { ListPage } from './list.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListLoadingComponent } from 'src/app/shared/components/list-loading/list-loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule,
    SharedModule
  ],
  declarations: [ListPage, ListLoadingComponent]
})
export class ListPageModule {}
