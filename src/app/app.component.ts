import { Component } from '@angular/core';
import { AdService } from './ad.service';
import * as moment from 'moment';
import { ChartDataSets, ChartOptions, ChartPoint } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

interface NgxChartPoint {
  name: Date;
  value: number;
}

interface NgxChartLine {
  name: string;
  series: Array<NgxChartPoint>;
}

function customRadius(context) {
  console.log(context);
  return 2;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private dataService: AdService) { }

  title = 'anomalydetection-demo';

  customUrl = '';

  dataSeries = [];

  lineChartLegend = true;
  lineChartType = 'line';

  public lineChartOptions: (ChartOptions) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [
        {
          type: 'time',
          distribution: 'linear',
          bounds: 'ticks',
          time: {
            unit: 'day',
            ticks: {
              source: 'data',
              stepSize: 10,
            }
          }
        }
      ],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left'
        }
      ]
    },
  };

  public chartData: ChartDataSets[] = [];

  public lineChartLabels: Label[] = [];

  yLabel = '';

  haveNoData() {
    return this.dataSeries.length === 0;
  }

  formatXAsisDate(val) {
    return moment(val).format('YY-MM-DD hh:mm:ss');
  }

  redrawGraph() {
    if (this.customUrl === '') {
      this.dataSeries = [];
      // get data from bucket
      this.dataService.getDataHttp(this.customUrl).subscribe(res => {
        let points = [];
        console.log(res);
        if (res.status === 'SUCCESS') {
          let series = res.request.series;
          if (series.length > 0) {
            points = series[0].metrics;
            this.yLabel = series[0].name;
          }
        }
        let lineNormal = [];
        let lineAbSpike = [];
        let lineAbThreshold = [];
        let lineAbIR = [];
        let lineAbLS = [];
        let lineAbSeasonal = [];
        points.forEach(val => {
          const p = {
            x: moment(val.timestamp * 1000),
            y: val.value
          };
          lineNormal.push(p);
          if (val.anomaly_types !== null) {
            val.anomaly_types.forEach(type => {
              switch (type) {
                case 'spike':
                  lineAbSpike.push(p);
                  break;
                case 'threshold':
                  lineAbThreshold.push(p);
                  break;
                case 'interquartile_range':
                  lineAbIR.push(p);
                  break;
                case 'level_shift':
                  lineAbLS.push(p);
                  break;
                case 'seasonal':
                  lineAbSeasonal.push(p);
                  break;
                default:
                  break;
              }
            });
          }
        });

        this.chartData = [];
        this.chartData.push({
          data: lineNormal,
          label: this.yLabel
        });

        if (lineAbSpike.length > 0) {
          this.chartData.push({
            data: lineAbSpike,
            label: 'spike',
            pointRadius: 10,
            showLine: false,
          });
        }

        if (lineAbThreshold.length > 0) {
          this.chartData.push({
            data: lineAbThreshold,
            label: 'threshold',
            pointRadius: 10,
            showLine: false,
          });
        }
        if (lineAbIR.length > 0) {
          this.chartData.push({
            data: lineAbIR,
            label: 'interquartile_range',
            pointRadius: 10,
            showLine: false,
          });
        }
        if (lineAbLS.length > 0) {
          this.chartData.push({
            data: lineAbLS,
            label: 'level_shift',
            pointRadius: 10,
            showLine: false,
          });
        }
        if (lineAbSeasonal.length > 0) {
          this.chartData.push({
            data: lineAbSeasonal,
            label: 'seasonal',
            pointRadius: 10,
            showLine: false,
          });
        }
      });
    } else {
      // get data and redraw
      this.dataSeries = [];
      // get data from bucket
      this.dataService.getData().subscribe(res => {
        let points = [];
        console.log(res);
        if (res.status === 'SUCCESS') {
          let series = res.request.series;
          if (series.length > 0) {
            points = series[0].metrics;
            this.yLabel = series[0].name;
          }
        }
        let lineNormal = [];
        let lineAbSpike = [];
        let lineAbThreshold = [];
        let lineAbIR = [];
        let lineAbLS = [];
        let lineAbSeasonal = [];
        points.forEach(val => {
          const p = {
            x: moment(val.timestamp * 1000),
            y: val.value
          };
          lineNormal.push(p);
          if (val.anomaly_types !== null) {
            val.anomaly_types.forEach(type => {
              switch (type) {
                case 'spike':
                  lineAbSpike.push(p);
                  break;
                case 'threshold':
                  lineAbThreshold.push(p);
                  break;
                case 'interquartile_range':
                  lineAbIR.push(p);
                  break;
                case 'level_shift':
                  lineAbLS.push(p);
                  break;
                case 'seasonal':
                  lineAbSeasonal.push(p);
                  break;
                default:
                  break;
              }
            });
          }
        });

        this.chartData = [];
        this.chartData.push({
          data: lineNormal,
          label: this.yLabel
        });

        if (lineAbSpike.length > 0) {
          this.chartData.push({
            data: lineAbSpike,
            label: 'spike',
            pointRadius: 10,
            showLine: false,
          });
        }

        if (lineAbThreshold.length > 0) {
          this.chartData.push({
            data: lineAbThreshold,
            label: 'threshold',
            pointRadius: 10,
            showLine: false,
          });
        }
        if (lineAbIR.length > 0) {
          this.chartData.push({
            data: lineAbIR,
            label: 'interquartile_range',
            pointRadius: 10,
            showLine: false,
          });
        }
        if (lineAbLS.length > 0) {
          this.chartData.push({
            data: lineAbLS,
            label: 'level_shift',
            pointRadius: 10,
            showLine: false,
          });
        }
        if (lineAbSeasonal.length > 0) {
          this.chartData.push({
            data: lineAbSeasonal,
            label: 'seasonal',
            pointRadius: 10,
            showLine: false,
          });
        }
      });
    }
  }
}
