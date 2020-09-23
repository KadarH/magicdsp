import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  constructor(public navCtrl: NavController, private menu: MenuController) {}

  ngOnInit() {}
  showMenu() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
}
