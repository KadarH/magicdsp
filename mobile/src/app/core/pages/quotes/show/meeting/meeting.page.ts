import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GaragesService } from '../../services/garages.service';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.page.html',
  styleUrls: ['./meeting.page.scss'],
})
export class MeetingPage implements OnInit {
  meetingForm: FormGroup;
  garages$: Observable<any[]>;
  availabilities: any;
  quoteId: number;
  garageId: number;
  dateSelected: string;
  hourSelected: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formbuilder: FormBuilder,
    private garageService: GaragesService,
    private alertController: AlertController,
    private toastService: ToastService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.quoteId = this.route.snapshot.params.id;

    this.garages$ = this.garageService.getGarages().pipe(
      take(1),
      map((res) => res.data.garages)
    );

    this.meetingForm = this.formbuilder.group({
      garage: ['', Validators.required],
      date: [null, Validators.required],
    });

    this.meetingForm.get('garage').valueChanges.subscribe((value) => {
      this.garageId = value.id;
    });

    this.meetingForm.get('date').valueChanges.subscribe((value) => {
      const date = moment(value).format('YYYY-MM-DD');
      this.dateSelected = date;
      if (!value) {
        this.availabilities = null;
      } else {
        this.loaderService.presentLoading();

        this.garageService
          .checkAvailabilities(this.quoteId, this.garageId, date)
          .pipe(take(1))
          .subscribe(
            (res) => {
              if (res.success) {
                this.availabilities = res.data.garage.availabilities;

                this.loaderService.dismiss();
              } else {
                this.toastService.presentToast(
                  'Probléme lors du chargement de la liste des heures disponibles'
                );
                this.loaderService.dismiss();
              }
            },
            (err) => {
              this.toastService.presentToast(
                'Probléme lors du chargement de la liste des heures disponibles'
              );
              this.loaderService.dismiss();
            }
          );
      }
    });
  }

  selectHour(event: any, index: string) {
    const hours = document.querySelectorAll('.availability .content');
    hours.forEach((hour) => {
      hour.classList.remove('selected');
    });
    event.target.classList.add('selected');
    this.hourSelected = index;
  }

  fixMeeting() {
    this.presentAlertConfirm(
      moment(this.dateSelected).format('DD-MM-YYYY'),
      this.hourSelected
    );
  }

  patchQuote() {
    this.loaderService.presentLoading();
    this.garageService
      .fixMeeting(
        this.quoteId,
        this.garageId,
        this.dateSelected,
        this.hourSelected
      )
      .pipe(take(1))
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.toastService.presentToast(
              'Le rendez-vous a été ajouté avec succès'
            );
            this.loaderService.dismiss();
            this.router.navigateByUrl('/quotes/show/' + this.quoteId, {
              replaceUrl: true,
            });
          } else {
            this.toastService.presentToast(
              'Operation echoué, probléme du serveur'
            );
            this.loaderService.dismiss();
          }
        },
        (err) => {
          this.toastService.presentToast(
            'Operation echoué, probléme du serveur'
          );
          this.loaderService.dismiss();
        }
      );
  }
  // Easy access for form fields
  get garage() {
    return this.meetingForm.get('garage');
  }

  async presentAlertConfirm(date: string, hour: string) {
    const alert = await this.alertController.create({
      header: 'Confirmation!',
      message:
        "Etês-vous sûr d'avoir choisi un rendez- vous le " +
        date +
        ' à ' +
        hour +
        ' ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirmation Canceled');
          },
        },
        {
          text: 'Confirmer',
          handler: () => {
            this.patchQuote();
          },
        },
      ],
    });

    await alert.present();
  }
}
