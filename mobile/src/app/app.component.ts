import { Component, OnInit } from '@angular/core';

import {
  AlertController,
  MenuController,
  NavController,
  Platform,
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isAuth: boolean;
  sub: Subscription;

  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Acceuil',
      url: '/home',
      icon: 'home',
    },
    {
      title: 'Ajouter un devis',
      url: '/quotes/add',
      icon: 'add',
    },
    {
      title: 'Tous les Devis',
      url: '/quotes/list',
      icon: 'list',
    },
    {
      title: 'Notifications',
      url: '/notifications',
      icon: 'notifications',
    },
    {
      title: 'Administration',
      url: '/admin',
      icon: 'settings',
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController,
    private oneSignal: OneSignal,
    private alertCtrl: AlertController,
    private navController: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.setupPush();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('home/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
    this.isAuthenticated();
  }

  isAuthenticated() {
    this.authService.isLoggedIn().subscribe((data) => {
      this.isAuth = !!data;
    });
  }

  logout() {
    this.authService.logout();
    this.menuCtrl.enable(false, 'menu');
    document.location.href = 'index.html';
  }

  setupPush() {
    // I recommend to put these into your environment.ts
    this.oneSignal.startInit(
      'b5004127-4151-444a-9401-2e7030cf5f6f',
      '624794357236'
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.None
    );

    // Notifcation was received in general
    this.oneSignal
      .handleNotificationReceived()
      .pipe(take(1))
      .subscribe((data) => {
        const msg = data.payload.body;
        const title = data.payload.title;
        const additionalData = data.payload.additionalData;
        this.showAlert(title, msg, additionalData.task);
      });

    // Notification was really clicked/opened
    this.oneSignal
      .handleNotificationOpened()
      .pipe(take(1))
      .subscribe((data) => {
        // Just a note that the data is a different place here!
        const additionalData = data.notification.payload.additionalData;

        this.showAlert(
          'Notification opened',
          'You already read this before',
          additionalData.task
        );
      });
    this.oneSignal
      .addSubscriptionObserver()
      .pipe(take(1))
      .subscribe((state) => {
        if (state) {
          this.oneSignal.sendTag('user_id', '10');
          this.showAlert(
            'Notification opened',
            'You already read this before',
            'additionalData.task'
          );
        }
      });
    this.oneSignal.endInit();
    this.oneSignal.sendTag('user_id', '28');
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
