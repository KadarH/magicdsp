import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GaragesService } from '../../../quotes/services/garages.service';
import { StatusService } from '../../../quotes/services/status.service';

import * as moment from 'moment';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-garage-add',
  templateUrl: './garage-add.page.html',
  styleUrls: ['./garage-add.page.scss'],
})
export class GarageAddPage implements OnInit {
  @Input() garageId: any;
  @Input() mode: string;
  moment: any = moment;
  status$: Observable<any[]>;
  garage: any;

  opening: any[];

  validation_messages = [
    { type: 'required', message: 'Username is required.' },
    {
      type: 'minlength',
      message: 'Username must be at least 5 characters long.',
    },
    {
      type: 'maxlength',
      message: 'Username cannot be more than 25 characters long.',
    },
    {
      type: 'pattern',
      message: 'Your username must contain only numbers and letters.',
    },
    {
      type: 'validUsername',
      message: 'Your username has already been taken.',
    },
  ];

  constructor(
    private modalCtrl: ModalController,
    private garagesService: GaragesService,
    private statusService: StatusService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    moment.locale('fr');
    this.status$ = this.statusService.getStatus().pipe(
      take(1),
      map((res) => res.data.status)
    );

    if (this.mode === 'edit') {
      this.loaderService.presentLoading();
      this.garagesService
        .getGarage(this.garageId)
        .pipe(take(1))
        .subscribe((res) => {
          this.garage = res && res.success && res.data ? res.data.garage : null;
          if (res && res.success && res.data) {
            this.garage = res.data.garage;
            if (
              !this.garage.google_calendar ||
              this.garage.google_calendar === '' ||
              this.garage.google_calendar === null
            ) {
              console.log('okiii');
              this.garage.google_calendar = [];
            }
          }
          this.loaderService.dismiss();
        });
    } else {
      this.garage = {
        name: '',
        status_id: null,
        opening: null,
        google_calendar: null,
      };
    }
  }

  showDay(event: any) {
    event.srcElement.parentElement.classList.toggle('show');
  }

  addGarage(garage: any) {
    this.loaderService.presentLoading();
    const garageBackup = {
      id: garage.id ? garage.id : null,
      name: garage.name ? garage.name : null,
      status_id: garage.status_id ? garage.status_id : null,
      opening: garage.opening ? garage.opening : null,
      google_calendar: garage.google_calendar ? garage.google_calendar : null,
    };

    if (this.mode === 'edit') {
      garageBackup.id = garage.id;
      this.garagesService
        .editGarage(garageBackup)
        .pipe(take(1))
        .subscribe((res: any) => {
          this.toastService.presentToast(
            'Le garage a été modifié avec succès.'
          );
          this.loaderService.dismiss();
          this.closePop();
        });
    } else {
      this.garagesService
        .addGarage(garageBackup)
        .pipe(take(1))
        .subscribe((res: any) => {
          this.toastService.presentToast('Le garage a été ajouté avec succès.');
          this.loaderService.dismiss();
          this.closePop();
        });
    }
  }

  closePop(type?: string) {
    this.modalCtrl.dismiss('data');
  }

  momentParse(i: any) {
    return moment().day(i).format('dddd');
  }
  addCalendar() {
    console.log(this.garage.google_calendar);
    this.garage.google_calendar.push({
      name: '',
      id: '',
    });
  }
  deleteCalendar(index: number) {
    this.garage.google_calendar.splice(index, 1);
  }
}
