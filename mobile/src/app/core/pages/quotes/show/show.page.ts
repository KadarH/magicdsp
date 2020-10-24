import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { Quote } from 'src/app/core/models/quote';
import { Task } from 'src/app/core/models/task';
import { QuotesService } from '../services/quotes.service';
import { StrokesService } from '../services/strokes.service';
import { ModalShowComponent } from './modal-show/modal-show.component';

@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss'],
})
export class ShowPage implements OnInit {
  quote: Quote;
  strokes = [];

  totalDurationString: string;
  totalDuration: number;
  totalPrice: number;

  constructor(
    public modalController: ModalController,
    private route: ActivatedRoute,
    private quotesService: QuotesService,
    private strokesService: StrokesService
  ) {}

  ngOnInit() {
    this.strokesService.getStrokes().subscribe((rst: any) => {
      this.strokes = rst && rst.data ? rst.data.strokes : [];
    });
    const quoteId = this.route.snapshot.params.id;
    console.log(quoteId);
    this.quotesService.getQuote(quoteId).subscribe((res: any) => {
      if (res && res.data) {
        this.quote = res.data.quote;

        this.quote.tasks.map((task) => {
          task.stroke = task.stroke_id;
        });
        this.totalDuration = this.quote.tasks
          .map((x) => x.duration)
          .reduce((sum, current) => sum + current, 0);
        if (this.totalDuration >= 0) {
          const totalMinutes = this.totalDuration;
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;

          this.totalDurationString =
            hours + 'h' + ('0' + minutes).slice(-2) + 'min';
        }

        this.totalPrice = this.quote.tasks
          .map((x) => x.price)
          .reduce((sum, current) => sum + current, 0);
      }
    });
  }

  estimate() {
    console.log(this.quote);
  }

  showPicture(pic: string) {
    this.presentModal(pic);
  }

  refuseQuote() {
    this.quotesService
      .refuseQuote(this.quote)
      .pipe(take(1))
      .subscribe((data) => {
        console.log(data);
      });
  }
  async presentModal(pic: string) {
    const modal = await this.modalController.create({
      component: ModalShowComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        src: pic,
      },
    });
    return await modal.present();
  }
}
