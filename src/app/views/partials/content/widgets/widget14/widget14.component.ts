// Angular
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';
// Charts
import { Chart } from 'chart.js';

import { TokenStorage } from '../../../../../../Services/token-storage.service';
import { AnalyticService } from '../../../../../../Services/Analytics.service';
import moment = require('moment');

@Component({
	selector: 'kt-widget14',
	templateUrl: './widget14.component.html',
	styleUrls: ['./widget14.component.scss'],
})
export class Widget14Component implements OnInit {
	// Public properties
	@Input() title: string;
	@Input() desc: string;
	@Input() data: { labels: string[]; datasets: any[] };
	@ViewChild('chart') chart: ElementRef;

	StartDate: any;
	EndDate: any;

	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
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
	ngOnInit() {

		this.EndDate = moment.utc(new Date).format("YYYY-MM-DD");
		this.StartDate = moment().subtract(3, 'M').format('YYYY-MM-DD');
		var Total_Conversion_Rate = [];
		var R_Date = [];
		//Get User AccessToken
		this.tokenservice.getAccessToken().subscribe((UserAccessToken) => {
			this.service.GetTotalData(UserAccessToken, this.StartDate, this.EndDate).subscribe((Total_Data) => {
				for (var j = 0; j < Total_Data.length; j++) {
					R_Date.push(Total_Data[j]["engagment_Date"]);
					Total_Conversion_Rate.push(Total_Data[j]["Total_Conversion_Rate"]);
					
				}
				if (Total_Data.length > 0) {
					if (!this.data) {
						this.data = {
							labels: R_Date,//['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7', 'Label 8', 'Label 9', 'Label 10', 'Label 11', 'Label 12', 'Label 13', 'Label 14', 'Label 15', 'Label 16'],
							datasets: [
								{
									// label: 'dataset 1',
									backgroundColor: this.layoutConfigService.getConfig('colors.state.success'),
									data: Total_Conversion_Rate
									//	[
									//	15, 20, 25, 30, 25, 20, 15, 20, 25, 30, 25, 20, 15, 10, 15, 20
									//]
								}
								//, {
								//	// label: 'dataset 2',
								//	backgroundColor: '#f3f3fb',
								//	data: Total_Conversion_Rate
								//	//	[
								//	//	15, 20, 25, 30, 25, 20, 15, 20, 25, 30, 25, 20, 15, 10, 15, 20
								//	//]
								//}
							]
						};
						this.initChartJS();
					}
				}
				
			});
		});

		

		
	}

	/** Init chart */
	initChartJS() {
		// For more information about the chartjs, visit this link
		// https://www.chartjs.org/docs/latest/getting-started/usage.html

		const chart = new Chart(this.chart.nativeElement, {
			type: 'bar',
			data: this.data,
			options: {
				title: {
					display: false,
				},
				tooltips: {
					intersect: false,
					mode: 'nearest',
					xPadding: 10,
					yPadding: 10,
					caretPadding: 10
				},
				legend: {
					display: false
				},
				responsive: true,
				maintainAspectRatio: false,
				barRadius: 4,
				scales: {
					xAxes: [{
						display: true,
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
						stacked: true,
						ticks: {
							display: true,
							beginAtZero: true,
							fontColor: this.layoutConfigService.getConfig('colors.base.shape.3'),
							fontSize: 10,
							padding: 10,
							autoSkip: true,
							autoSkipPadding: 50
						}
					}],
					yAxes: [{
						display: true,
						stacked: true,
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
					}],
					ticks: {
						stepSize: 0.5,
						display: true,
						beginAtZero: true,
						fontColor: this.layoutConfigService.getConfig('colors.base.shape.3'),
						fontSize: 10,
						padding: 10
					}
				},
				layout: {
					padding: {
						left: 0,
						right: 0,
						top: 0,
						bottom: 0
					}
				}
			}
		});
	}
}
