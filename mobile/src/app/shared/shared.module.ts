import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BackButtonComponent } from './components/back-button/back-button.component';

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule, HttpClientModule],
  exports: [BackButtonComponent],
  declarations: [BackButtonComponent],
})
export class SharedModule {}
