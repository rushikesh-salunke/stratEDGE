import { Injectable } from '@angular/core';

@Injectable()

export class Globals {

	/*************** Local URL ***************/
	url: string = 'http://localhost/stratEDGE_Api/api';
	GoogleWindow_href: string = 'http://localhost:4200/material/layout/expansion-panel?code=';
	TwitterWindow_href: string = 'http://localhost:4200/material/layout/expansion-panel?oauth_token=';

	/***************** Live URL ******************/
	//url: string = 'https://seapi.gvmtechnologies.com/api';
	//GoogleWindow_href: string = 'https://stratedge.gvmtechnologies.com/material/layout/expansion-panel?code=';
	//TwitterWindow_href: string = 'https://stratedge.gvmtechnologies.com/material/layout/expansion-panel?oauth_token=';

}

export class Guid {
	static newGuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
}

