import { Component, OnInit, ChangeDetectionStrategy, NgModule, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TokenStorage } from '../../../../../../Services/token-storage.service';
import { NgForm, FormGroup, FormBuilder, NgModel } from '@angular/forms';
import * as objectPath from 'object-path';
import { TranslateService } from '@ngx-translate/core';
//import { SpinnerButtonOptions } from '../../../../../partials/content/general/spinner-button/button-options.interface';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../../../../../Global/globals';
import { SocialmediaService } from '../../../../../../Services/socialmedia.service';

@Component({
 // selector: '',
  templateUrl: './GoogleCallback.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: []
})
export class GoogleCallbackComponent implements OnInit {

  exampleBasicPanel;
  public model: any = { customerid: '',adsdevtoken: '' };
  @ViewChild('f') f: NgForm;
  errors: any = [];
  accesstoken: any;
  refreshtoken: any;
  user_accesstoken: any;
  googlecode: string;
  UserEmailID: string;
  loading = false;

  //spinner: SpinnerButtonOptions = {
  //  active: false,
  //  spinnerSize: 18,
  //  raised: true,
  //  buttonColor: 'primary',
  //  spinnerColor: 'accent',
  //  fullWidth: false
  //};
  
  constructor(
    private route: ActivatedRoute,
	private tokenstorage: TokenStorage,
	private service: SocialmediaService,
    private toatr: ToastrService,
    private _global: Globals
  ) { }

  submit(customerid, adsdevtoken) {
    /********* Save Google data  *********/
	  if (customerid != '' && adsdevtoken != '') {
		  this.loading = true;
		  this.service.googleauth(this.accesstoken, this.refreshtoken, this.user_accesstoken, customerid, adsdevtoken, this.UserEmailID).subscribe((result) => {
		  window.location.href = this._global.GoogleWindow_href + this.googlecode + '&auth=gmail';
		  this.loading = false;
      });
    }
  }

	not_now() {
		this.service.googleauth(this.accesstoken, this.refreshtoken, this.user_accesstoken, null, null, null).subscribe((result) => {
      window.location.href = this._global.GoogleWindow_href + this.googlecode + '&auth=gmail';
    });
  }

  ngOnInit() {
    /****** get google code from return url ********/
    this.googlecode = this.route.snapshot.queryParamMap.get('code');

	  /******** Get Google Token  *********/
	  this.service.GoogleCode(this.googlecode).subscribe((response) => {
      this.accesstoken = response["Access_Token"];
      this.refreshtoken = response["Refresh_Token"];

      /******* Get user access token *******/
      this.tokenstorage.getAccessToken().subscribe((value) => {
        this.user_accesstoken = value;    
      });
    });

    this.tokenstorage.getUserName().subscribe((EmailID) => {
      this.UserEmailID = EmailID;
    });

  }
  
}
