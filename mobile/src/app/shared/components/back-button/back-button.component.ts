import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
})
export class BackButtonComponent implements OnInit {
  private routerEvents: any;
  public previousUrl: string;
  private currentUrl: string;
  public canGoBack: any;

  constructor(private router: Router, private routerOutlet: IonRouterOutlet) {}
  ngOnInit() {
    this.canGoBack = this.routerOutlet.canGoBack();
    this.currentUrl = this.router.url;
    this.routerEvents = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }
}
