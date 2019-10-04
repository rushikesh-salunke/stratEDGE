import { Component, Input, OnInit } from '@angular/core';
import { SparklineChartOptions } from '../../../../../core/_base/layout';

@Component({
	selector: 'pieWidget',
	templateUrl: './pieWidget.component.html',
	styleUrls: ['./pieWidget.component.scss']
})
export class pieWidgetComponent implements OnInit {

	@Input() value: string | number;
	@Input() desc: string;
	@Input() options: SparklineChartOptions;

	constructor() {
	}

	ngOnInit() {
	}

}
