import { Injectable, Component } from '@angular/core';
import { Http, Response } from '@angular/http';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { parse } from 'querystring';
import { Globals } from '../Global/globals';

@Injectable({
	providedIn: 'root'
})

export class TokenStorage {

	constructor(private http: Http, private _globals: Globals) { }
	
	/**
	 * Get access token
	 * @returns {Observable<string>}
	 */
	public getAccessToken(): Observable<string> {
		const token: string = <string>localStorage.getItem('accessToken');
		return of(token);
	}

	/**
	 * Get refresh token
	 * @returns {Observable<string>}
	 */
	public getRefreshToken(): Observable<string> {
		const token: string = <string>localStorage.getItem('refreshToken');
		return of(token);
	}

	/**
	   * Get UserName
	   * @returns {Observable<string>}
	   */
	public getUserName(): Observable<string> {
		const username: string = <string>localStorage.getItem('username');
		return of(username);
	}

	/**
	   * Get fullname
	   * @returns {Observable<string>}
	   */
	public getFullName(): Observable<string> {
		const fullname: string = <string>localStorage.getItem('fullname');
		return of(fullname);
	}

	/**
	 * Get user roles in JSON string
	 * @returns {Observable<any>}
	 */
	public getUserRoles(): Observable<any> {
		const roles: any = localStorage.getItem('userRoles');
		try {
			return of(JSON.parse(roles));
		} catch (e) { }
	}

	/**
	 * Set access token
	 * @returns {TokenStorage}
	 */
	public setAccessToken(token: string): TokenStorage {
		localStorage.setItem('accessToken', token);

		return this;
	}

	///**
	// * Set refresh token
	// * @returns {TokenStorage}
	// */
	//public setRefreshToken(token: string): TokenStorage {
	//	localStorage.setItem('refreshToken', token);

	//	return this;
	//}

	/**
	   * Set user name
	   * @returns {TokenStorage}
	   */
	public setUserName(username: string): TokenStorage {
		localStorage.setItem('username', username);

		return this;
	}

	/**
	   * Set full name
	   * @returns {TokenStorage}
	   */
	public setFullName(fullname: string): TokenStorage {
		localStorage.setItem('fullname', fullname);

		return this;
	}


	/**
	 * Set user roles
	 * @param roles
	 * @returns {TokenStorage}
	 */
	public setUserRoles(roles: any): any {
		if (roles != null) {
			localStorage.setItem('userRoles', JSON.stringify(roles));
		}

		return this;
	}

	/**
	 * Remove tokens
	 */
	public clear() {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('userRoles');
		localStorage.removeItem('username');
		localStorage.removeItem('fullname');
	}
}
