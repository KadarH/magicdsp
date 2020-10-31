import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { BackService } from 'src/app/shared/services/back.service';
import { CommunicationsService } from '../../services/communications.service';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.page.html',
  styleUrls: ['./communications.page.scss'],
})
export class CommunicationsPage implements OnInit {
  id: number;
  currentUser: any;
  communications: any[];
  body = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private communicationsService: CommunicationsService,
    private authService: AuthService,
    public backService: BackService,
  ) {}

  ngOnInit() {
    /** get id devis from route */
    const devisId = this.route.snapshot.params.id;

    /** set id devis for page title */
    this.id = devisId;

    /** get current user */
    this.currentUser = this.authService.getUser();

    /** get communications */
    this.getCommunications(devisId);
  }

  getCommunications(devisId: number) {
    this.communicationsService
      .getCommunications(devisId)
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res && res.data) {
            this.communications = res.data.communications;
            if (this.communications.length === 0) {
              if (this.currentUser && !this.currentUser.admin) {
                this.router.navigateByUrl('/quotes/show/' + this.id);
              }
            }
          }
        },
        (error) => {
          console.log(error.response);
        }
      );
  }

  addCommunication() {
    const oldBody = this.body;
    this.body = '';

    this.communicationsService
      .addCommunication(this.id, oldBody)
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res && res.success) {
            this.communications.push(res.data.communication);
          }
        },
        (error) => {
          console.log(error.response);
        }
      );
  }
}
