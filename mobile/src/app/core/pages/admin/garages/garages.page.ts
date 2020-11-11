import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
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
    private modalController: ModalController,
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.garagesService
      .getGarages()
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res.success) {
            this.garages = res.data.garages;
          } else {
            this.toastService.presentToast('Erreur: opération échouée');
          }
        },
        (err) => {
          this.toastService.presentToast('Erreur: opération échouée');
        }
      );
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

  deleteGarage(garage: any) {
    this.loaderService.presentLoading();
    this.garagesService
      .deleteGarage(garage)
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res.success) {
            this.garages = this.garages.filter((obj) => obj.id !== garage.id);
            this.loaderService.dismiss();
            this.toastService.presentToast(
              'Le devis ' + garage.name + ' a été supprimé.'
            );
          } else {
            this.loaderService.dismiss();
            this.toastService.presentToast('Erreur: opération échouée');
          }
        },
        (err) => {
          this.loaderService.dismiss();
          this.toastService.presentToast('Erreur: opération échouée');
        }
      );
  }
}
