import { Injectable, Component} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, of, throwError, Subject, from } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { Globals } from '../Global/globals';
import { AccessData } from './AccessData';
import { Credential } from './Credential';
import { TokenStorage } from './token-storage.service';
import { UtilsService } from './util.service';
import { User } from '../app/core/auth/_models/user.model';

@Injectable({
	providedIn: 'root'
})

export class AuthenticationService {

	public onCredentialUpdated$: Subject<AccessData>;
	API_URL = this._globals.url;
	API_ENDPOINT_LOGIN = '/login';

	constructor(
		private _globals: Globals,
		private http: Http,
		private tokenStorage: TokenStorage,
		private util: UtilsService
	) {
		this.onCredentialUpdated$ = new Subject();
	}

	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T>(operation = 'operation', result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// Let the app keep running by returning an empty result.
			return from(result);
		};
	}


	/***************** User Registration ********************/
	registeruser(firstname, lastname, email, password, AccessToken) {
		const tblRegister = {
			FirstName: firstname,
			LastName: lastname,
			Email: email,
			Password: password,
			AccessToken: AccessToken
		};

		return this.http.post(`${this._globals.url}/Register`, tblRegister)
			.pipe(map((response: Response) => {
				return response.json();
			}), catchError((error: Response) => {
				return throwError('Something went wrong');
			}));
	}

	/******************* User Login **********************/
	public login(credential: Credential): Observable<AccessData[]> {
		return this.http.get(this.API_URL + this.API_ENDPOINT_LOGIN + '?' + this.util.urlParam(credential)).pipe(
			map((result: Response) => {
				return result.json();
			}),
			tap(this.saveAccessData.bind(this)),
			catchError(this.handleError('login', []))
		);
	}

	public loginuser(credential: Credential): Observable<User[]> {
		return this.http.get(this.API_URL + this.API_ENDPOINT_LOGIN + '?' + this.util.urlParam(credential)).pipe(
			map((result: Response) => {
				return result.json();
			}),
			catchError(this.handleError('login', []))
		);
	}


	/**
	 * Save access data in the storage
	 * @private
	 * @param {AccessData} data
	 */
	private saveAccessData(accessData: AccessData) {
		if (typeof accessData !== 'undefined') {
			this.tokenStorage
				.setAccessToken(accessData.accessToken)
				//.setRefreshToken(accessData.refreshToken)
				.setUserRoles(accessData.roles)
				.setFullName(accessData.fullname)
				.setUserName(accessData.username);
			this.onCredentialUpdated$.next(accessData);
		}
	}

}
