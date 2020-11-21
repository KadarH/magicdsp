import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { User } from 'src/app/core/models/user';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from '../../quotes/services/user.service';
import { UserAddPage } from './user-add/user-add.page';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  status = '1';
  users: any[];
  usersBackup: any[];

  constructor(
    private userService: UserService,
    private modalController: ModalController,
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.userService
      .getAllUsers()
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res.success) {
            this.users = res.data.users;
            this.usersBackup = this.users;
          } else {
            this.toastService.presentToast('Erreur: opération échouée');
          }
        },
        (err) => {
          this.toastService.presentToast('Erreur: opération échouée');
        }
      );
  }

  segmentChanged(ev: any) {
    this.users = null;
    setTimeout(() => {
      this.users = this.usersBackup.filter(
        (user: User) => user && user.status_id.toString() === this.status
      );
    }, 500);
  }

  search(name: string) {
    this.users = this.usersBackup.filter(
      (user: User) =>
        user &&
        user.firstname &&
        user.lastname &&
        (user.lastname.toLowerCase().includes(name.toLowerCase()) ||
          user.firstname.toLowerCase().includes(name.toLowerCase()))
    );
  }

  addNewUser(mode: string, userId?: any) {
    this.showPopup(mode, userId);
  }

  showPopup(mode: string, userId?: any) {
    this.presentModal(mode, userId);
  }

  async presentModal(mod: string, id: any) {
    const modal = await this.modalController.create({
      component: UserAddPage,
      cssClass: 'my-custom-class',
      componentProps: {
        userId: id,
      },
    });
    return await modal.present();
  }

  deleteUser(user: any) {
    this.loaderService.presentLoading();
    this.userService
      .deleteUser(user)
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res.success) {
            this.users = this.users.filter((obj) => obj.id !== user.id);
            this.loaderService.dismiss();
            this.toastService.presentToast(
              // tslint:disable-next-line: quotemark
              "L'utilisateur " +
                user.firstname +
                '' +
                user.lastname +
                ' a été supprimé.'
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
