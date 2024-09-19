import { Component, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tcpowers',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatTableModule],
  templateUrl: './tcpowers.component.html',
  styleUrl: './tcpowers.component.css'
})
export class TcpowersComponent {

  constructor(private firestore: Firestore){
  }
  // variable declarations for tc powers calculations
  wc: number = 0; // variable for water/cement ratio
  alpha: number = 0; // variable for degree of hydration
  results: any; // stores values resulting from tc powers formula
  
  // defines the columns displayed in the table
  displayedColumns: string[] = [
    'wn', 'wg', 'vg', 'vhp', 'vc', 'vu', 'vp', 'pg', 'pc', 'x', 'wmin'
  ];

  saveToFirestore(): void {
    // Reference the collection where data will be saved
    const testCollection = collection(this.firestore, 'tcpowers');
    
    // Add a new document with the current values
    addDoc(testCollection, {
      wcRatio: this.wc,
      alpha: this.alpha,
      timestamp: new Date()  // Add a timestamp if needed
    }).then(() => {
      console.log('Data saved successfully!');
    }).catch(error => {
      console.error('Error saving data: ', error);
    });
  }


  // tc powers calculation function
  calculateTCPowers(wc: number, alpha: number): void {

    // declaration of resultant variables
    let wn, wg, vg, vhp, vc, vu, vp, pg, pc, x, wmin;

    // tc powers formula implementation
    wn = 0.24 * this.alpha;
    wg = 0.18 * this.alpha;
    vg = wg;
    vhp = 0.68 * this.alpha;
    vc = this.wc - (0.36 * this.alpha);
    vu = (1 - this.alpha) * 0.32;
    vp = this.wc + 0.32;
    pg = wg / vhp;;
    pc = vc / vp;
    x = (0.68 * this.alpha) / ((0.32 * this.alpha) + this.wc);
    wmin = 0.42 * this.alpha;

  

    // gathers calculated variables to be used in tcpowers.component.html
    this.results = {
      wn,
      wg,
      vg,
      vhp,
      vc,
      vu,
      vp,
      pg,
      pc,
      x,
      wmin
    };
  }
}
