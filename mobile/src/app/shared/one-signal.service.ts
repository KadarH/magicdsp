import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AlertController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OneSignalService {
  constructor(
    private oneSignal: OneSignal,
    private alertCtrl: AlertController
  ) {}
  setupPush(id?: number) {
    // I recommend to put these into your environment.ts
    this.oneSignal.startInit(
      'b5004127-4151-444a-9401-2e7030cf5f6f',
      '624794357236'
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.None
    );

    // Notifcation was received in general
    this.oneSignal.handleNotificationReceived().subscribe((data) => {
      const msg = data.payload.body;
      const title = data.payload.title;
      const additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });

    // Notification was really clicked/opened
    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      // Just a note that the data is a different place here!
      const additionalData = data.notification.payload.additionalData;

      this.showAlert(
        'Notification opened',
        'You already read this before',
        additionalData.task
      );
    });
    this.oneSignal.addSubscriptionObserver().subscribe((state) => {
      if (state) {
        this.oneSignal.sendTag('user_id', id ? id + '' : '0');
        this.showAlert(
          'Notification opened',
          'You already read this before',
          'additionalData.task'
        );
      }
    });
    this.oneSignal.endInit();
    this.oneSignal.sendTag('user_id', id ? id + '' : '0');
  }

  async showAlert(title, msg, task) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Action: ${task}`,
          handler: () => {
            // E.g: Navigate to a specific screen
          },
        },
      ],
    });
    alert.present();
  }
}
