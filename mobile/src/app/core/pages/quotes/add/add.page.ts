import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MenuController, NavController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import {
  Plugins,
  Storage,
} from '@capacitor/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { MarquesService } from '../services/marques.service';
import { map, take } from 'rxjs/operators';
import { ModelsService } from '../services/models.service';
import { User } from 'src/app/auth/user';
import { StrokesService } from '../services/strokes.service';
import { QuotesService } from '../services/quotes.service';
import { Router } from '@angular/router';
import { Quote } from 'src/app/core/models/quote';
const { Camera } = Plugins;

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  user: User;

  devisForm: FormGroup;
  quote: Quote;
  tasks: FormArray;
  brands$: Observable<any[]>;
  models$: Observable<any[]>;
  years: number[] = [];
  strokes$: Observable<any[]>;

  img = '';
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<
    HTMLInputElement
  >;
  photo: SafeResourceUrl;
  isDesktop: boolean;

  toast: HTMLIonToastElement;
  constructor(
    public toastController: ToastController,
    public navCtrl: NavController,
    private menu: MenuController,
    private formBuilder: FormBuilder,
    private marquesService: MarquesService,
    private modelsService: ModelsService,
    private strokesService: StrokesService,
    private quotesService: QuotesService,
    private router: Router
  ) {}

  ngOnInit() {
    /** get user from resolver */
    this.loadUser();

    /** init Form */
    this.devisForm = this.formBuilder.group({
      brand: [''],
      model: [''],
      doors: [''],
      year: [null],
      plate_number: [''],
      chassis_number: [''],

      tasks: this.formBuilder.array([this.patchValues()]),
    });

    this.initYearsArray();

    this.brands$ = this.marquesService.getBrands().pipe(
      map((res) => {
        return res.data.brands;
      })
    );
    this.strokes$ = this.strokesService.getStrokes().pipe(
      map((res) => {
        return res.data.strokes;
      })
    );

    this.devisForm.get('brand').valueChanges.subscribe((value) => {
      this.models$ = this.modelsService
        .getModels(value.id)
        .pipe(map((res) => res.data.brand.models));
    });
  }

  async loadUser() {
    const user = await Storage.get({ key: 'user' });
    this.user = user && user.value ? JSON.parse(user.value) : null;
  }

  patchValues(): FormGroup {
    return this.formBuilder.group({
      description: [],
      picture: [],
      url: [],
      stroke_id: [],
    });
  }

  submitForm(devisForm: FormGroup) {
    console.log(devisForm.value);

    this.quote = { ...devisForm.value };

    this.quote.brand = devisForm.get('brand').value.name;
    this.quotesService
      .saveQuote(this.quote)
      .pipe(take(1))
      .subscribe(
        (res: any) => {
          this.presentToast('Le devis a été ajouté avec success');
          this.router.navigateByUrl('/quotes/show/' + res.data.quote.id);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  addNewTask() {
    this.pushQuoteTask();
  }

  deleteTask(i: number) {
    const control: FormArray = this.devisForm.get('tasks') as FormArray;
    control.removeAt(i);
  }

  pushQuoteTask() {
    const control: FormArray = this.devisForm.get('tasks') as FormArray;
    control.push(this.patchValues());
  }

  showMenu() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  initYearsArray() {
    let initYear = 1980;
    const maxYear = moment().year() + 1;

    while (initYear !== maxYear) {
      this.years.push(initYear);
      initYear++;
    }

    this.years.reverse();
  }

  getPicture(type: string) {
    this.filePickerRef.nativeElement.click();
  }

  onFileChoose(event: any, index: number) {
    const file = (event.target as HTMLInputElement).files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if (!file.type.match(pattern)) {
      console.log('File format not supported');
      return;
    }
    reader.onload = () => {
      this.photo = reader.result.toString();
      this.quotesService
        .uploadPhoto(file)
        .pipe(take(1))
        .subscribe((data) => {
          if (data.success) {
            const arr = this.devisForm.get('tasks') as FormArray;
            arr.controls[index].patchValue({ picture: data.data.file });
          }
        });
    };
    reader.readAsDataURL(file);
  }

  async presentToast(msg: string) {
    this.toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: 'dark',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        },
      ],
    });
    this.toast.present();
  }
}
