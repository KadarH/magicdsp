import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevisPageRoutingModule } from './devis-routing.module';

import { DevisPage } from './devis.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DevisPageRoutingModule,
  ],
  declarations: [DevisPage],
})
export class DevisPageModule {}
