import { Component, OnInit, ChangeDetectionStrategy, NgModule, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SocialmediaService } from '../../../../../../Services/socialmedia.service';
import { TokenStorage } from '../../../../../../Services/token-storage.service';
import { AnalyticService } from '../../../../../../Services/Analytics.service';
//import { SpinnerButtonOptions } from '../../../../../partials/content/general/spinner-button/button-options.interface';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MatOption } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { forEach } from '@angular/router/src/utils/collection';

const moment = _rollupMoment || _moment;

@Component({
  templateUrl: './chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class ChartComponent implements OnInit {
  campaign_list: any[];
  platform_value: string;
  entity_value: string;
  campaign_value: string;
  start_date: string;
  end_date: string;
  UserToken: string;
  toppings = new FormControl();
  chart: AmChart;
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allPlacement') private allPlacement: MatOption;
  searchUserForm: FormGroup;
  placementForm: FormGroup;


  constructor(
	private fb: FormBuilder,
	private service: SocialmediaService,
	private analytics_service: AnalyticService,
    private token_service: TokenStorage,
    private Amcharts: AmChartsService,
    private toastr: ToastrService
  ) { }

  //spinner: SpinnerButtonOptions = {
  //  active: false,
  //  spinnerSize: 18,
  //  raised: true,
  //  buttonColor: 'primary',
  //  spinnerColor: 'accent',
  //  fullWidth: false
  //};

  p_selected = '0';
  camp_selected = 'Campaign';

  ListPlacement: any[] = [{ id: 1, value: 'Google' }, { id: 2, value: 'Twitter' }];

  onChange(newvalue) {
    let array = newvalue.value;
    for (let i = 0; i < array.length; i++) {
      if (array[0] == '0') {
        this.platform_value = '0';
      }
      else {
        this.platform_value = array[i];
      }
	}
	this.analytics_service.GetCampaign(this.platform_value, this.UserToken).subscribe((response) => {
      this.campaign_list = response;
    });
  }

  getdata(toppings) {
    console.log(toppings);
    return toppings.value[0];
  }

  ngOnInit() {

    //this.start_date = new Date();
    //this.end_date = new Date();

    this.token_service.getAccessToken().subscribe((token) => {
	this.UserToken = token;
	this.analytics_service.GetCampaign(0, this.UserToken).subscribe((response) => {
        this.campaign_list = response;
      });
    });

    this.searchUserForm = this.fb.group({
      CampaignList: new FormControl()
    });

    this.placementForm = this.fb.group({
      PlacementList: new FormControl()
    });

  }

  /************** All select option ***************/
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.searchUserForm.controls.CampaignList
        .patchValue([...this.campaign_list.map(item => item.CampaignID), 0]);
    } else {
      this.searchUserForm.controls.CampaignList.patchValue([]);
    }
  }

  tosslePerOne(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      console.log("false");
      return false;
    }
    if (this.searchUserForm.controls.CampaignList.value.length == this.campaign_list.length)
      this.allSelected.select();
  }

  PlacementAllSelection() {
    if (this.allPlacement.selected) {
      this.placementForm.controls.PlacementList
        .patchValue([...this.ListPlacement.map(item => item.id), 0]);
    } else {
      this.placementForm.controls.PlacementList.patchValue([]);
    }
  }

  placementPerOne(all) {
    if (this.allPlacement.selected) {
      this.allPlacement.deselect();
      return false;
    }
    if (this.placementForm.controls.PlacementList.value.length == this.ListPlacement.length)
      this.allPlacement.select();
  }


  dataprovid = [{
    "date": "2019-02-15 02:00:00",
    "twitterclicks": 5,
    "googleclicks": 10,
    "facebookclicks": 4
  }, {
    "date": "2019-02-15 03:00:00",
    "twitterclicks": 3,
    "googleclicks": 30,
    "facebookclicks": 6
  }, {
    "date": "2019-12-15 04:00:00",
    "twitterclicks": 2,
    "googleclicks": 20,
    "facebookclicks": 10
  }];

  submit(startdate, enddate) {
    //this.spinner.active = true;
    var user_campaign = this.searchUserForm.get('CampaignList').value;
    var platform_val = this.placementForm.get('PlacementList').value;
    
    startdate = moment.utc(startdate).format("YYYY-MM-DD");
    enddate = moment.utc(enddate).format("YYYY-MM-DD");

	this.analytics_service.GetAnalyticsData(this.UserToken, platform_val, this.camp_selected, user_campaign, startdate, enddate).subscribe((analytics) => {
      var res = JSON.parse(analytics);
      var graph = [];
      var chartscroll = new Array();
      for (var j = 0; j < res["graph"].length; j++) {

        var item = {};
        item["id"] = "g" + j + 1;
        item["balloonText"] = "<div style='margin:5px; width:360px; margin-left:-70px; font-size:15px;'>" + res["graph"][j] + ":<b>[[value]]</b><br />Impression: <b>[[Impression]]</b><br />CampaignID: <b>[[CampaignID]]</b>";
        item["bullet"] = "round";
        item["bulletSize"] = 6;
        //item["lineColor"] = "#2e9aa2";
        item["lineThickness"] = 2;
        item["fillAlphas"] = 0;
        item["valueField"] = res["graph"][j];
        //item["type"] = "smoothedLine";

        graph.push(item);

        var scroll = {};
        scroll["graph"] = "g" + j + 1;
        scroll["gridAlpha"] = 0;
        scroll["scrollbarHeight"] = 80;
        scroll["backgroundAlpha"] = 0;
        scroll["selectedBackgroundAlpha"] = 0.1;
        scroll["selectedBackgroundColor"] = "#888888";
        scroll["graphFillAlpha"] = 0;
        scroll["graphLineAlpha"] = 0.2;
        scroll["graphLineColor"] = "#c2c2c2";
        scroll["selectedGraphFillAlpha"] = 0;
        scroll["selectedGraphLineAlpha"] = 1;
        scroll["autoGridCount"] = true;
        scroll["color"] = "#AAAAAA";

        chartscroll.push(scroll);
        
      }

      if (res["data"].length > 0) {
        this.chart = this.Amcharts.makeChart("chartdiv", {
          "type": "serial",
          "theme": "none",
          "marginRight": 80,
          "dataProvider": res["data"],
          "valueAxes": [{
            "position": "left",
            "title": "Click",
            "axisAlpha": 0
          }],
          "graphs": graph,
          "chartScrollbar": chartscroll,
          "chartCursor": {
            "categoryBalloonDateFormat": "LL:NN A, DD MMMM",
            "cursorPosition": "mouse"
          },
          "categoryField": "date",
          "dataDateFormat": "YYYY-MM-DD HH",
          "categoryAxis": {
            "dateFormats": [{ period: 'fff', format: 'JJ:NN:SS' },
            { period: 'ss', format: 'JJ:NN:SS' },
            { period: 'mm', format: 'JJ:NN' },
            { period: 'hh', format: 'LL:NN A' },
            { period: 'DD', format: 'MMM DD' },
            { period: 'WW', format: 'MMM DD' },
            { period: 'MM', format: 'MMM' },
            { period: 'YYYY', format: 'YYYY' }],
            "minPeriod": "hh",
            "parseDates": true
          }
          //"export": {
          //  "enabled": true
          //}
        });
        //this.spinner.active = false;
      }
      else {
        //this.spinner.active = false;
        //this.toastr.warning("Data not found..!!");
      }
    });
  }
}
  

