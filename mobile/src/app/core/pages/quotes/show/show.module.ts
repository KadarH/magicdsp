import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowPageRoutingModule } from './show-routing.module';

import { ShowPage } from './show.page';
import { ModalShowComponent } from './modal-show/modal-show.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ShowPageRoutingModule],
  declarations: [ShowPage, ModalShowComponent],
})
export class ShowPageModule {}
