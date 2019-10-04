// Angular
import { Component, OnInit, Input } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';
import { TokenStorage } from '../../../../../../Services/token-storage.service';

@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user$: Observable<User>;

	UserName: string;

	@Input() showAvatar: boolean = true;
	@Input() showHi: boolean = true;
	@Input() showBadge: boolean = false;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private store: Store<AppState>, private service: TokenStorage) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.user$ = this.store.pipe(select(currentUser));
		this.service.getFullName().subscribe((FullName) => {
			this.UserName = FullName;
		});
	}

	/**
	 * Log out
	 */
	logout() {
		this.service.clear();
		this.store.dispatch(new Logout());
	}
}
