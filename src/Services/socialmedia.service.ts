import { Injectable, Component } from '@angular/core';
import { Http, Response } from '@angular/http';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { parse } from 'querystring';
import { Globals } from '../Global/globals';
import { UtilsService } from './util.service';

@Injectable({
	providedIn: 'root'
})

export class SocialmediaService {

	constructor(private http: Http, private _globals: Globals, private utils: UtilsService) { }
	
	/**************** Save Google Authenticate Data *********************/
	googleauth(AccessToken, RefreshToken, user_AccessToken, CustomerID, AdsDeveloperToken, UserEmailID) {
		const tblgoogleauth = {
			AccessToken: AccessToken,
			RefreshToken: RefreshToken,
			user_AccessToken: user_AccessToken,
			CustomerID: CustomerID,
			AdsDeveloperToken: AdsDeveloperToken,
			UserEmailID: UserEmailID
		};

		return this.http.post(`${this._globals.url}/GoogleAuth`, tblgoogleauth)
			.pipe(map((response: Response) => {
				return response.json();
			}), catchError((error: Response) => {
				return throwError('Something went wrong');
			}));

	}

	/************* Update TwitterAuthid  *****************/
	twitterauth(authid, username) {
		const tbltwitterauth = {
			AuthID: authid,
			UserName: username
		};

		return this.http.post(`${this._globals.url}/TwitterAuth`, tbltwitterauth)
			.pipe(map((response: Response) => {
				return response.json();
			}), catchError((error: Response) => {
				return throwError('Something went wrong');
			}));

	}
		
	/***************  Get Google URL  *****************/
	public GoogleAuthurl(): Observable<any> {
		return this.http.get(`${this._globals.url}/Google`)
			.pipe(map((response: Response) => {
				return response.json();
			}), catchError((error: Response) => {
				return throwError('Something went wrong');
			}));
	}

	/*************** Get callback URL ***************/
	public GoogleCode(code): Observable<any> {
		return this.http.get(`${this._globals.url}/GoogleAuth?code=` + code)
			.pipe(map((response: Response) => {
				return response.json();
			}), catchError((error: Response) => {
				return throwError('Something went wrong');
			}));
	}

	/*************  Get Twitter URL ****************/
	public TwitterAuthurl(): Observable<any> {
		return this.http.get(`${this._globals.url}/Twitter`)
			.pipe(map((response: Response) => {
				return response.json();
			}), catchError((error: Response) => {
				return throwError('Something went wrong');
			}));
	}

	public TwitterRequest(oauth_token, oauth_verifier): Observable<any> {
		return this.http.get(`${this._globals.url}/TwitterAuth?oauth_token=` + oauth_token + `&oauth_verifier=` + oauth_verifier)
			.pipe(map((response: Response) => {
				return response.json();
			}), catchError((error: Response) => {
				return throwError('Something went wrong');
			}));
	}

	/********  Get Auth UserName   ********/
	public getAuthUserName(UserName): Observable<any> {
		return this.http.get(`${this._globals.url}/AuthUser?UserName=` + UserName)
			.pipe(map((response: Response) => {
				return response.json();
			}), catchError((error: Response) => {
				return throwError('Something went wrong');
			}));
	}

	updateDevTokenCustID(linkedemail, cid, devtoken) {
		const tblupdate = {
			LinkedEmail: linkedemail,
			CID: cid,
			DevToken: devtoken
		};

		return this.http.post(`${this._globals.url}/UpdateGoogleAuthDetail`, tblupdate)
			.pipe(map((response: Response) => {
				return response.json();
			}), catchError((error: Response) => {
				return throwError('Something went wrong');
			}));
	}


}
