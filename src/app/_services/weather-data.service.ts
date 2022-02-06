import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API_URLS } from '../_constants/api-urls.constants';
import { String } from 'typescript-string-operations';

@Injectable({
  providedIn: 'root',
})
export class WeatherDataService {

    constructor(
        private http: HttpClient
    ) {}

    private weatherDataBaseURL = environment.weatherDataServerURL;
    private geocodeDataBaseURL = environment.geocodeAPIServerURL;

    getWeatherForecastData(cityId: string) {
        return this.http.get(this.weatherDataBaseURL + String.Format(API_URLS.WEATHER_FORECAST_API, cityId));
    }

    getCurrentLocationDetail(city: string) {
        let params = new HttpParams().set("q", city);
        params = params.set("language", "EN");
        return this.http.get(this.weatherDataBaseURL + API_URLS.WEATHER_LOCATION_DETAIL, {params});
    }

    convertLatLongToAddress(latitude: number, longitude: number) {
        let params = new HttpParams().set("lat", latitude);
        params = params.set("lon", longitude);
        params = params.set("format", "JSON");
        params = params.set("key", environment.geocodingAPIKey);
        return this.http.get(this.geocodeDataBaseURL, {params});
    }
}