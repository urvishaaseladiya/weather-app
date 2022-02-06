import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherAppHeaderComponent } from './weather-app-header.component';

describe('WeatherAppHeaderComponent', () => {
  let component: WeatherAppHeaderComponent;
  let fixture: ComponentFixture<WeatherAppHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeatherAppHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherAppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
