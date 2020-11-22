import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Notification } from '../../models/notification';
import { NotificationsService } from '../quotes/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications$: Observable<Notification[]>;

  gotted = false;
  constructor(
    private notificationsService: NotificationsService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.notifications$ = this.notificationsService.getNotifications().pipe(
      map((res) => {
        this.gotted = true;
        return res.data.notifications;
      })
    );
  }

  readNotification(notification: Notification) {
    this.loaderService.presentLoading();
    this.notificationsService
      .markNotificationsAsRead(notification)
      .pipe(take(1))
      .subscribe((res) => {
        if (res.success) {
          console.log(res.data);
          this.router.navigateByUrl('/quotes/show/' + notification.quote_id, {
            replaceUrl: true,
          });
        } else {
          this.toastService.presentToast(
            "Erreur : La notification n'est pas accessible "
          );
        }
        this.loaderService.dismiss();
      });
  }
}
