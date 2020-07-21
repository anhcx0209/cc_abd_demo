import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

export type MetricPoint = { x: any, y: any }
export type MetaPoint = { name: string, color: string }

const META_POINTS = [
  { name: 'threshold', color: 'red' },
  { name: 'spike', color: 'blue' },
  { name: 'interquartile_range', color: 'orange' },
  { name: 'level_shift', color: 'violet' },
  { name: 'seasonal', color: 'green' },
];

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements AfterViewInit {

  @ViewChild('chartDiv') chartContainer: ElementRef;
  @Input() private data: Array<any>;

  private margin: any = { top: 10, right: 30, bottom: 30, left: 60 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;

  private idleTimeout;
  private x;
  private y;
  private line;
  private brush;
  private svg;

  constructor() { }

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart() {
    let element = this.chartContainer.nativeElement;

    this.width = 1000 - this.margin.left - this.margin.right;
    this.height = 600 - this.margin.top - this.margin.bottom;

    let svg = d3.select("#dataViz")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    this.svg = svg;
    // chart plot area
    this.chart = svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // Add X axis --> it is a date format
    this.x = d3.scaleTime().domain(d3.extent(this.data, function (d) { return d.x; })).range([0, this.width]);
    let x = d3.scaleTime().domain(d3.extent(this.data, function (d) { return d.x; })).range([0, this.width]);
    this.xAxis = svg.append("g").attr("transform", "translate(0," + this.height + ")").call(d3.axisBottom(this.x));

    // Add Y axis
    this.y = d3.scaleLinear().domain([0, d3.max(this.data, function (d) { return +d.y; })]).range([this.height, 0]);
    let y = d3.scaleLinear().domain([0, d3.max(this.data, function (d) { return +d.y; })]).range([this.height, 0]);
    this.yAxis = svg.append("g").call(d3.axisLeft(this.y));

    // Add a clipPath: everything out of this area won't be drawn.
    let clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("x", 0)
      .attr("y", 0);

    // Add brushing
    let vm = this;
    this.brush = d3.brushX()                        // Add the brush feature using the d3.brush function
      .extent([[0, 0], [this.width, this.height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", function () {
        let extent = d3.event.selection;
        let x = d3.scaleTime().domain(d3.extent(vm.data, function (d) { return d.x; })).range([0, vm.width]);

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!extent) {
          if (!vm.idleTimeout) return vm.idleTimeout = setTimeout(vm.idled, 350); // This allows to wait a little bit
          x.domain([4, 8]);
        } else {
          x.domain([x.invert(extent[0]), x.invert(extent[1])]);
          vm.line.select(".brush").call(vm.brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and line position
        vm.xAxis.transition().duration(1000).call(d3.axisBottom(x));
        vm.line
          .select('.line')
          .transition()
          .duration(1000)
          .attr("d", d3.line<MetricPoint>()
            .x(function (d) { return x(d.x) })
            .y(function (d) { return y(d.y) })
          );
        // draw the point
        vm.svg.selectAll('.circle').attr("cx", function (d) { return x(d.x) }).attr("cy", function (d) { return y(d.y); });
      }); // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the line variable: where both the line and the brush take place
    META_POINTS.forEach(sp => this.drawCircles(svg, sp));
    this.line = svg.append('g').attr("clip-path", "url(#clip)")

    // Add the line
    this.line.append("path")
      .datum(this.data)
      .attr("class", "line")  // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line<MetricPoint>()
        .x(function (d) { return x(d.x) })
        .y(function (d) { return y(d.y) })
      );

    // Add the brushing
    this.line
      .append("g")
      .attr("class", "brush")
      .call(this.brush);

    // Double Click
    vm = this;
    svg.on("dblclick", function () {
      let x = d3.scaleTime().domain(d3.extent(vm.data, function (d) { return d.x; })).range([0, vm.width]);
      x.domain(d3.extent(vm.data, function (d) { return d.x; }))
      vm.xAxis.transition().call(d3.axisBottom(x))
      vm.line
        .select('.line')
        .transition()
        .attr("d", d3.line<MetricPoint>()
          .x(function (d) { return x(d.x) })
          .y(function (d) { return y(d.y) })
        );
      META_POINTS.forEach(sp => vm.drawCircles(vm.svg, sp));
    });
  }

  idled() { this.idleTimeout = null; }

  drawCircles(svg, metaPoint: MetaPoint) {
    let x = d3.scaleTime().domain(d3.extent(this.data, function (d) { return d.x; })).range([0, this.width]);
    let y = d3.scaleLinear().domain([0, d3.max(this.data, function (d) { return +d.y; })]).range([this.height, 0]);
    const points = this.data.filter(ele => { return (Array.isArray(ele.anomaly_types) && ele.anomaly_types.indexOf(metaPoint.name) !== -1) });
    // clear
    svg.selectAll("circles").remove();

    let div = d3.select("#dataViz").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // draw
    svg.selectAll("circles").data(points).enter().append("circle").attr("class", "circle").attr("fill", metaPoint.color).attr("stroke", "none")
      .attr("cx", function (d) { return x(d.x) })
      .attr("cy", function (d) { return y(d.y) })
      .attr("r", 5)
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(d3.timeFormat("%e %B")(d.x) + "<br/>" + d.y + "</br>" + d.anomaly_types)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });
  }

}
