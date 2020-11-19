import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { User } from 'src/app/auth/user';
import { Quote } from 'src/app/core/models/quote';
import { QuotesService } from '../services/quotes.service';
import { StrokesService } from '../services/strokes.service';
import { ModalShowComponent } from '../modal-show/modal-show.component';
import { CommunicationsService } from '../services/communications.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.page.html',
  styleUrls: ['./show.page.scss'],
})
export class ShowPage implements OnInit {
  quote: Quote;
  strokes = [];
  communications = [];
  user: User;

  totalDurationString: string;
  totalDuration: number;
  totalPrice: number;

  constructor(
    public modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private quotesService: QuotesService,
    private strokesService: StrokesService,
    private communicationsService: CommunicationsService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    const quoteId = this.route.snapshot.params.id;

    this.communicationsService
      .getCommunications(quoteId)
      .pipe(take(1))
      .subscribe((res) => {
        if (res && res.success) {
          this.communications = res.data.communications;
        }
      });

    this.user = this.authService.getUser();

    this.strokesService.getStrokes().subscribe((rst: any) => {
      this.strokes = rst && rst.data ? rst.data.strokes : [];
    });

    this.quotesService
      .getQuote(quoteId)
      .pipe(take(1))
      .subscribe((res: any) => {
        if (res.success) {
          this.quote = res.data.quote;
          if (this.quote.storm === 0) {
            this.quote.tasks.map((task) => {
              task.stroke = task.stroke_id;
            });
            this.totalDuration = this.quote.duration;
            if (this.totalDuration >= 0) {
              const totalMinutes = this.totalDuration;
              const hours = Math.floor(totalMinutes / 60);
              const minutes = totalMinutes % 60;

              this.totalDurationString =
                hours + 'h' + ('0' + minutes).slice(-2) + 'min';
            }

            this.totalPrice = this.quote.price;
          }
        }
      });
  }

  formatDuration(duration: number) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours + 'h' + ('0' + minutes).slice(-2) + 'min';
  }

  estimate() {
    console.log(this.quote);
    const tasksArray = [];
    this.quote.tasks.map((task) => {
      tasksArray.push({
        description: task.description,
        picture: task.picture,
        id: task.id,
        duration: task.duration,
        stroke_id: task.stroke,
        price: task.price,
      });
    });
    const obj = {
      id: this.quote.id,
      brand: this.quote.brand,
      model: this.quote.model,
      doors: this.quote.doors,
      year: this.quote.year,
      plate_number: this.quote.plate_number,
      chassis_number: this.quote.chassis_number,
      tasks: tasksArray,
    };
    this.quotesService.editQuote(obj).subscribe((res) => {
      console.log(res);
    });
  }

  showPicture(pic: string) {
    this.presentModal(pic);
  }

  acceptQuote(quote: any) {
    this.loaderService.presentLoading();
    this.quotesService
      .acceptQuote(quote)
      .pipe(take(1))
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.loaderService.dismiss();
            this.toastService.presentToast(
              'Le devis ' + quote.id + 'a été accepté.'
            );
            this.router.navigateByUrl('/quotes/show/' + quote.id, {
              replaceUrl: true,
            });
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

  refuseQuote(quote: any) {
    this.loaderService.presentLoading();
    this.quotesService
      .refuseQuote(quote)
      .pipe(take(1))
      .subscribe(
        (res: any) => {
          if (res.success) {
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
