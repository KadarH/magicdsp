import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { ListLoadingComponent } from 'src/app/shared/components/list-loading/list-loading.component';

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule, HttpClientModule],
  exports: [BackButtonComponent, ListLoadingComponent],
  declarations: [BackButtonComponent, ListLoadingComponent],
})
export class SharedModule {}
