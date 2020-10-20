import { Component, OnInit } from '@angular/core';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';

import { Subscription } from 'rxjs';
import { OneSignalService } from './shared/one-signal.service';

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
    private menuCtrl: MenuController,
    private oneSignalService: OneSignalService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.oneSignalService.setupPush(
        this.authService.getUser() ? this.authService.getUser().id : null
      );
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
}
