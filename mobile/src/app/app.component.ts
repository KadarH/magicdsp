import {
  Component,
  NgZone,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';

import {
  AlertController,
  IonRouterOutlet,
  MenuController,
  Platform,
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';

import { Subscription } from 'rxjs';
import { OneSignalService } from './shared/one-signal.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from './core/models/user';
import { App } from '@capacitor/core';
import { ToastService } from './shared/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  user: any;
  isAuth: boolean;
  sub: Subscription;
  subscription: Subscription;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

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
      title: 'Gérer les Devis',
      url: '/quotes/list',
      icon: 'list',
    },
    {
      title: 'Notifications',
      url: '/notifications',
      icon: 'notifications',
    },
  ];

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private menuCtrl: MenuController,
    private oneSignalService: OneSignalService,
    private alertController: AlertController,
    private toastService: ToastService,
    private router: Router,
    private location: Location,
    private zone: NgZone
  ) {
    this.initializeApp();
    this.backButtonEvent();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.user = this.authService.getUser();
      this.oneSignalService.setupPush(this.user ? this.user.id : null);
    });
    App.addListener('appUrlOpen', (data: any) => {
      this.zone.run(() => {
        // Example url: https://beerswift.app/tabs/tab2
        // slug = /tabs/tab2
        const slug = data.url.split('.com').pop();
        if (slug) {
          this.router.navigateByUrl(slug);
        }
        // If no match, do nothing - let regular routing
        // logic take over
      });
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

  goToAdmin() {
    this.selectedIndex = this.appPages.length;
    if (!this.user.admin) {
      console.log('zabi');
      this.toastService.presentToast(
        "Vous n'avez pas le droit d'acceder à l'administration"
      );
    } else {
      this.router.navigateByUrl('/admin/users');
    }
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

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
        if (this.router.url !== '/home') {
          // await this.router.navigate(['/']);
          await this.location.back();
        } else if (this.router.url === '/home') {
          if (
            new Date().getTime() - this.lastTimeBackPress >=
            this.timePeriodToExit
          ) {
            this.lastTimeBackPress = new Date().getTime();
            this.presentAlertConfirm();
          } else {
            (navigator as any).app.exitApp();
          }
        }
      });
    });
  }
  presentAlertConfirm() {
    this.alertController
      .create({
        header: 'Confirmation',
        subHeader: '',
        // tslint:disable-next-line: quotemark
        message: "Etês vous sur de vouloir quitter l'application ?",
        buttons: [
          {
            text: 'Oui',
            handler: () => {
              (navigator as any).app.exitApp();
              console.log('Exit');
            },
          },
          {
            text: 'Non',
            handler: () => {
              console.log('Let me think');
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }
  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
}
