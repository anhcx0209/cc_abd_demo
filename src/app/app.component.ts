import { Component, OnInit } from '@angular/core';
import { AdService } from './ad.service';
import * as moment from 'moment';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private dataService: AdService) { }

  title = 'anomalydetection-demo';

  customUrl = '';

  chartData: Array<any>;

  ngOnInit() {}

  redrawGraph() {
    if (this.customUrl !== '') {
      this.dataService.getDataHttp(this.customUrl).subscribe(resp => {
        console.log(resp);
      });
    } else {
      this.dataService.getDummyData().subscribe(resp => {
        this.generateData(resp);
      });
    }
  }

  generateData(resp) {
    this.chartData = [];
    if (resp.status === 'SUCCESS') {
      // get first series
      if (Array.isArray(resp.request.series)) {
        const metricsData = resp.request.series[0].metrics;
        const metricsName = resp.request.series[0].name;
        // build data
        this.chartData = metricsData.map(element => {
          return {
            x: d3.timeParse('%s')(element.timestamp),
            y: element.value,
            anomaly_types: element.anomaly_types
          }
        });
      }
    }
  }

  // redrawGraph() {
  //   if (this.customUrl !== '') {
  //     this.dataSeries = [];
  //     // get data from bucket
  //     this.dataService.getDataHttp(this.customUrl).subscribe(res => {
  //       let points = [];
  //       console.log(res);
  //       if (res.status === 'SUCCESS') {
  //         let series = res.request.series;
  //         if (series.length > 0) {
  //           points = series[0].metrics;
  //           this.yLabel = series[0].name;
  //         }
  //       }
  //       let lineNormal = [];
  //       let lineAbSpike = [];
  //       let lineAbThreshold = [];
  //       let lineAbIR = [];
  //       let lineAbLS = [];
  //       let lineAbSeasonal = [];
  //       points.forEach(val => {
  //         const p = {
  //           x: moment(val.timestamp * 1000),
  //           y: val.value
  //         };
  //         lineNormal.push(p);
  //         if (val.anomaly_types !== null) {
  //           val.anomaly_types.forEach(type => {
  //             switch (type) {
  //               case 'spike':
  //                 lineAbSpike.push(p);
  //                 break;
  //               case 'threshold':
  //                 lineAbThreshold.push(p);
  //                 break;
  //               case 'interquartile_range':
  //                 lineAbIR.push(p);
  //                 break;
  //               case 'level_shift':
  //                 lineAbLS.push(p);
  //                 break;
  //               case 'seasonal':
  //                 lineAbSeasonal.push(p);
  //                 break;
  //               default:
  //                 break;
  //             }
  //           });
  //         }
  //       });

  //       this.chartData = [];
  //       this.chartData.push({
  //         data: lineNormal,
  //         label: this.yLabel
  //       });

  //       if (lineAbSpike.length > 0) {
  //         this.chartData.push({
  //           data: lineAbSpike,
  //           label: 'spike',
  //           pointRadius: 10,
  //           showLine: false,
  //           pointStyle: 'cross'
  //         });
  //       }

  //       if (lineAbThreshold.length > 0) {
  //         this.chartData.push({
  //           data: lineAbThreshold,
  //           label: 'threshold',
  //           pointRadius: 10,
  //           showLine: false,
  //           pointStyle: 'triangle'
  //         });
  //       }
  //       if (lineAbIR.length > 0) {
  //         this.chartData.push({
  //           data: lineAbIR,
  //           label: 'interquartile_range',
  //           pointRadius: 10,
  //           showLine: false,
  //           pointStyle: 'line'
  //         });
  //       }
  //       if (lineAbLS.length > 0) {
  //         this.chartData.push({
  //           data: lineAbLS,
  //           label: 'level_shift',
  //           pointRadius: 10,
  //           showLine: false,
  //           pointStyle: 'rect'
  //         });
  //       }
  //       if (lineAbSeasonal.length > 0) {
  //         this.chartData.push({
  //           data: lineAbSeasonal,
  //           label: 'seasonal',
  //           pointRadius: 10,
  //           showLine: false,
  //           pointStyle: 'star'
  //         });
  //       }
  //     });
  //   } else {
  //     // get data and redraw
  //     this.dataSeries = [];
  //     // get data from bucket
  //     this.dataService.getData().subscribe(res => {
  //       let points = [];
  //       console.log(res);
  //       if (res.status === 'SUCCESS') {
  //         let series = res.request.series;
  //         if (series.length > 0) {
  //           points = series[0].metrics;
  //           this.yLabel = series[0].name;
  //         }
  //       }
  //       let lineNormal = [];
  //       let lineAbSpike = [];
  //       let lineAbThreshold = [];
  //       let lineAbIR = [];
  //       let lineAbLS = [];
  //       let lineAbSeasonal = [];
  //       points.forEach(val => {
  //         const p = {
  //           x: moment(val.timestamp * 1000),
  //           y: val.value
  //         };
  //         lineNormal.push(p);
  //         if (val.anomaly_types !== null) {
  //           val.anomaly_types.forEach(type => {
  //             switch (type) {
  //               case 'spike':
  //                 lineAbSpike.push(p);
  //                 break;
  //               case 'threshold':
  //                 lineAbThreshold.push(p);
  //                 break;
  //               case 'interquartile_range':
  //                 lineAbIR.push(p);
  //                 break;
  //               case 'level_shift':
  //                 lineAbLS.push(p);
  //                 break;
  //               case 'seasonal':
  //                 lineAbSeasonal.push(p);
  //                 break;
  //               default:
  //                 break;
  //             }
  //           });
  //         }
  //       });

  //       this.chartData = [];
  //       this.chartData.push({
  //         data: lineNormal,
  //         label: this.yLabel
  //       });

  //       if (lineAbSpike.length > 0) {
  //         this.chartData.push({
  //           data: lineAbSpike,
  //           label: 'spike',
  //           pointRadius: 10,
  //           showLine: false,
  //           pointStyle: 'cross'
  //         });
  //       }

  //       if (lineAbThreshold.length > 0) {
  //         this.chartData.push({
  //           data: lineAbThreshold,
  //           label: 'threshold',
  //           pointRadius: 10,
  //           showLine: false,
  //           pointStyle: 'triangle'
  //         });
  //       }
  //       if (lineAbIR.length > 0) {
  //         this.chartData.push({
  //           data: lineAbIR,
  //           label: 'interquartile_range',
  //           pointRadius: 10,
  //           showLine: false,
  //           pointStyle: 'line'
  //         });
  //       }
  //       if (lineAbLS.length > 0) {
  //         this.chartData.push({
  //           data: lineAbLS,
  //           label: 'level_shift',
  //           pointRadius: 10,
  //           showLine: false,
  //           pointStyle: 'rect'
  //         });
  //       }
  //       if (lineAbSeasonal.length > 0) {
  //         this.chartData.push({
  //           data: lineAbSeasonal,
  //           label: 'seasonal',
  //           pointRadius: 10,
  //           showLine: false,
  //           pointStyle: 'star'
  //         });
  //       }
  //     });
  //   }
  // }
}
