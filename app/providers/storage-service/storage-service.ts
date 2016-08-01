import { Injectable } from '@angular/core';
import {Platform, Storage, LocalStorage} from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the StorageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

const USERNAME = 'username';
const PASSWORD = 'password';
const REMEMBER = 'remember_me';

const STEP_LIMIT = 'step_limit';
const SCAN_DELAY = 'scan_delay';
const POKEMON = 'pokemon';
const POKESTOPS = 'pokestops';
const GYMS = 'gyms';
const COMMON = 'common';
const RARE = 'rare';
const LEGENDARY = 'legendary';

const ADDRESS = 'address';
const CITY = 'city';
const PROVINCE = 'province';
const COUNTRY = 'country';

@Injectable()
export class StorageService {
  local: any;

  constructor(private platform: Platform) {
    this.local = new Storage(LocalStorage);
  }
 
  /* Credentials */
  getCredentials() {
    return new Promise((resolve, reject) => {
      let credentials = {};

      this.local.get(USERNAME).then((username) => {
        credentials[USERNAME] = username;
        return this.local.get(PASSWORD);
      }).then((password) => {
        credentials[PASSWORD] = password;
        return this.local.get(REMEMBER);
      }).then((remember) => {
        credentials[REMEMBER] = remember === 'true';

        resolve(credentials);
      })
    })
  }

  setCredentials(username: string, password: string, remember: boolean) {
    this.local.set(USERNAME, username.trim());
    this.local.set(PASSWORD, password.trim());
    this.local.set(REMEMBER, remember);
  }

  setRememberMe(remember: boolean) {
    this.local.set(REMEMBER, remember);
  }

  /* Settings */
  getSteps() {
    return this.local.get(STEP_LIMIT);
  }

  setSteps(steps: number) {
    this.local.set(STEP_LIMIT, steps)
  }

  getScanDelay() {
    return this.local.get(SCAN_DELAY);
  }

  setScanDelay(scanDelay: number) {
    this.local.set(SCAN_DELAY, scanDelay)
  }

  getSearchSettings() {
    let settings = {}

    return new Promise((resolve, reject) => {
      this.local.get(STEP_LIMIT).then((steps) => {
        settings[STEP_LIMIT] = parseInt(steps) || 3;
        return this.local.get(SCAN_DELAY);
      }).then((scanDelay) => {
        settings[SCAN_DELAY] = parseInt(scanDelay) || 3;

        resolve(settings);
      });
    });
  }

  getPokemon() {
    return this.local.get(POKEMON);
  }

  setPokemon(pokemon: boolean) {
    this.local.set(POKEMON, pokemon);
  }

  getPokestops() {
    return this.local.get(POKESTOPS);
  }

  setPokestops(pokestops: boolean) {
    this.local.set(POKESTOPS, pokestops);
  }

  getGyms() {
    return this.local.get(GYMS);
  }

  setGyms(gyms: boolean) {
    this.local.set(GYMS, gyms);
  }

  getViewSettings() {
    let settings = {}

    return new Promise((resolve, reject) => {
      this.local.get(POKEMON).then((pokemon) => {
        settings[POKEMON] = pokemon === 'true';
        return this.local.get(POKESTOPS);
      }).then((pokestops) => {
        settings[POKESTOPS] = pokestops === 'true';
        return this.local.get(GYMS);
      }).then((gyms) => {
        settings[GYMS] = gyms === 'true';

        resolve(settings);
      });
    });
  }

  setCommon(common: boolean) {
    this.local.set(COMMON, common);
  }

  setRare(rare: boolean) {
    this.local.set(RARE, rare);
  }

  setLegendary(legendary: boolean) {
    this.local.set(LEGENDARY, legendary);
  }

  getFilterSettings() {
    let settings = {}

    return new Promise((resolve, reject) => {
      this.local.get(COMMON).then((common) => {
        settings[COMMON] = common === 'true';
        return this.local.get(RARE);
      }).then((rare) => {
        settings[RARE] = rare === 'true';
        return this.local.get(LEGENDARY);
      }).then((legendary) => {
        settings[LEGENDARY] = legendary === 'true';

        resolve(settings);
      });
    });
  }

  setFilterSettings(common: boolean, rare:boolean, legendary:boolean) {
    this.local.set(COMMON, common);
    this.local.set(RARE, rare);
    this.local.set(LEGENDARY, legendary);
  }

  /* Location */
  getLocation() {
    let location = {};

    return new Promise((resolve, reject) => {
      this.local.get(ADDRESS).then((address) => {
        location[ADDRESS] = address;
        return this.local.get(CITY);
      }).then((city) => {
        location[CITY] = city || 'Toronto';
        return this.local.get(PROVINCE);
      }).then((province) => {
        location[PROVINCE] = province || 'Ontario';
        return this.local.get(COUNTRY);
      }).then((country) => {
        location[COUNTRY] = country || 'Canada';

        resolve(location);
      });
    });
  }

  setLocation(address: string, city: string, province: string, country: string) {
    this.local.set(ADDRESS, address);
    this.local.set(CITY, city);
    this.local.set(PROVINCE, province);
    this.local.set(COUNTRY, country);
  }

  getAddress() {
    return this.local.get(ADDRESS);
  }

  setAddress(address: string) {
    this.local.set(ADDRESS, address.trim());
  }

  getCity() {
    return this.local.get(CITY);
  }

  setCity(city: string) {
    this.local.set(CITY, city.trim());
  }

  getProvince() {
    return this.local.get(PROVINCE);
  }

  setProvince(province: string) {
    this.local.set(PROVINCE, province.trim());
  }

  getCountry() {
    return this.local.get(COUNTRY);
  }

  setCountry(country: string) {
    this.local.set(COUNTRY, country.trim());
  }
}

