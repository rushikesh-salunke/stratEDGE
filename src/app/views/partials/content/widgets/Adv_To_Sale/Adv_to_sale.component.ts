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
	selector: 'kt-AdvSale',
	templateUrl: './Adv_to_sale.component.html',
	styleUrls: ['./Adv_to_sale.component.scss']
})
export class AdvToSaleComponent implements OnInit {

	// Public properties
	@Input() data: { labels: string[], datasets: any[] };
	@Input() type: string = 'line';
	@ViewChild('chart1') chart1: ElementRef;

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
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {

		this.EndDate = moment.utc(new Date).format("YYYY-MM-DD");
		this.StartDate = moment().subtract(3, 'M').format('YYYY-MM-DD');
		var Tota_Amount_Spent = [];
		var Total_Conversion = [];
		var R_Date = [];

		this.tokenservice.getAccessToken().subscribe((UserAccessToken) => {
			this.service.GetTotalData(UserAccessToken, this.StartDate, this.EndDate).subscribe((Total_Data) => {
				for (var j = 0; j < Total_Data.length; j++) {
					R_Date.push(Total_Data[j]["engagment_Date"]);
					Tota_Amount_Spent.push(Total_Data[j]["Total_Amount_Spent"]);
					Total_Conversion.push(Total_Data[j]["Total_Conversion"]);

				}
				console.log(Total_Conversion);
				if (Total_Data.length > 0) {
					if (!this.data) {
						const color = Chart.helpers.color;
						this.data = {
							labels: R_Date,
							datasets: [
								{
									fill: false,
									label: 'Total Amount Spent',
									yAxisID: 'Total_Amount_Spent',
									data: Tota_Amount_Spent,
									borderColor: color(this.layoutConfigService.getConfig('colors.state.danger')).alpha(0.6).rgbString()
									//backgroundColor: color(this.layoutConfigService.getConfig('colors.state.danger')).alpha(0.6).rgbString(),
									//borderColor: color(this.layoutConfigService.getConfig('colors.state.danger')).alpha(0).rgbString(),
								},
								{
									fill: false,
									label: 'Total Conversion',
									yAxisID: 'Total_Conversion',
									data: Total_Conversion,
									borderColor: color(this.layoutConfigService.getConfig('colors.state.success')).alpha(0.6).rgbString()
									//backgroundColor: color(this.layoutConfigService.getConfig('colors.state.success')).alpha(0.6).rgbString(),
									//borderColor: color(this.layoutConfigService.getConfig('colors.state.success')).alpha(0).rgbString(),
								}
							]
						};
					}
					this.initChart(getMax(Tota_Amount_Spent), getMax(Total_Conversion));

				}

			});
		});
		function getMax(arr) {
			var max;
			for (var i = 0; i < arr.length; i++) {
				if (!max || parseFloat(arr[i]) > parseFloat(max))
					max = arr[i];
			}
			return max;
		}
	}

	private initChart(t_amount, t_conversion) {
		// For more information about the chartjs, visit this link
		// https://www.chartjs.org/docs/latest/getting-started/usage.html

		const chart = new Chart(this.chart1.nativeElement, {
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
						id: 'Total_Amount_Spent',
						type: 'linear',
						display: true,
						position: 'left'
						//,
						//ticks: {
						//	max: t_amount
						//}
					},
					{
						id: 'Total_Conversion',
						type: 'linear',
						display: true,
						position: 'right',
						gridLines: {
							drawOnChartArea: false,
						}
						//,
						//ticks: {
						//	max: t_conversion
						//}
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
