import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-modal-show',
  templateUrl: './modal-show.component.html',
  styleUrls: ['./modal-show.component.scss'],
})
export class ModalShowComponent implements OnInit {
  @Input() src: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  closePop() {
    this.modalCtrl.dismiss();
  }
}
