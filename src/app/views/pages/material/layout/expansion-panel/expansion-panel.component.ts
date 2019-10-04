import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TokenStorage } from '../../../../../../Services/token-storage.service';
import { SocialmediaService } from '../../../../../../Services/socialmedia.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../ConfirmationDialog/confirmation_dialog.service';

const basicPanel = {
	beforeCodeTitle: 'Link your social media accounts',
		htmlCode: `
<mat-accordion>
  <mat-expansion-panel>
    <mat-expansion-panel-header>
      <mat-panel-title>
        Personal data
      </mat-panel-title>
	  <mat-panel-description>
        Type your name and age
      </mat-panel-description>
    </mat-expansion-panel-header>
    <mat-form-field>
      <input matInput placeholder="First name">
    </mat-form-field>
    <mat-form-field>
      <input matInput placeholder="Age">
    </mat-form-field>
  </mat-expansion-panel>
  <mat-expansion-panel (opened)="panelOpenState = true"
    (closed)="panelOpenState = false">
    <mat-expansion-panel-header>
      <mat-panel-title>
        Self aware panel
      </mat-panel-title>
      <mat-panel-description>
        Currently I am {{panelOpenState ? 'open' : 'closed'}}
      </mat-panel-description>
    </mat-expansion-panel-header>
    <p>I'm visible because I am open</p>
  </mat-expansion-panel>
</mat-accordion>
`,
		tsCode: `
import {Component} from '@angular/core';\n
/**
* @title Basic expansion panel
*/
@Component({
  selector: 'expansion-overview-example',
  templateUrl: 'expansion-overview-example.html',
  styleUrls: ['expansion-overview-example.css'],
})
export class ExpansionOverviewExample {
  panelOpenState: boolean = false;
}
`,
		cssCode: ``,
		viewCode: ``,
		isCodeVisible: false,
		isExampleExpanded: true
	};

export interface DialogData {
	customer_ID: string;
	dev_token: string;
}

let linkedemail: string;

@Component({
	selector: 'kt-expansion-panel',
	templateUrl: './expansion-panel.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [`
.example-headers-align .mat-expansion-panel-header-title,
.example-headers-align .mat-expansion-panel-header-description {
  flex-basis: 0;
}
.example-headers-align .mat-expansion-panel-header-description {
  justify-content: space-between;
  align-items: center;
}
	`]
})
export class ExpansionPanelComponent implements OnInit {

	twitvalue: string;
	googlevalue: string;
	iscustomerID: string;
	isAdsDevToken: string;
	isAuthgoogle: boolean;
	isAuthtwitter: boolean;
	isAvail: boolean = true;

	responsedata: string;
	arrayres: any[];

	ads_devtoken: string;
	customer_ID: string;

	exampleBasicPanel;

	constructor(
		private tokenstorage: TokenStorage,
		public service: SocialmediaService,
		private dialog: MatDialog,
		private Confirm_Dialog_Service: ConfirmationDialogService
	) { }

	Googleurl() {
		this.service.GoogleAuthurl().subscribe((response) => {
			location.href = response;
		});
	}

	Twitterurl() {
		this.service.TwitterAuthurl().subscribe((response) => {
			location.href = response;
		});
	}

	onChange(event) {
		var target = event.target || event.srcElement || event.currentTarget;
		var idAttr = target.attributes.id;
		linkedemail = idAttr.nodeValue;
	}

	//Confirmation Dialog
	ConfirmationDialogOpen() {
		this.Confirm_Dialog_Service.confirm('Please confirm..', 'Do you really want to ... ?')
			.then((confirmed) => console.log('User confirmed:', confirmed))
			.catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
			width: '400px',
			height: '250px',
			disableClose: true,
			data: { customer_ID: this.customer_ID, dev_token: this.ads_devtoken }
		});

		dialogRef.afterClosed().subscribe(result => {    

		});

	}

	ngOnInit() {
		this.exampleBasicPanel = basicPanel;
		this.tokenstorage.getUserName().subscribe((value) => {
			var username = value;
			this.service.getAuthUserName(username).subscribe((data) => {
				this.responsedata = JSON.stringify(data);
				this.arrayres = data;
				this.iscustomerID = data["CustomerID"];
				this.isAdsDevToken = data["AdsDevToken"];

				for (var j = 0; j < data.length; j++) {
					if (data[j]["GoogleLinkedEmail"] != 'N/A') {
						this.isAuthgoogle = true;
					}

					if (data[j]["TwitterLinkedEmail"] != 'N/A') {
						this.isAuthtwitter = true;
					}

				}
			});
		});
	}
}

@Component({
	//selector: 'Dialog',
	templateUrl: 'Dialog.component.html',
})
export class DialogOverviewExampleDialog {

	ads_devtoken: string;
	customer_ID: string;

	constructor(
		private dialogtoastr: ToastrService,
		private dialog_service: SocialmediaService,
		public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

	onNoClick(): void {
		this.dialogRef.close();
	}

	submit(data): void {
		this.customer_ID = data["customer_ID"];
		this.ads_devtoken = data["dev_token"];

		if (this.customer_ID != undefined && this.ads_devtoken != undefined) {
			this.dialog_service.updateDevTokenCustID(linkedemail, this.customer_ID, this.ads_devtoken).subscribe((res) => {
				if (res == false) {
					this.dialogtoastr.error("Data not saved..!!");
				}
				else {
					this.dialogRef.close();
					this.dialogtoastr.success("Data save successfully..!", null, {
						timeOut: 2000,
					});
					setTimeout(() => {
						location.reload();
					}, 3000);

				}
			});
		}
		else {
			this.dialogtoastr.error("Please fill the detail");
		}
	}

}
