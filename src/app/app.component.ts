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

  ngOnInit() { }

  redrawGraph() {
    if (this.customUrl !== '') {
      this.dataService.getDataHttp(this.customUrl).subscribe(resp => {
        console.log(resp);
        this.generateData(resp);
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
}
