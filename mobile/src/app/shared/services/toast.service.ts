import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast: HTMLIonToastElement;
  constructor(private toastController: ToastController) {}
  async presentToast(msg: string) {
    this.toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: 'dark',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        },
      ],
    });
    this.toast.present();
  }
}
