import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
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
      title: 'Devis en attentes',
      url: '/quotes/list/waiting',
      icon: 'list-circle',
    },
    {
      title: 'Devis acceptés',
      url: '/quotes/list/accepted',
      icon: 'checkmark-done-circle',
    },
    {
      title: 'Devis refusés',
      url: '/quotes/list/refused',
      icon: 'close-circle',
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
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('home/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
  }
}
