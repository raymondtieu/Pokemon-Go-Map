import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PokemonService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.

  A service that communicates with a Python Flask server hosted by heroku.
  Niantic has blocked the IPs of hosting sites so this service will no longer
  work.
*/

const HOST = "http://pokefinder-toronto.herokuapp.com/";

function EncodeQueryData(data) {
  return Object.keys(data).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
  }).join('&');
}

@Injectable()
export class PokemonService {
  data: any;

  constructor(private http: Http) {

  }

  checkCredentials(args) {
    let url = HOST + 'check_credentials?' + EncodeQueryData(args);

    return this.http.get(url).map(res => res.json());
  }

  startSearch(args) {
    let url = HOST + 'start?' + EncodeQueryData(args);
    console.log(url);

    return this.http.get(url).map(res => res.json());
  }

  stopSearch(args) {
    let url = HOST + 'stop?' + EncodeQueryData(args);
    console.log(url);

    return this.http.get(url).map(res => res.json());
  }

  isSearching(args) {
    let url = HOST + 'searching?' + EncodeQueryData(args);
    console.log(url);

    return this.http.get(url).map(res => res.json());
  }

  getRawData(args) {
    let url = HOST + 'raw_data?' + EncodeQueryData(args);

    return this.http.get(url).map(res => res.json());
  }
}

