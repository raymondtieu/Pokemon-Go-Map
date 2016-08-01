import {Component} from '@angular/core';
import {NavController, Platform, NavParams, Loading} from 'ionic-angular';
import {Http} from '@angular/http';
import {ConnectivityService} from '../../providers/connectivity-service/connectivity-service';
import {PokemonService} from '../../providers/pokemon-service/pokemon-service';
import {StorageService} from '../../providers/storage-service/storage-service';
import {MarkerService} from '../../providers/marker-service/marker-service';
import {Timer} from '../../components/timer/timer';

@Component({
	templateUrl: 'build/pages/map/map.html',
	directives: [Timer]
})

export class MapPage {
	map: any;
	mapOptions: any;
	mapInitialised: boolean = false;
	mapMarkers: {};

	searching: boolean = false;
	waitingForResponse: boolean = false;
	waitingToStop: boolean = false;

	uptime: number = 0;

	credentials: {};
	searchSettings: {};
	viewSettings: {};
	filterSettings: {};
	locationSettings: {};

	intervalData: any;
	intervalIsSearching: any;
	intervalStaleMarker: any;
	intervalUptime: any;

	POLL_INTERVAL: number = 5000;

	constructor(
		private platform: Platform, 
		private nav: NavController, 
		private navParams: NavParams, 
		private connectivityService: ConnectivityService,
		private storage: StorageService,
		private pokemon: PokemonService,
		private marker: MarkerService
	) { 

		console.log(navParams);
		this.map = null;

		this.mapOptions = {
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false,
			streetViewControl: false,
		}

		platform.ready().then(() => {
			this.loadGoogleMaps(navParams.data);
		});

		storage.getCredentials().then((credentials) => {
			this.credentials = {
				username: credentials['username'],
				password: credentials['password']
			}
		});

		storage.getSearchSettings().then((settings) => {
			console.log(settings);
			this.searchSettings = {
				step_limit: settings['step_limit'],
				scan_delay: settings['scan_delay']
			}
		});

		storage.getViewSettings().then((settings) => {
			console.log(settings);
			this.viewSettings = {
				pokemon: settings['pokemon'],
				pokestops: settings['pokestops'],
				gyms: settings['gyms']
			}

		});

		storage.getFilterSettings().then((settings) => {
			console.log(settings);
			this.filterSettings = {
				common: settings['common'],
				rare: settings['rare'],
				legendary: settings['legendary']
			}

			this.startPollingRawData();
			this.startClearingStaleMarkers();
			marker.updateTimeLabels();
		});
	} 

	loadGoogleMaps(data) {
		let loading = Loading.create({
			content: "Initializing map..."
		});

		this.nav.present(loading);

		if (data.useCurrentLocation) {
			navigator.geolocation.getCurrentPosition( (position) => {
				let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

				this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);
				this.map.setCenter(latLng);

				this.marker.placeInitialMarker(latLng, this.map);

				this.locationSettings = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				}

				loading.dismiss();
			}, (error) => {
					console.log(error);
			});
		} else {
			this.storage.getLocation().then((location) => {
				let address = [location['address'], location['city'], location['province'], location['country']].join(', ');
				console.log(address);

				let geocoder = new google.maps.Geocoder();
				
				geocoder.geocode({'address': address}, (results, status) => {
					if (status === google.maps.GeocoderStatus.OK) {
						this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);
						this.map.setCenter(results[0].geometry.location);

						this.marker.placeInitialMarker(results[0].geometry.location, this.map);

						this.locationSettings = {
							location: address
						}

						loading.dismiss();
					}
				});
			});
		}
	}

	startPollingRawData() {
		this.intervalData = setInterval(() => {
			this.pokemon.getRawData(this.viewSettings).subscribe(
				data => this.placeMarkers(data),
				err => console.log(err),
				() => console.log("Received raw data"));
		}, this.POLL_INTERVAL)
		
	}

	placeMarkers(data) {
		data.pokemons.forEach((p) => {
			this.marker.placePokemonMarker(p, this.map, this.filterSettings);
		})
	}

	startSearch() {
		this.waitingForResponse = true;

		let loading = Loading.create({
			content: "Starting search..."
		});

		this.nav.present(loading);

		let args = {
			username: this.credentials['username'],
			password: this.credentials['password'],
			scan_delay: this.searchSettings['scan_delay'],
			step_limit: this.searchSettings['step_limit'],
		}

		if (this.navParams.data.useCurrentLocation) {
			args['latitude'] = this.locationSettings['latitude'];
			args['longitude'] = this.locationSettings['longitude'];
		} else {
			args['location'] = this.locationSettings['location'];
		}

		this.pokemon.startSearch(args).subscribe(
			data => {
				this.waitingForResponse = false;

				console.log(data);
				this.searching = true;

				this.uptime = 0;
				this.startUptime();
				this.startPollingSearch();


				loading.dismiss();
			},

			err => console.log(err),
			() => console.log("Received response when starting search")
		);
	}

	stopSearch() {
		let args = {
			username: this.credentials['username']
		}

		this.waitingForResponse = true;

		this.pokemon.stopSearch(args).subscribe(
			data => {
				this.waitingForResponse = false;

				if (data.stopped) {
					console.log("Searching has stopped");
					this.searching = false;
					clearInterval(this.intervalUptime);
				} else if (data.willStop) {
					console.log("Searching will stop");
					this.waitingToStop = true;
				}
			},

			err => console.log(err),
			() => console.log("Received response when stopping search")
		);
	}

	startPollingSearch() {
		let args = {
			username: this.credentials['username']
		}

		this.intervalIsSearching = setInterval(() => {
			this.pokemon.isSearching(args).subscribe(
				data => {
					this.searching = data.searching

					if (!this.searching) {
						clearInterval(this.intervalIsSearching);
						clearInterval(this.intervalUptime);
						this.waitingToStop = false;
					}
				},
				err => console.log(err)
			);
		}, this.POLL_INTERVAL);
	}

	startClearingStaleMarkers() {
		this.intervalStaleMarker = setInterval(() => {
			this.marker.clearStaleMarkers();
		}, this.POLL_INTERVAL)
	}

	startUptime() {
		this.intervalUptime = setInterval(() => {
			this.uptime++;
		}, 1000);
	}

	ionViewWillLeave() {
		this.map = null;

		this.marker.flushMarkers();

		console.log("No longer polling raw data");
		clearInterval(this.intervalData);

		console.log("Attempting to stop pokemon search");
		this.stopSearch();

		console.log("No longer polling for if user is searching");
		clearInterval(this.intervalIsSearching);

		console.log("No longer clearing stale markers");
		clearInterval(this.intervalStaleMarker);
	}
}
