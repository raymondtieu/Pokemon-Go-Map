import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl, Control} from '@angular/common';
import {StorageService} from '../../providers/storage-service/storage-service';

import {MapPage} from '../map/map';


@Component({
	templateUrl: 'build/pages/location/location.html'
})
export class LocationPage {
	authForm: ControlGroup;
	address: AbstractControl;
	city: AbstractControl;
	province: AbstractControl;
	country: AbstractControl;

	constructor(private nav: NavController, private navParams: NavParams, private fb: FormBuilder, private storage: StorageService) { 
		console.log(navParams);

		this.authForm = fb.group({  
			'address': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			'city': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			'province': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
			'country': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
		});

		this.address = this.authForm.controls['address'];
		this.city = this.authForm.controls['city'];
		this.province = this.authForm.controls['province'];
		this.country = this.authForm.controls['country'];  

		storage.getLocation().then((location) => {
			(<Control> this.authForm.find('address')).updateValue(location['address']);
			(<Control> this.authForm.find('city')).updateValue(location['city']);
			(<Control> this.authForm.find('province')).updateValue(location['province']);
			(<Control> this.authForm.find('country')).updateValue(location['country']);
		});
	}
	 
	onSubmit(value): void { 
			if(this.authForm.valid) {
				console.log('Submitted value: ', value);

				this.storage.setLocation(value.address, value.city, value.province, value.country); 

				this.nav.push(MapPage, value);
			}
	}
}
