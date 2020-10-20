import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalShowComponent } from './modal-show/modal-show.component';

@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss'],
})
export class ShowPage implements OnInit {
  constructor(public modalController: ModalController) {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalShowComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        src: './assets/img/logo.png',
      },
    });
    return await modal.present();
  }
  ngOnInit() {}

  showPicture() {
    this.presentModal();
  }
}
