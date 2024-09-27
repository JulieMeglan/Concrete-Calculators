import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.route';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideAnimations(), provideCharts(withDefaultRegisterables())]
};
