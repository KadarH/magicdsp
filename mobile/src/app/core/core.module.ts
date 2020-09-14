import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HomePageModule } from './pages/home/home.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageModule],
  declarations: [],
})
export class CoreModule {}
