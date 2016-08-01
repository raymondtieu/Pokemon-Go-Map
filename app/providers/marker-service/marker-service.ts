import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

/*
  Generated class for the MarkerService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

// Lists of pokemon
const DROWZEE = [96];
const COMMON = [10,11,13,14,16,17,18,19,20,21,22,35,39,41,42,43,46,48,54,60,69,72,90,92,96,98,109,116,118,120,124];
const RARE = [1,2,4,5,7,8,12,15,23,24,25,26,27,28,29,30,32,33,36,37,40,44,45,47,49,50,51,52,53,54,56,58,61,63,64,66,67,70,73,74,75,77,79,81,84,86,87,88,91,93,95,97,99,100,101,102,104,106,107,108,110,111,113,114,117,119,121,123,125,127,128,129,133,137,138,140];
const LEGENDARY = [3,6,9,38,55,57,59,62,65,68,71,76,78,80,82,83,85,89,94,103,105,112,115,122,126,130,131,132,134,135,136,139,141,142,143,144,145,146,147,148,149,150,151];

@Injectable()
export class MarkerService {
  markers = {};
  
  timeFormat: string = "h:mm A";
  timeLeftFormat: string = "mm:ss";

  isUpdatingTimes: boolean = false;
  intervalUpdatingTimes: any;

  constructor() {
    console.log(moment());
  }

  placeInitialMarker(position, map) {
    new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: 'img/character.png'
    });
  }

  placePokemonMarker(pokemon, map, filters) {
    if (this.isFiltered(pokemon, filters)) {
      console.log(pokemon.pokemon_name + " got filtered");
      return 0;
    }

    // Only place on map if passed filter
    if (!(pokemon.encounter_id in this.markers)) {
      console.log("Adding a " + pokemon.pokemon_name + " to the map.");

      let latLng = new google.maps.LatLng(pokemon.latitude, pokemon.longitude);

      let icon = 'img/pokemon_sprites/' + pokemon.pokemon_id + '.png';
      
      let marker = new google.maps.Marker({
        position: latLng,
        map: map,
        icon: icon
      });

      let infoWindow = new google.maps.InfoWindow({
        content: "<p>" + pokemon.pokemon_name + " - #" + pokemon.pokemon_id + "</p>" +
                 "<p>Disappears at " + moment(pokemon.disappear_time).format(this.timeFormat) + 
                 " (<span class='countdown' disappears-at='" + pokemon.disappear_time +"'>in 0m00s</span>)</p>"
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        this.updateTimeLabel();
      });

      this.markers[pokemon.encounter_id] = {marker: marker, pokemon: pokemon};
    } else {
      if (this.markers[pokemon.encounter_id].marker.getMap() !== map && moment().isBefore(pokemon.disappear_time)) {
        this.markers[pokemon.encounter_id].marker.setMap(map);
      }
    }
  }

  updateTimeLabel() {
    let elements = document.getElementsByClassName('countdown');

    Array.prototype.forEach.call(elements, (element) => {
      let disappears = parseInt(element.getAttribute('disappears-at'));
      let remaining;

      if (moment().isAfter(disappears)) {
        remaining = "Expired"
      } else {
        let remainingTime = moment(disappears).diff(moment());
        remaining = "in " + moment(remainingTime).format('m') + "m" + moment(remainingTime).format('ss') + "s";
      }

      element.innerHTML = remaining;
    });
  }

  updateTimeLabels() {
    this.intervalUpdatingTimes = setInterval(() => {
      this.updateTimeLabel();
    }, 1000);
  }

  clearStaleMarkers() {
    for (let i in this.markers) {
      let marker = this.markers[i].marker;
      let pokemon = this.markers[i].pokemon;

      if (moment().isAfter(pokemon.disappear_time)) {
        console.log("Clearing stale marker: " + pokemon.pokemon_name);
        marker.setMap(null);
        delete this.markers[i];
      }
    }
  }



  flushMarkers() {
    console.log("Flushing markers");
    for (let i in this.markers) {
      this.markers[i].marker.setMap(null);
    }

    clearInterval(this.intervalUpdatingTimes);
  }

  isFiltered(pokemon, filters) {
    if (filters.common && COMMON.indexOf(pokemon.pokemon_id) > -1)
      return true;

    if (filters.rare && RARE.indexOf(pokemon.pokemon_id) > -1)
      return true;

    if (filters.legendary && LEGENDARY.indexOf(pokemon.pokemon_id) > -1)
      return true;
  }

}

