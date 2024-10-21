import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { CalculatorParentComponent } from './main-content/calculator-parent/calculator-parent.component';
import { FirestoreModule } from '@angular/fire/firestore';
import { firebaseConfig } from '../firebase.config'; // this file contains the firebaseConfig from the firebase website


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule, 
    CommonModule, 
    RouterModule,
    FirestoreModule // Import Firestore
  ],
  providers: [],
  bootstrap: [],
})
export class AppModule { }










