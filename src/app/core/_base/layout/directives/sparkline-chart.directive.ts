// Angular
import { AfterViewInit, Directive, ElementRef, Input, OnChanges } from '@angular/core';
// Chart
import { Chart } from 'chart.js';
// LayoutConfig
import { LayoutConfigService } from '../../layout/services/layout-config.service';

export interface SparklineChartOptions {
	// array of numbers
	data: number[];
	// chart line color
	color: string;
	// chart line size
	border: number;
	fill?: boolean;
	tooltip?: boolean;
	labels: any[];
	type: string;
}

/**
 * Configure sparkline chart
 */
@Directive({
	selector: '[ktSparklineChart]',
	exportAs: 'ktSparklineChart'
})
export class SparklineChartDirective implements AfterViewInit, OnChanges {
	// Public properties
	@Input() options: SparklineChartOptions;
	// Private properties
	private chart: Chart;

	/**
	 * Directive Constructor
	 *
	 * @param el: ElementRef
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private el: ElementRef, private layoutConfigService: LayoutConfigService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */
	ngOnChanges(): void {
		
		if (this.options != undefined) {
			this.initChart(this.el.nativeElement, this.options.data, this.options.color, this.options.border, this.options.fill, this.options.tooltip, this.options.labels, this.options.type);
		}
	}
	/**
	 * After view init
	 */

	ngAfterViewInit(): void {
		if (this.options != undefined) {
			this.initChart(this.el.nativeElement, this.options.data, this.options.color, this.options.border, this.options.fill, this.options.tooltip, this.options.labels, this.options.type);
		}
	}

	//initSparkChart() {
	//	this.initChart(this.el.nativeElement, this.options.data, this.options.color, this.options.border, this.options.fill, this.options.tooltip);
	//}

	/**
	 * Init chart
	 * @param src: any
	 * @param data: any
	 * @param color: any
	 * @param border: any
	 * @param fill: any
	 * @param tooltip: any
	 * @param labels: any
	 * @param type: any
	 */
	initChart(src, data, color, border, fill, tooltip, labels, type) {
		if (src.length === 0) {
			return;
		}

		// set default values
		fill = (typeof fill !== 'undefined') ? fill : false;
		tooltip = (typeof tooltip !== 'undefined') ? tooltip : false;

		var config;


		if (type == "line") {
			config = {
				type: type,
				data: {
					labels: labels,
					datasets: [{
						label: '',
						borderColor: color,
						borderWidth: border,

						pointHoverRadius: 4,
						pointHoverBorderWidth: 12,
						pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
						pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
						pointHoverBackgroundColor: this.layoutConfigService.getConfig('colors.state.danger'),
						pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),
						fill: false,
						data: data,
					}]
				},
				options: {
					title: {
						display: false,
					},
					tooltips: {
						enabled: true,
						intersect: false,
						mode: 'nearest',
						xPadding: 10,
						yPadding: 10,
						caretPadding: 10,
						
						bodySpacing: 5,
						
						displayColors: false,
						backgroundColor: this.layoutConfigService.getConfig('colors.state.brand'),
						titleFontColor: '#ffffff',
						cornerRadius: 4,
						footerSpacing: 0,
						titleSpacing: 0
					},
					legend: {
						display: false,
						labels: {
							usePointStyle: false
						}
					},
					responsive: true,
					maintainAspectRatio: true,
					hover: {
						mode: 'index'
					},
					scales: {
						xAxes: [{
							display: false,
							gridLines: false,
							scaleLabel: {
								display: true,
								labelString: 'Month'
							}
						}],
						yAxes: [{
							display: false,
							gridLines: false,
							scaleLabel: {
								display: true,
								labelString: 'Value'
							},
							ticks: {
								beginAtZero: true
							}
						}]
					},

					elements: {
						point: {
							radius: 4,
							borderWidth: 12
						},
					},
					layout: {
						padding: {
							left: 0,
							right: 10,
							top: 5,
							bottom: 0
						}
					}
				}
			};
		}
		else if(type == "pie") {
			config = {
				type: type,
				data: {
					labels: labels,
					datasets: [{
						label: '',
						borderWidth: border,
						data: data,
						backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"]
					}]
				}
			};
		}
		

		this.chart = new Chart(src, config);
	}

	/**
	 * Returns the chart
	 */
	getChart() {
		return this.chart;
	}
}
