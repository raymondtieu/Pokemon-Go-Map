import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, Nav} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {SignInPage} from './pages/sign-in/sign-in';
import {SettingsPage} from './pages/settings/settings';
import {LocationPage} from './pages/location/location';
import {MapPage} from './pages/map/map';

import {ConnectivityService} from './providers/connectivity-service/connectivity-service';
import {StorageService} from './providers/storage-service/storage-service';
import {PokemonService} from './providers/pokemon-service/pokemon-service';
import {MarkerService} from './providers/marker-service/marker-service';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SignInPage;

  constructor(
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.overlaysWebView(false);

      if (this.platform.is('android')) {
        StatusBar.backgroundColorByHexString("#1A237E");
      }

      Splashscreen.hide();
    });
  }
}

ionicBootstrap(MyApp, [ConnectivityService, StorageService, PokemonService, MarkerService]);
