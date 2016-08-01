import {Component} from '@angular/core';
import {NavController, NavParams, Storage, LocalStorage, Alert} from 'ionic-angular';
import {SignInPage} from '../sign-in/sign-in';
import {MapPage} from '../map/map';
import {LocationPage} from '../location/location';
import {StorageService} from '../../providers/storage-service/storage-service';
import {ConnectivityService} from '../../providers/connectivity-service/connectivity-service';

@Component({
	templateUrl: 'build/pages/settings/settings.html'
})

export class SettingsPage {
	steps: number = 5;
	scanDelay: number = 5;
	pokemon: boolean = true;
	pokestops: boolean = false;
	gyms: boolean = false;
	common: boolean = false;
	rare: boolean = false;
	legendary: boolean = false;

	constructor(private nav: NavController, private storage: StorageService, private connectivityService: ConnectivityService) { 
		storage.getSearchSettings().then((settings) => {
			this.steps = settings['step_limit'];
			this.scanDelay = settings['scan_delay'];
		});

		storage.getViewSettings().then((settings) => {
			this.pokemon = true;//settings['pokemon'];
			this.pokestops = settings['pokestops'];
			this.gyms = settings['gyms'];
		});

		storage.getFilterSettings().then((settings) => {
			this.common = settings['common'];
			this.rare = settings['rare'];
			this.legendary = settings['legendary'];
		});
	}

	signOut() {
		let alert = Alert.create({
			title: "Sign Out",
			message: "Are you sure you want to sign out?",
			buttons: [
				{
					text: "Cancel",
					role: 'cancel'
				},
				{
					text: "Yes",
					handler: () => {
						this.storage.setRememberMe(false);
						this.nav.push(SignInPage);
						this.nav.setRoot(SignInPage);
					}
				}
			]
		});
		
		this.nav.present(alert);
	}
	 
	enterLocation(): void { 
//    if (this.connectivityService.isOnline()) {
			this.saveSettings();
			this.nav.push(LocationPage, {});
		// } else {
		//   let alert = Alert.create({
		//     title: "No Connection",
		//     message: "No internet connection.",
		//     buttons: ["OK"]
		//   });
			
		//   this.nav.present(alert);
		// }
	}   

	useCurrentLocation(): void {
//    if (this.connectivityService.isOnline()) {
			this.saveSettings();
			this.nav.push(MapPage, {useCurrentLocation: true}); 
		// } else {
		//   let alert = Alert.create({
		//     title: "No Connection",
		//     message: "No internet connection.",
		//     buttons: ["OK"]
		//   });
			
		//   this.nav.present(alert);
		// }
	}

	/* Notifcations in the future */

	saveSettings() {
		console.log("Saving settings");
		this.storage.setSteps(this.steps); 
		this.storage.setScanDelay(this.scanDelay); 
		this.storage.setPokemon(this.pokemon); 
		this.storage.setPokestops(this.pokestops); 
		this.storage.setGyms(this.gyms); 
		
		this.storage.setFilterSettings(this.common, this.rare, this.legendary);
	}
}
