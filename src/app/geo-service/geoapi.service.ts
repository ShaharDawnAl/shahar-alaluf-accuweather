import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeoapiService {
  // backup API keys
  // private API_KEY = 'HkH5FsPAOd65aJF2UvL7dGeATck4NWpm';
  private API_KEY = 'GNdNdeKS5ZPPfp2rHpuUXqGLUtxR9SXK';
  // private API_KEY = 'SoJbAM7Fi237FJaohVJN81vbA6NGBlBw';
  constructor(private http: HttpClient) { }

  getFiveDayForecast(cityKey) {
    return this.http.get(
      `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${this.API_KEY}&language=en-us&details=true&metric=true`
    );
  }

  getCityLocation(cityKey) {
    return this.http.get(
      `https://dataservice.accuweather.com/locations/v1/${cityKey}?apikey=${this.API_KEY}&language=en-us&details=true`
    );
  }

  getCityAutoComplete(city) {
    return this.http.get(
      `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${this.API_KEY}&q=${city}`
    );
  }

  getWeatherCondition(cityKey) {
    return this.http.get(
      `https://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${this.API_KEY}`
    );
  }

  getGeoLocationCoords(lat, lon) {
    return this.http.get(
      `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${this.API_KEY}&q=${lat},${lon}&language=en-us&details=true`
    );
  }
}
