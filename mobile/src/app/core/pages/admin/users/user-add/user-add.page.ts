import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Quote } from 'src/app/core/models/quote';
import { User } from 'src/app/core/models/user';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { QuotesService } from '../../../quotes/services/quotes.service';
import { UserService } from '../../../quotes/services/user.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.page.html',
  styleUrls: ['./user-add.page.scss'],
})
export class UserAddPage implements OnInit {
  user: User;
  userToUpdate: any;
  quotes: Quote[];
  quotesBackup: Quote[];

  @Input() userId: string;

  userForm: FormGroup;

  constructor(
    private quotesService: QuotesService,
    private userService: UserService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.userService
      .getUserById(this.userId)
      .pipe(take(1))
      .subscribe((res: any) => {
        if (res.success) {
          this.quotesBackup = [];
          this.quotesBackup = res.data.quotes;
          this.quotes = res.data.user.quotes;
          this.userToUpdate = res.data.user;
          this.initForm(this.userToUpdate);
        }
      });
  }

  initForm(user: any) {
    this.userForm = this.fb.group({
      status_id: [user.status_id ? user.status_id : ''],
      firstname: [user.firstname ? user.firstname : '', [Validators.required]],
      lastname: [user.lastname ? user.lastname : '', [Validators.required]],
      email: [user.email ? user.email : '', [Validators.required]],
      address: [user.address ? user.address : '', [Validators.required]],
      phone_number: [
        user.phone_number ? user.phone_number : '',
        [Validators.required],
      ],
      vat_number: [user.phone_number ? user.phone_number : ''],
    });
  }

  async goToQuote(id: number) {
    this.closePopUpAsync();
    this.router.navigateByUrl('/quotes/show/' + id);
  }

  updateUser(user: any) {
    this.loaderService.presentLoading();

    this.userService
      .editUser(this.userId, user)
      .pipe(take(1))
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.user = res.data.user;
            this.loaderService.dismiss();
            // tslint:disable-next-line: quotemark
            this.toastService.presentToast("L'utilisateur a été modifié.");
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

  closePop() {
    this.closePopUpAsync();
  }

  async closePopUpAsync() {
    const modal = await this.modalController.getTop();
    modal.dismiss();
  }

  refuseQuote(quote: any) {
    this.loaderService.presentLoading();
    this.quotesService
      .refuseQuote(quote)
      .pipe(take(1))
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.quotes = this.quotes.filter((obj) => obj.id !== quote.id);
            this.loaderService.dismiss();
            this.toastService.presentToast(
              'Le devis ' + quote.id + ' a été refusé.'
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
