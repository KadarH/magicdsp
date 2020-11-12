import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Quote } from 'src/app/core/models/quote';
import { User } from 'src/app/core/models/user';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { QuotesService } from '../services/quotes.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  type: string;

  user: User;
  quotes: Quote[];
  quotesBackup: Quote[];

  constructor(
    private quotesService: QuotesService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.type = 'waiting';
    this.segmentChanged(null);
  }

  segmentChanged(ev: any) {
    this.quotes = null;
    this.quotesService
      .getQuotesByType(this.type)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.quotesBackup = [];
        this.quotesBackup = res.data.quotes;
        this.quotes = res.data.quotes;
      });
  }

  search(name: string) {
    this.quotes = this.quotesBackup.filter(
      (quote: Quote) =>
        quote.user &&
        quote.user.firstname &&
        quote.user.lastname &&
        (quote.user.lastname.toLowerCase().includes(name.toLowerCase()) ||
          quote.user.firstname.toLowerCase().includes(name.toLowerCase()))
    );
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

  deleteQuote(quote: Quote) {
    this.loaderService.presentLoading();
    this.quotesService
      .deleteQuote(quote)
      .pipe(take(1))
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.quotes = this.quotes.filter((obj) => obj.id !== quote.id);
            this.loaderService.dismiss();
            this.toastService.presentToast(
              'Le devis ' + quote.id + ' a été supprimé.'
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
