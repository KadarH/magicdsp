import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import {
  Plugins,
  Storage,
  CameraResultType,
  CameraPhoto,
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
import { ModalShowComponent } from '../modal-show/modal-show.component';
import { environment } from 'src/environments/environment';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Task } from 'src/app/core/models/task';
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

  imageDevicePath: string; // device path to read the content

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
    private authService: AuthService,
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
    const currentUser: User = this.authService.getUser();
    const control: FormArray = this.devisForm.get('tasks') as FormArray;

    if (
      (currentUser.status_id === 1 && control.length < 2) ||
      ((currentUser.status_id === 2 || currentUser.status_id === 2) &&
        control.length < 4) ||
      currentUser.admin
    ) {
      this.pushQuoteTask();
    } else {
      this.toastService.presentToast(
        // tslint:disable-next-line: quotemark
        "Vous navez pas le droit d'ajouter un nouveau dégat"
      );
    }
  }

  deleteTask(i: number, item: any) {
    console.log(item.get('picture'));

    const control: FormArray = this.devisForm.get('tasks') as FormArray;
    console.log(control.value[i].picture);

    this.quotesService
      .deletePhoto(control.value[i].picture)
      .pipe(take(1))
      .subscribe(
        (res: any) => {
          if (res.success) {
            control.removeAt(i);
            this.toastService.presentToast('Degat supprimé avec succès.');
          }
        },
        (err) => {
          this.toastService.presentToast('Ajout echoué, problème du serveur.');
          this.loaderService.dismiss();
        }
      );
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

  async takePicture(event: any, index: number) {
    const imageUrl: CameraPhoto = await Camera.getPhoto({
      height: 1080,
      width: 1080,
      resultType: CameraResultType.Base64,
    });

    const contentType = 'image/' + imageUrl.format; // In this case "image/gif"
    const realData = imageUrl.base64String; // In this case "R0lGODlhPQBEAPeoAJosM...."
    const blob = this.b64toBlob(realData, contentType);

    this.loaderService.presentLoading();

    this.quotesService
      .uploadPhoto(blob)
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
  }

  b64toBlob(b64Data, contentType, sliceSize?) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  async fileRead() {
    const { Filesystem } = Plugins;

    const contents = await Filesystem.readFile({
      path: this.imageDevicePath,
    });

    console.log(contents);
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
