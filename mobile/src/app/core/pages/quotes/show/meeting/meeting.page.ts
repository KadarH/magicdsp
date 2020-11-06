import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.page.html',
  styleUrls: ['./meeting.page.scss'],
})
export class MeetingPage implements OnInit {
  id: number;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const devisId = this.route.snapshot.params.id;
    this.id = this.route.snapshot.params.id;
  }
}
