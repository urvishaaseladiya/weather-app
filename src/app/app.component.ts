import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { APP_CONSTANTS } from './_constants/app.constants';
import { CommonService } from './_services/common.service';
import { WeatherDataService } from './_services/weather-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  latitude: number = 23.0225; // default latitude of location
  longitude: number = 72.5714; // default longitude of location
  city: string = 'Ahmedabad'; // default city name
  isAPILoading = false; // loader flag
  weatherForecastData: any = {}; // weather data getting from API
  weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]; // list of 7 days
  currentDay = this.weekDays[new Date().getDay()]; // day name from current date
  currentTime = new Date().getHours() + ':' + new Date().getMinutes(); // current time
  options: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 3,
      },
      760: {
        items: 7,
      },
      1000: {
        items: 4,
      },
    },
    nav: false,
  }; // options for day vise weather data carousel
  apiSubscriptions: Subscription[] = []; // api subscriptions
  screenWidth: any;
  screenHeight: any;
  

  constructor(
    private weatherDataService: WeatherDataService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.getLocation();
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  // This will request a location permission from user to find that location's weather data
  // if user will deny the permission, system will go ahead with default location data else proceed for getting the area/city name from user's location
  getLocation() {
    if (navigator.geolocation) {
      this.isAPILoading = true;
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            console.log(position);
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.processReverseGeocoding();
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.getCurrentLocationData();
    }
  }

  // This function will get the area/city name from user's location points and proceed for getting the location id of that location
  processReverseGeocoding() {
    this.apiSubscriptions.push(
      this.weatherDataService
        .convertLatLongToAddress(this.latitude, this.longitude)
        .subscribe((response: any) => {
          console.log(response);
          if (response.address?.city) {
            this.city = response.address.city;
            this.getCurrentLocationData();
          }
        })
    );
  }

  // This function will get the location id from area/city name which will be needed to call the weather data API
  getCurrentLocationData() {
    console.log(this.city);
    this.apiSubscriptions.push(
      this.weatherDataService
        .getCurrentLocationDetail(this.city)
        .subscribe((response: any) => {
          console.log(response);
          if (
            response._embedded?.location &&
            response._embedded?.location.length > 0 &&
            response._embedded?.location[0]?.id
          ) {
            this.getWeatherForecastData(response._embedded?.location[0]?.id);
          }
        })
    );
  }

  // This functiom will return the user/default location's weather data based on location's ID
  getWeatherForecastData(cityId: string) {
    console.log(cityId);
    this.apiSubscriptions.push(
      this.weatherDataService
        .getWeatherForecastData(cityId)
        .subscribe((response: any) => {
          console.log(response);
          this.isAPILoading = false;
          this.weatherForecastData = response;
        })
    );
  }

  // This function will do the rounding of the number
  doNumberRounding(value: number) {
    return this.commonService.doRoundingToNumber(value);
  }

  // This function will return the symbol detail based on given symbol key
  getSymbolDetail(key: string) {
    return APP_CONSTANTS.SYMBOL_DATA[key];
  }

  // This functiom will return the day name from UTC date
  getDayFromDate(date: string) {
    return this.weekDays[
      new Date(this.commonService.convertUTCDateToLocal(date)).getDay()
    ].substring(0, 3);
  }

  ngOnDestroy(): void {
    this.apiSubscriptions.forEach((sub) => sub.unsubscribe());
  }
}
