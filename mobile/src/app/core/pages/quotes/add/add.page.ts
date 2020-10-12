import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MenuController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import {
  Plugins,
  CameraResultType,
  CameraSource,
  Capacitor,
} from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MarquesService } from '../services/marques.service';
import { map, take } from 'rxjs/operators';
import { ModelsService } from '../services/models.service';
const { Camera } = Plugins;
@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  devisForm: FormGroup;

  tasks: FormArray;
  brands$: Observable<any[]>;
  models$: Observable<any[]>;
  years: number[] = [];

  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<
    HTMLInputElement
  >;
  photo: SafeResourceUrl;
  isDesktop: boolean;

  constructor(
    private platform: Platform,
    private sanitizer: DomSanitizer,
    public navCtrl: NavController,
    private menu: MenuController,
    private formBuilder: FormBuilder,
    private marquesService: MarquesService,
    private modelsService: ModelsService
  ) {}

  ngOnInit() {
    this.devisForm = this.formBuilder.group({
      brand: [],
      model: [],
      doors: [],
      year: [null],
      plateNumber: [],
      chassisNumber: [],

      tasks: this.formBuilder.array([this.patchValues()]),
    });

    this.initYearsArray();

    this.brands$ = this.marquesService.getBrands().pipe(
      map((res) => {
        return res.data.brands;
      })
    );

    this.devisForm.get('brand').valueChanges.subscribe((value) => {
      this.models$ = this.modelsService
        .getModels(value)
        .pipe(map((res) => res.data.brand.models));
    });
  }

  pushQuoteTask() {
    const control: FormArray = this.devisForm.get('tasks') as FormArray;
    control.push(this.patchValues());
  }

  patchValues(): FormGroup {
    return this.formBuilder.group({
      description: [],
      picture: [],
      url: [],
      stroke: [],
    });
  }

  loadImageFromDevice(event) {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      // note using fat arrow function here if we intend to point at current Class context.
      // this.yourImageDataURL = dataReader.result;
    };

    reader.onerror = (error) => {
      // handle errors
    };
  }
  submitForm() {
    this.pushQuoteTask();
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
  async getPicture(type: string) {
    if (
      !Capacitor.isPluginAvailable('Camera') ||
      (this.isDesktop && type === 'gallery')
    ) {
      this.filePickerRef.nativeElement.click();
      return;
    }

    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(
      image && image.dataUrl
    );
  }

  onFileChoose(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if (!file.type.match(pattern)) {
      console.log('File format not supported');
      return;
    }

    reader.onload = () => {
      this.photo = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }
}
