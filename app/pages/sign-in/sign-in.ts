import {Component} from '@angular/core';
import {NavController, NavParams, Loading} from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, AbstractControl, Control} from '@angular/common';
import {PokemonService} from '../../providers/pokemon-service/pokemon-service';
import {StorageService} from '../../providers/storage-service/storage-service';

import {SettingsPage} from '../settings/settings'

@Component({
	templateUrl: 'build/pages/sign-in/sign-in.html'
})
export class SignInPage {
	authForm: ControlGroup;
	username: AbstractControl;
	password: AbstractControl;
	remember: boolean = false;
	failed_login: boolean = false;

	constructor(private nav: NavController, private fb: FormBuilder, private storage: StorageService, private pokemon: PokemonService) { 
		this.authForm = fb.group({  
			'username': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
			'password': ['', Validators.compose([Validators.required, Validators.minLength(3)])]
		});

		this.username = this.authForm.controls['username'];     
		this.password = this.authForm.controls['password'];

		// Auto-fill username and password
		storage.getCredentials().then((credentials) => {
			this.remember = credentials['remember_me'];

			if (this.remember) {
				console.log("Retrieving saved username/password");
				nav.push(SettingsPage);
				nav.setRoot(SettingsPage);
			}
		});
	}
	 
	onSubmit(value): void {
		if(this.authForm.valid) {
			console.log('Submitted value: ', value);

			let loading = Loading.create({
				content: "Signing in..."
			});

			this.nav.present(loading);
			
			// if log in was successful and remember me is pressed, skip log in page
			// otherwise just log in and don't save anything
			this.pokemon.checkCredentials(value).subscribe(
				data => {
					console.log(data);

					if (data.login_successful) {
						this.storage.setCredentials(value.username, value.password, this.remember);
						this.nav.push(SettingsPage);
						this.nav.setRoot(SettingsPage);
					} else {
						this.failed_login = true;
					}
					
					loading.dismiss();
				},
				err => {console.log(err); alert(err)},
				() => console.log("Completed sign in process"));
		}
	} 

	showInfo() {
		alert("v0.1.1");
	}
}
