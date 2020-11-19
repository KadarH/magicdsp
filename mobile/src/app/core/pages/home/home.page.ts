import { Component, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import * as dataLabels from 'chartjs-plugin-datalabels';
import { forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { QuotesService } from '../quotes/services/quotes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('pieChart') pieChart: any;
  @ViewChild('barChart') barChart: any;

  dataLabels = [dataLabels];
  bars: any;
  colorArray: any;
  waiting: any[];
  accepted: any[];
  refused: any[];

  particulier: any[];
  pro: any[];
  cabinet: any[];

  user: any;

  constructor(
    private quoteService: QuotesService,
    private authService: AuthService
  ) {}

  ionViewDidEnter() {
    this.prepareAndCreatePieChart();
    if (this.user.admin) {
      this.prepareAndCreateBarChart();
    }
  }

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  prepareAndCreatePieChart() {
    const waiting$ = this.quoteService.getQuotesByType('waiting').pipe(
      take(1),
      map((res) => res.data.quotes)
    );
    const accepted$ = this.quoteService.getQuotesByType('accepted').pipe(
      take(1),
      map((res) => res.data.quotes)
    );
    const refused$ = this.quoteService.getQuotesByType('refused').pipe(
      take(1),
      map((res) => res.data.quotes)
    );
    forkJoin({ s1: waiting$, s2: accepted$, s3: refused$ }).subscribe(
      ({ s1, s2, s3 }) => {
        this.waiting = s1;
        this.accepted = s2;
        this.refused = s3;
        this.createPieChart();
      }
    );
  }

  prepareAndCreateBarChart() {
    const particulier$ = this.quoteService.getQuotesByUserStatus('1').pipe(
      take(1),
      map((res) => res.data.quotes)
    );
    const pro$ = this.quoteService.getQuotesByUserStatus('2').pipe(
      take(1),
      map((res) => res.data.quotes)
    );

    const cabinet$ = this.quoteService.getQuotesByUserStatus('3').pipe(
      take(1),
      map((res) => res.data.quotes)
    );
    forkJoin({ s1: particulier$, s2: pro$, s3: cabinet$ }).subscribe(
      ({ s1, s2, s3 }) => {
        this.particulier = s1;
        this.pro = s2;
        this.cabinet = s3;
        this.createBarChart();
      }
    );
  }
  createPieChart() {
    this.bars = new Chart(this.pieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['En att..', 'Acc..', 'Refu..'],

        datasets: [
          {
            label: 'Nombre de devis en %',
            data: [
              this.waiting.length,
              this.accepted.length,
              this.refused.length,
            ],
            backgroundColor: ['#9aa7c1', '#a8bea8', '#e35d6a'],
            borderColor: '#ccc', // array should have same number of elements as number of dataset
            borderWidth: 2,
            barPercentage: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              let sum = 0;
              const dataArr: any = ctx.chart.data.datasets[0].data;
              dataArr.map((data) => {
                sum += data;
              });
              const percentage = value
                ? ((value * 100) / sum).toFixed(0) + '%'
                : '';
              return percentage;
            },
            color: 'black',
          },
        },
      },
    });
  }

  createBarChart() {
    this.barChart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Particulier', 'Pro', 'Cabinet'],
        datasets: [
          {
            label: 'Nombre de devis',
            data: [
              this.particulier.length,
              this.pro.length,
              this.cabinet.length,
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
}
