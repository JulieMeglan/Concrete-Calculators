import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RouterModule } from '@angular/router'; 
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { CalculatorParentComponent } from './main-content/calculator-parent/calculator-parent.component';
import { FirestoreModule } from '@angular/fire/firestore';
import { firebaseConfig } from '../firebase.config'; // this file contains the firebaseConfig from the firebase website


@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    CommonModule, 
    RouterModule,
    FirestoreModule // Import Firestore
  ],
  providers: [],
  bootstrap: [] // Bootstrap the AppComponent
})
export class AppModule { }
