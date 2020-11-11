import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Quote } from 'src/app/core/models/quote';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { QuotesService } from '../../quotes/services/quotes.service';

@Component({
  selector: 'app-devis',
  templateUrl: './devis.page.html',
  styleUrls: ['./devis.page.scss'],
})
export class DevisPage implements OnInit {
  status: string;

  quotes: Quote[];

  constructor(
    private quotesService: QuotesService,
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.status = '1';
    this.segmentChanged(null);
  }

  segmentChanged(ev: any) {
    this.quotes = null;
    this.quotesService
      .getQuotesByUserStatus(this.status)
      .pipe(take(1))
      .subscribe((res: any) => {
        if (res.success) {
          this.quotes = res.data.quotes;
        }
      });
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
              'Le devis ' + quote.id + 'a été refusé.'
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
              'Le devis ' + quote.id + 'a été refusé.'
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
