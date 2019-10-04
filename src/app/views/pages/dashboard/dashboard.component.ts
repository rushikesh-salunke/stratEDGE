// Angular
import { Component, OnInit } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Services
import { LayoutConfigService } from '../../../core/_base/layout';
// Widgets model
import { SparklineChartOptions } from '../../../core/_base/layout';
import { SparklineChartDirective } from '../../../core/_base/layout';
import { Widget4Data } from '../../partials/content/widgets/widget4/widget4.component';
import { TokenStorage } from '../../../../Services/token-storage.service';
import { AnalyticService } from '../../../../Services/Analytics.service';
import moment = require('moment');



@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
})


export class DashboardComponent implements OnInit {
	chartOptions1: SparklineChartOptions;
	chartOptions2: SparklineChartOptions;
	chartOptions3: SparklineChartOptions;
	chartOptions4: SparklineChartOptions;
	pieChartOption: SparklineChartOptions;

	startDate: any;
	EndDate: any;

	t_click: any;
	t_impression: any;
	t_conversion: any;
	t_amountspent: any;

	public doughnutChartLabels: string[];
	public doughnutChartData: number[];
	public doughnutChartType: string;

	constructor(
		private layoutConfigService: LayoutConfigService,
		private tokenservice: TokenStorage,
		private service: AnalyticService
	) {
	}

	//Sum of value
	getSum(total, num) {
		return total + num;
	}

	ngOnInit(): void {

		this.EndDate = moment.utc(new Date).format("YYYY-MM-DD");
		this.startDate = moment().subtract(3, 'M').format('YYYY-MM-DD');
		var Total_Amount_Spent = [];
		var Total_Impression = [];
		var Total_Conversion = [];
		var Total_Click = [];
		var Labels = [];

		this.tokenservice.getAccessToken().subscribe((UserToken) => {
			this.service.GetTotalData(UserToken, this.startDate, this.EndDate).subscribe((TotalData) => {
				
				for (var j = 0; j < TotalData.length; j++) {
					Total_Click.push(TotalData[j]["Total_Click"]);
					Labels.push(TotalData[j]["date"]);
					Total_Conversion.push(TotalData[j]["Total_Conversion"]);
					Total_Impression.push(TotalData[j]["Tota_Impression"]);
					Total_Amount_Spent.push(TotalData[j]["Total_Amount_Spent"]);
					if (j == (TotalData.length - 1)) {
						
						this.chartOptions1 = {
							data: Total_Click,
							color: this.layoutConfigService.getConfig('colors.state.brand'),
							border: 3,
							labels: Labels,
							type: 'line'
						};
						this.chartOptions2 = {
							data: Total_Conversion,
							color: this.layoutConfigService.getConfig('colors.state.danger'),
							border: 3,
							labels: Labels,
							type: 'line'
						};
						this.chartOptions3 = {
							data: Total_Impression,
							color: this.layoutConfigService.getConfig('colors.state.success'),
							border: 3,
							labels: Labels,
							type: 'line'
						};
						this.chartOptions4 = {
							data: Total_Amount_Spent,
							color: this.layoutConfigService.getConfig('colors.state.primary'),
							border: 3,
							labels: Labels,
							type: 'line'
						};

						//Display Total value of array
						this.t_amountspent = Math.round(Total_Amount_Spent.reduce(this.getSum));
						this.t_click = Math.round(Total_Click.reduce(this.getSum));
						this.t_conversion = Math.round(Total_Conversion.reduce(this.getSum));
						this.t_impression = Math.round(Total_Impression.reduce(this.getSum));

						//pie chart
						var Pie_value = [];
						var TotalSpent = Math.round(Total_Amount_Spent.reduce(this.getSum));
						var TotalConversion = Math.round(Total_Conversion.reduce(this.getSum));
						Pie_value.push(TotalSpent, TotalConversion);

						this.pieChartOption = {
							data: Pie_value,
							color: this.layoutConfigService.getConfig('colors.state.brand'),
							border: 1,
							labels: ['Tota Amount Spent', 'Total Conversion'],
							type: 'pie'
						}

						
						//this.doughnutChartData = ;
						//this.doughnutChartLabels = ;
						//this.doughnutChartType = 'pie';
					}
				}

			});
		});
	}

	

	chartClicked(e: any): void {
	}

	chartHovered(e: any): void {
	}

}
