import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Plugins, Storage } from '@capacitor/core';
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
import { ModalShowComponent } from '../modal-show/modal-show.component';
import { environment } from 'src/environments/environment';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
const { Camera } = Plugins;

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  user: User;

  devisForm: FormGroup;
  stormForm: FormGroup;
  quote: Quote;
  tasks: FormArray;
  brands$: Observable<any[]>;
  models$: Observable<any[]>;
  strokes$: Observable<any[]>;
  years: number[] = [];

  img = '';
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<
    HTMLInputElement
  >;
  photo: SafeResourceUrl;
  isDesktop: boolean;

  toast: HTMLIonToastElement;

  constructor(
    private loaderService: LoaderService,
    private toastService: ToastService,
    public navCtrl: NavController,
    private menu: MenuController,
    public modalController: ModalController,
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
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      doors: ['', [Validators.required]],
      year: [null, [Validators.required]],
      plate_number: ['', [Validators.required]],
      chassis_number: ['', []],
      tasks: this.formBuilder.array([this.patchValues()]),
    });

    this.stormForm = this.formBuilder.group({
      isStorm: [false, [Validators.required]],
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
      picture: [null, [Validators.required]],
      url: [],
      stroke_id: [null, [Validators.required]],
    });
  }

  submitForm(devisForm: FormGroup) {
    this.loaderService.presentLoading();

    if (this.stormForm.get('isStorm').value === true) {
      // vehicule storm
      this.quotesService
        .saveStorm()
        .pipe(take(1))
        .subscribe(
          (res: any) => {
            console.log(res);
            if (res.success) {
              this.router.navigateByUrl(
                '/quotes/show/' + res.data.quote.id + '/meeting',
                { replaceUrl: true }
              );

              this.toastService.presentToast(
                'La demande a été ajoutée avec success'
              );
              this.loaderService.dismiss();
            } else {
              this.toastService.presentToast(
                'Ajout echoué, problème du serveur.'
              );
              this.loaderService.dismiss();
            }
          },
          (err) => {
            this.toastService.presentToast(
              'Ajout echoué, problème du serveur.'
            );
            this.loaderService.dismiss();
          }
        );
    } else {
      this.quote = { ...devisForm.value };
      this.quote.brand = devisForm.get('brand').value.name;
      this.quotesService
        .saveQuote(this.quote)
        .pipe(take(1))
        .subscribe(
          (res: any) => {
            if (res.success) {
              this.router.navigateByUrl('/quotes/show/' + res.data.quote.id);
              this.toastService.presentToast(
                'Le devis a été ajouté avec success'
              );
              this.loaderService.dismiss();
            } else {
              this.toastService.presentToast(
                'Ajout echoué, problème du serveur.'
              );
              this.loaderService.dismiss();
            }
          },
          (err) => {
            this.toastService.presentToast(
              'Ajout echoué, problème du serveur.'
            );
            this.loaderService.dismiss();
          }
        );
    }
  }

  addNewTask() {
    this.pushQuoteTask();
  }

  deleteTask(i: number) {
    const control: FormArray = this.devisForm.get('tasks') as FormArray;
    control.removeAt(i);
    this.toastService.presentToast('Degat supprimé avec succès.');
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
      this.toastService.presentToast('Format du fichier non supportée.');
      return;
    }
    reader.onload = () => {
      this.photo = reader.result.toString();

      this.loaderService.presentLoading();
      this.quotesService
        .uploadPhoto(file)
        .pipe(take(1))
        .subscribe(
          (data) => {
            if (data.success) {
              const arr = this.devisForm.get('tasks') as FormArray;
              arr.controls[index].patchValue({ picture: data.data.file });
              this.loaderService.dismiss();
            }
          },
          (err) => {
            this.loaderService.dismiss();
          }
        );
    };
    reader.readAsDataURL(file);
  }

  showPicture(pic: string) {
    const pictureStorageURL = environment.urls.pictureStorage + pic;
    this.presentModal(pictureStorageURL);
  }

  async presentModal(pic: string) {
    const modal = await this.modalController.create({
      component: ModalShowComponent,
      componentProps: {
        src: pic,
      },
    });
    return await modal.present();
  }
}
