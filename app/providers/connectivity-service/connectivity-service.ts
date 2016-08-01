import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Platform} from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
	Generated class for the ConnectivityService provider.

	See https://angular.io/docs/ts/latest/guide/dependency-injection.html
	for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ConnectivityService {
	onDevice: boolean;
 
	constructor(private platform: Platform) {
		this.onDevice = this.platform.is('ios') || this.platform.is('android');
	}
 
	isOnline() {
		
		if(this.onDevice && navigator.connection){
 
			let networkState = navigator.connection.type;
 
			return networkState !== Connection.NONE;
 
		} else {
			return navigator.onLine;      
		}
	}
 
	isOffline() {
		if(this.onDevice && navigator.connection){
 
			let networkState = navigator.connection.type;
 
			return networkState === Connection.NONE;
 
		} else {
			return !navigator.onLine;     
		}
	}
}

