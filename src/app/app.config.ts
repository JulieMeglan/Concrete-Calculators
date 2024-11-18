import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.route';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { firebaseConfig } from '../firebase.config'; // this file contains the firebaseConfig from the firebase website


// if used for testing, use ../environments/environment (this allows emulators to properly connect)
import { environment } from '../environment/environment.prod'; // this file specifies whether to production or emulation is used
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => {
      const firestore = getFirestore(); // initialized firestore
      if (!environment.production) { // checks whether or not emulation is used
        connectFirestoreEmulator(firestore, 'localhost', 8080) // if emulation is used, connects to firebase emulation
      }
      return firestore;
    }),
    provideStorage(() => getStorage()),
    
    provideAuth(() => {
      const auth = getAuth(); // initialized authentication
      if (!environment.production) { // checks whether or not emulation is used
        connectAuthEmulator(auth, "http://127.0.0.1:9099") // if emulation is used, connects to auth emulation
      }
      return auth;
    })
      
    ]
};
