// Angular
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// Layout config
import { LayoutConfigService } from '../../../../../core/_base/layout';

import { TokenStorage } from '../../../../../../Services/token-storage.service';
import { AnalyticService } from '../../../../../../Services/Analytics.service';
import moment = require('moment');

/**
 * Sample components with sample data
 */
@Component({
	selector: 'kt-widget12',
	templateUrl: './widget12.component.html',
	styleUrls: ['./widget12.component.scss']
})
export class Widget12Component implements OnInit {

	// Public properties
	@Input() data: { labels: string[], datasets: any[] };
	@Input() type: string = 'line';
	@ViewChild('chart') chart: ElementRef;

	StartDate: any;
	EndDate: any;

	/**
	 * Component constructor
	 * @param layoutConfigService
	 */
	constructor(
		private layoutConfigService: LayoutConfigService,
		private tokenservice: TokenStorage,
		private service: AnalyticService
	) {}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {

		this.EndDate = moment.utc(new Date).format("YYYY-MM-DD");
		this.StartDate = moment().subtract(3, 'M').format('YYYY-MM-DD');
		var Total_Engagement_Rate = [];
		var R_Date = [];

		this.tokenservice.getAccessToken().subscribe((UserAccessToken) => {
			this.service.GetTotalData(UserAccessToken, this.StartDate, this.EndDate).subscribe((Total_Data) => {
				for (var j = 0; j < Total_Data.length; j++) {
					R_Date.push(Total_Data[j]["engagment_Date"]);
					Total_Engagement_Rate.push(Total_Data[j]["Total_Engagement_Rate"]);

				}
				console.log(Total_Engagement_Rate);
				if (Total_Data.length > 0) {
					if (!this.data) {
						const color = Chart.helpers.color;
						this.data = {
							labels: R_Date,//['12 Jan', '22 Jan', '3 Jan', '4 Jan', '15 Jan', '6 Jan', '7 Jan'],
							datasets: [
								{
									fill: true,
									// borderWidth: 0,
									backgroundColor: color(this.layoutConfigService.getConfig('colors.state.brand')).alpha(0.6).rgbString(),
									borderColor: color(this.layoutConfigService.getConfig('colors.state.brand')).alpha(0).rgbString(),

									pointHoverRadius: 4,
									pointHoverBorderWidth: 12,
									pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
									pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
									pointHoverBackgroundColor: this.layoutConfigService.getConfig('colors.state.brand'),
									pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),

									data: Total_Engagement_Rate//[20, 40, 50, 25, 35, 60, 30]
								}
								//,
								//{
								//	fill: true,
								//	// borderWidth: 0,
								//	backgroundColor: color(this.layoutConfigService.getConfig('colors.state.brand')).alpha(0.2).rgbString(),
								//	borderColor: color(this.layoutConfigService.getConfig('colors.state.brand')).alpha(0).rgbString(),

								//	pointHoverRadius: 4,
								//	pointHoverBorderWidth: 12,
								//	pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
								//	pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
								//	pointHoverBackgroundColor: this.layoutConfigService.getConfig('colors.state.brand'),
								//	pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),

								//	data: [25, 45, 55, 30, 40, 65, 35]
								//}
							]
						};
					}
					//var maxval = Math.max(Total_Engagement_Rate);
					//alert(Math.ceil(Math.ceil(getMax(Total_Engagement_Rate)) / 10));
					this.initChart(Math.round(Math.ceil(getMax(Total_Engagement_Rate)) / 10) * 10);
					
				}

			});
		});
		function getMax(arr) {
			var max;
			for (var i = 0; i < arr.length; i++) {
				if (!max || parseFloat(arr[i]) > parseFloat(max))
					max = arr[i];
			}
			if (max == "0") {
				max = "1";
			}
			
			return max;
		}
		//if (!this.data) {
		//	const color = Chart.helpers.color;
		//	this.data = {
		//		labels: ['1 Jan', '2 Jan', '3 Jan', '4 Jan', '5 Jan', '6 Jan', '7 Jan'],
		//		datasets: [
		//			{
		//				fill: true,
		//				// borderWidth: 0,
		//				backgroundColor: color(this.layoutConfigService.getConfig('colors.state.brand')).alpha(0.6).rgbString(),
		//				borderColor: color(this.layoutConfigService.getConfig('colors.state.brand')).alpha(0).rgbString(),

		//				pointHoverRadius: 4,
		//				pointHoverBorderWidth: 12,
		//				pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
		//				pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
		//				pointHoverBackgroundColor: this.layoutConfigService.getConfig('colors.state.brand'),
		//				pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),

		//				data: [20, 40, 50, 25, 35, 60, 30]
		//			},
		//			{
		//				fill: true,
		//				// borderWidth: 0,
		//				backgroundColor: color(this.layoutConfigService.getConfig('colors.state.brand')).alpha(0.2).rgbString(),
		//				borderColor: color(this.layoutConfigService.getConfig('colors.state.brand')).alpha(0).rgbString(),

		//				pointHoverRadius: 4,
		//				pointHoverBorderWidth: 12,
		//				pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
		//				pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
		//				pointHoverBackgroundColor: this.layoutConfigService.getConfig('colors.state.brand'),
		//				pointHoverBorderColor: Chart.helpers.color('#000000').alpha(0.1).rgbString(),

		//				data: [25, 45, 55, 30, 40, 65, 35]
		//			}
		//		]
		//	};
		//}
		//this.initChart();
	}

	private initChart(maxValue) {
		// For more information about the chartjs, visit this link
		// https://www.chartjs.org/docs/latest/getting-started/usage.html
		if (maxValue == "0") {
			maxValue = "1";
		}
		
		const chart = new Chart(this.chart.nativeElement, {
			type: this.type,
			data: this.data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				legend: false,
				scales: {
					xAxes: [{
						categoryPercentage: 0.35,
						barPercentage: 0.70,
						display: true,
						scaleLabel: {
							display: false,
							labelString: 'Month'
						},
						gridLines: false,
						ticks: {
							display: true,
							beginAtZero: true,
							fontColor: this.layoutConfigService.getConfig('colors.base.shape.3'),
							fontSize: 13,
							padding: 10,
							autoSkip: true,
							autoSkipPadding: 70
						}
					}],
					yAxes: [{
						categoryPercentage: 0.35,
						barPercentage: 0.70,
						display: true,
						scaleLabel: {
							display: false,
							labelString: 'Value'
						},
						gridLines: {
							color: this.layoutConfigService.getConfig('colors.base.shape.2'),
							drawBorder: true,
							offsetGridLines: false,
							drawTicks: false,
							borderDash: [3, 4],
							zeroLineWidth: 1,
							zeroLineColor: this.layoutConfigService.getConfig('colors.base.shape.2'),
							zeroLineBorderDash: [3, 4]
						},
						ticks: {
							max: 1,
							stepSize: 0.5,
							display: true,
							beginAtZero: true,
							fontColor: this.layoutConfigService.getConfig('colors.base.shape.3'),
							fontSize: 13,
							padding: 10
						}
					}]
				},
				title: {
					display: false
				},
				hover: {
					mode: 'index'
				},
				tooltips: {
					enabled: true,
					intersect: false,
					mode: 'nearest',
					bodySpacing: 5,
					yPadding: 10,
					xPadding: 10,
					caretPadding: 0,
					displayColors: false,
					backgroundColor: this.layoutConfigService.getConfig('colors.state.brand'),
					titleFontColor: '#ffffff',
					cornerRadius: 4,
					footerSpacing: 0,
					titleSpacing: 0
				},
				layout: {
					padding: {
						left: 0,
						right: 0,
						top: 5,
						bottom: 5
					}
				}
			}
		});
	}
}
