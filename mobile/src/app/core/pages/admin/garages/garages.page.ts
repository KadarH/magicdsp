import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { GaragesService } from '../../quotes/services/garages.service';
import { GarageAddPage } from './garage-add/garage-add.page';

@Component({
  selector: 'app-garages',
  templateUrl: './garages.page.html',
  styleUrls: ['./garages.page.scss'],
})
export class GaragesPage implements OnInit {
  type: string;
  garages: any[];
  mode = 'add';

  constructor(
    private garagesService: GaragesService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.garagesService
      .getGarages()
      .pipe(take(1))
      .subscribe((res) => {
        this.garages = res.data.garages;
        console.log(res);
        console.log(this.garages);
      });
  }

  addNewGarage(mode: string, garageId?: any) {
    this.showPicture(mode, garageId);
  }

  showPicture(mode: string, garageId?: any) {
    this.presentModal(mode, garageId);
  }

  async presentModal(mod: string, id: any) {
    const modal = await this.modalController.create({
      component: GarageAddPage,
      cssClass: 'my-custom-class',
      componentProps: {
        garageId: id,
        mode: mod,
      },
    });
    return await modal.present();
  }
}
