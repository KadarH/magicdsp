import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Quote } from 'src/app/core/models/quote';
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

  quotes: Quote[];

  constructor(
    private quotesService: QuotesService,
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.type = 'waiting';
    this.segmentChanged(null);
  }

  segmentChanged(ev: any) {
    this.quotes = null;
    this.quotesService
      .getQuotesByType(this.type)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.quotes = res.data.quotes;
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
}
