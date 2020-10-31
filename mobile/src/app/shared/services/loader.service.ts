import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  toast: HTMLIonToastElement;
  loading: any;

  constructor(private loadingController: LoadingController) {}
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Veuillez patientez...',
    });
    await this.loading.present();
  }
  dismiss() {
    this.loadingController.dismiss();
  }
}
