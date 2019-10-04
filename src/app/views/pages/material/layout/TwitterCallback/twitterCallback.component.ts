import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocialmediaService } from '../../../../../../Services/socialmedia.service';
import { TokenStorage } from '../../../../../../Services/token-storage.service';
import { Globals } from '../../../../../../Global/globals';

@Component({
  // selector: '',
  templateUrl: './twitterCallback.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: []
})
export class TwitterCallbackComponent implements OnInit {

  constructor(
	private route: ActivatedRoute,
	private service: SocialmediaService,
	private tokenstorage: TokenStorage,
    private _global: Globals
  ) { }

  ngOnInit() {
    /********* Get data from return Twitter callback url **********/
    const oauth_token: string = this.route.snapshot.queryParamMap.get('oauth_token');
    const oauth_verifier: string = this.route.snapshot.queryParamMap.get('oauth_verifier');

	/********** Save in database user details **********/
    this.service.TwitterRequest(oauth_token, oauth_verifier).subscribe((response) => {
      var rid = response;

	  /********** Get Username from localstorage ***********/
	  this.tokenstorage.getUserName().subscribe((value) => {
        var username = value;

			  /************ Update TwitterAuth id in database ************/
		this.service.twitterauth(rid, username).subscribe((data) => {
          window.location.href = this._global.TwitterWindow_href + oauth_token + '&oauth_verifier=' + oauth_verifier + '';
        });
      });
    });

  }
}
