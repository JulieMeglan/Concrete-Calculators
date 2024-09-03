import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.route';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB7FEl3ZP_xhQa0pvYkSYUAYQMsaNm5d8o",
  authDomain: "concrete-calculators.firebaseapp.com",
  databaseURL: "https://concrete-calculators-default-rtdb.firebaseio.com",
  projectId: "concrete-calculators",
  storageBucket: "concrete-calculators.appspot.com",
  messagingSenderId: "538357900190",
  appId: "1:538357900190:web:9d16726af3f3aa74b3ac8f",
  measurementId: "G-RVLEE719C6"
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())]
};
