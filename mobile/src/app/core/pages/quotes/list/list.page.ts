import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Quote } from 'src/app/core/models/quote';
import { QuotesService } from '../services/quotes.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  type: string;

  quotes: Quote[] = [];

  constructor(private quotesService: QuotesService) {}

  ngOnInit() {
    this.type = 'waiting';
    this.segmentChanged(null);
  }

  segmentChanged(ev: any) {
    this.quotesService
      .getQuotesByType(this.type)
      .pipe(take(1))
      .subscribe((res: any) => {
        console.log(res);
        this.quotes = res.data.quotes;
      });
  }

  fetchBookings() {}
}
