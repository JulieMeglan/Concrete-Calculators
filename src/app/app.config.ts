import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.route';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { firebaseConfig } from '../firebase.config'; // this file contains the firebaseConfig from the firebase website
import { environment } from '../environments/environment'; // this file specifies whether to production or emulation is used


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => {
      const firestore = getFirestore(); // initialized firestore
      if (!environment.production) { // checks whether or not emulation is used
        connectFirestoreEmulator(firestore, 'localhost', 8080) // if emulation is used, connects to firebase emulation
      }
      return firestore;
    }),
    provideStorage(() => getStorage())]
};
