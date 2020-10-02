import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeoapiService } from '../geo-service/geoapi.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data-service/data.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WeatherComponent implements OnInit {

  public weatherSearchForm: FormGroup;
  foundSearch = false;
  celsius = true;
  temprature: number;
  tempStatus = '°F';
  public isFavorited: boolean;
  public cityData: any;
  public cityName: string;
  location: any;
  errMsg: any;
  autoCompleteData: any;
  currentWeatherCondition: any;
  foundCityKey: string;
  favsArr: any;
  public loading = false;
  favoritesNumber: any;
  currWeatherDate: Date;

  constructor(private formBuilder: FormBuilder, private _Activatedroute: ActivatedRoute, private geoService: GeoapiService, private snackBar: MatSnackBar, private dataService: DataService) { }

  ngOnInit(): void {
    // If I want to show the favorites number on this page
    this.dataService.currentFavsNumber.subscribe(
      favsNumber => {
        this.favoritesNumber = favsNumber;
      }
    );

    this.weatherSearchForm = this.formBuilder.group({
      location: ['']
    });

    if (this._Activatedroute.snapshot.paramMap.get("id")) {
      this._Activatedroute.paramMap.subscribe(params => {
        const urlCityID = params.get('id');
        this.getWeatherByURLCityKey(urlCityID);
      });
    }
    else {
      // GeoLocation by MDN
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.geoService.getGeoLocationCoords(latitude, longitude).subscribe(
            data => {
              let geoLocationData: any;
              geoLocationData = data;

              if (geoLocationData === null) {
                this.loading = false;
                this.errMsg = `Couldn't find the city!, please validate your input.`;
                this.openSnackBarError();
              } else {
                this.cityName = geoLocationData.LocalizedName;
                this.foundCityKey = geoLocationData.Key;
                this.getWeatherConditionByCityKey();
              }
            },
            err => {
              this.errMsg = "Couldn't find your position!\nPlease try again later...";
              this.openSnackBarError();
            }
          );
        },
        error => {
          this.loading = false;
          if (error.code === error.PERMISSION_DENIED) {
            this.errMsg = "We can't find you if you won't allow it!";
            this.openSnackBarError();
            this.cityName = "Tel Aviv";
            this.foundCityKey = "215854";
            this.getWeatherConditionByCityKey();
          }
        }
      );
    }

  }

  toggleCelsiusFahrenheit() {
    this.celsius = !this.celsius;
  }

  getUnit() {
    if (this.celsius === true) {
      return this.tempStatus = '°C';
    } else {
      return this.tempStatus = '°F';
    }
  }

  getUnitAvg(unitMin, unitMax) {
    return (unitMin + unitMax) / 2;
  }

  getFahrenheit(temprature) {
    return temprature * 1.8 + 32;
  }

  getDayName(timestamp) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(timestamp);
    return days[d.getDay()];
  }

  openSnackBarError() {
    this.snackBar.open(`${this.errMsg}`, 'Close', {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: ['snack-bar-color'],
    });
  }

  sendToAPIXU(formValues) {
    this.foundSearch = false;
    this.cityData = [];
    this.cityName = '';
    this.foundCityKey = null;
    this.errMsg = null;
    if (formValues.location === '') {
      this.errMsg = 'Please enter a valid location!';
      return this.openSnackBarError();
    }
    else if (!formValues.location.match('^[a-zA-Z_ ]*$')) {
      this.errMsg = 'Please enter english letters only!';
      return this.openSnackBarError();
    }
    else {
      this.getWeatherBySearch(formValues);
    }

  }

  getWeatherByURLCityKey(cityKey) {
    this.foundSearch = false;
    this.loading = true;

    this.geoService.getCityLocation(cityKey).subscribe(
      data => {
        let locationData: any;
        locationData = data;
        if (locationData === null) {
          this.loading = false;
          this.errMsg = `Couldn't find the city!, please validate your input.`;
          this.openSnackBarError();
        } else {
          this.foundCityKey = cityKey;
          this.cityName = locationData.LocalizedName;
          this.getWeatherConditionByCityKey();
        }
      },
      err => {
        this.loading = false;
        this.errMsg = 'Error! Something went wrong when fetching the data!';
        return this.openSnackBarError();
      }
    );
  }

  getWeatherByCityKey() {
    this.cityName = this.autoCompleteData[0].LocalizedName;
    this.foundCityKey = this.autoCompleteData[0].Key;
    this.getWeatherConditionByCityKey();
  }

  getWeatherBySearch(formValues) {
    this.foundSearch = false;
    this.loading = true;
    this.geoService.getCityAutoComplete(formValues.location).subscribe(
      data => {
        this.autoCompleteData = data;
        if (this.autoCompleteData.length === 0 || this.autoCompleteData === null) {
          this.loading = false;
          this.errMsg = `Couldn't find the city!, please validate your input.`;
          this.openSnackBarError();
        } else {
          this.cityName = this.autoCompleteData[0].LocalizedName;
          this.foundCityKey = this.autoCompleteData[0].Key;
          this.getWeatherConditionByCityKey();
        }
      },
      err => {
        this.loading = false;
        this.errMsg = 'Error! Something went wrong when fetching the data!';
        return this.openSnackBarError();
      }
    );
  }

  getWeatherConditionByCityKey() {
    this.geoService.getWeatherCondition(this.foundCityKey).subscribe(
      data => {
        if (data === null) {
          this.loading = false;
          this.errMsg = `Couldn't find the city!, please validate your input.`;
          this.openSnackBarError();
        }
        this.currentWeatherCondition = data;
        this.currentWeatherCondition = this.currentWeatherCondition[0];
        this.checkFavorite();
        this.receiveFiveDayWeather();
      },
      err => {
        this.loading = false;
        alert('Error!\nSomething went wrong when fetching the data!\nPlease Try Again later!');

      }
    );
  }

  receiveFiveDayWeather() {
    this.geoService.getFiveDayForecast(this.foundCityKey).subscribe(
      data => {
        this.cityData = data;
        this.cityData = this.cityData.DailyForecasts;
        this.foundSearch = true;
        this.loading = false;
      },
      err => {
        this.loading = false;
        alert('Error!\nSomething went wrong when fetching the data!\nPlease Try Again later!');
      }
    );
  }

  checkFavorite() {
    this.favsArr = JSON.parse(localStorage.getItem('cityFavoriteKeys')) || [];
    const index = this.favsArr.map(function (e) { return e.ID; }).indexOf(this.foundCityKey);
    if (index !== -1) {
      this.isFavorited = true;
    }
    else {
      this.isFavorited = false;
    }
  }

  addFavorite() {
    const oldFavs = JSON.parse(localStorage.getItem('cityFavoriteKeys')) || [];
    oldFavs.push({ ID: this.foundCityKey, name: this.cityName, celsius: this.currentWeatherCondition.Temperature.Metric.Value, fahrenheit: this.currentWeatherCondition.Temperature.Imperial.Value, currentWeather: this.currentWeatherCondition.WeatherText });
    localStorage.setItem('cityFavoriteKeys', JSON.stringify(oldFavs));
    this.dataService.changeFavs(JSON.parse(localStorage.getItem('cityFavoriteKeys')).length);
    this.isFavorited = true;
  }

  removeFavorite() {
    if (confirm('Are you sure you want to remove this location from your favorites?')) {
      const oldFavs = JSON.parse(localStorage.getItem('cityFavoriteKeys')) || [];
      const index = oldFavs.map(function (e) { return e.ID; }).indexOf(this.foundCityKey);
      if (index > -1) {
        oldFavs.splice(index, 1);
      }
      localStorage.setItem('cityFavoriteKeys', JSON.stringify(oldFavs));
      this.dataService.changeFavs(JSON.parse(localStorage.getItem('cityFavoriteKeys')).length);
      this.isFavorited = false;
    }
  }

  toggleAddToFav() {
    if (this.isFavorited) {
      this.removeFavorite();
    }
    else {
      this.addFavorite();
    }
  }
  
  
}
