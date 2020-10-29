import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GaragesService } from '../../../quotes/services/garages.service';
import { StatusService } from '../../../quotes/services/status.service';

import * as moment from 'moment';

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
  garageForm: FormGroup;
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
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    moment.locale('fr');
    this.status$ = this.statusService.getStatus().pipe(
      take(1),
      map((res) => res.data.status)
    );

    if (this.mode === 'edit') {
      this.garagesService
        .getGarage(this.garageId)
        .pipe(take(1))
        .subscribe((res) => {
          this.garage = res && res.data ? res.data.garage : null;

          this.initForm(this.garage);
        });
    } else {
      this.initForm(null);
    }
  }

  initForm(garage: any) {
    this.garageForm = this.fb.group({
      name: [
        '',
        Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(5),
          Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
          Validators.required,
        ]),
      ],
      status_id: ['', [Validators.required]],
      opening: this.fb.array(garage ? garage.opening : []),
    });
  }

  patchValues(garage: any) {
    console.log(garage);
    return this.fb.group({
        
    });
  }

  showDay(event) {
    event.srcElement.parentElement.classList.toggle('show');
  }
  addGarage(garage: any) {
    console.log(garage);
  }
  closePop() {
    this.modalCtrl.dismiss();
  }

  momentParse(i) {
    return moment().day(i).format('dddd');
  }
}
