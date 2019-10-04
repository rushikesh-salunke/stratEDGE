import { Injectable, Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { parse } from 'querystring';
import { Globals } from '../Global/globals';
import { UtilsService } from './util.service';

@Injectable({
  providedIn: 'root'
})

export class AnalyticService {

  constructor(private http: Http, private _globals: Globals, private utils: UtilsService) { }

  /*************** Get twitter Entities ****************/
  public GetTwitterEntities(): Observable<any> {
    return this.http.get(`${this._globals.url}/TwitterEntity`)
      .pipe(map((response: Response) => {
        return response.json();
      }), catchError((error: Response) => {
        return throwError('Entities fetch failed.');
      }));
  }


  /****************** Get twitter Granularity *********************/
  public GetTwitterGranularity(): Observable<any> {
    return this.http.get(`${this._globals.url}/TwitterGranularity`)
      .pipe(map((response: Response) => {
        return response.json();
      }), catchError((error: Response) => {
        return throwError('Granularity fetch failed.');
      }));
  }

  /***************** Get twitter matric group *********************/
  public GetTwitterMatricGroup(): Observable<any> {
    return this.http.get(`${this._globals.url}/TwitterMatricGroup`)
      .pipe(map((response: Response) => {
        return response.json();
      }), catchError((error: Response) => {
        return throwError('Matric Group fetch failed.');
      }));
  }

  /****************** Get twitter placement *********************/
  public GetTwitterPlacement(): Observable<any> {
    return this.http.get(`${this._globals.url}/TwitterPlacement`)
      .pipe(map((response: Response) => {
        return response.json();
      }), catchError((error: Response) => {
        return throwError('Placement fetch failed.');
      }));
  }

  /******************* Get campaign ***********************/
  public GetCampaign(platform_id, UserAccessToken): Observable<any> {
    return this.http.get(`${this._globals.url}/Campaign?platform_id=` + platform_id + `&UserToken=` + UserAccessToken)
      .pipe(map((response: Response) => {
        return response.json();
      }), catchError((error: Response) => {
        return throwError('Campaign fetch failed.');
      }));
  }

  /******************* Get analytics data *********************/
  public GetAnalyticsData(UserAccessToken, Platform, Entity, Campaign, StartDate, EndDate): Observable<any> {
    return this.http.get(`${this._globals.url}/Analytics?UserAccessToken=` + UserAccessToken + `&Platform=` + Platform + `&Entity=` + Entity + `&Campaign=` + Campaign + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(map((response: Response) => {
        return response.json();
      }), catchError((error: Response) => {
        return throwError('AnalyticsData fetch failed.');
      }));
  }

	/******************* Get analytics data *********************/
	public GetTotalData(UserAccessToken, StartDate, EndDate): Observable<any> {
		return this.http.get(`${this._globals.url}/TotalValues?UserAccessToken=` + UserAccessToken + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
			.pipe(map((response: Response) => {
				return response.json();
			}), catchError((error: Response) => {
				return throwError('Records fetch failed.');
			}));
	}


	/******************** Update Google Custoer ID and DevToken ************************/
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
