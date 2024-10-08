import { Component, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Firestore, addDoc, collection, collectionData, query, where, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

interface TCPowersRecord {
  alpha: number;
  wcRatio: number;
}

@Component({
  selector: 'app-tcpowers',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatTableModule],
  templateUrl: './tcpowers.component.html',
  styleUrl: './tcpowers.component.css'
})


export class TcpowersComponent {

  constructor(private firestore: Firestore, private auth: Auth){
  }
  // variable declarations for tc powers calculations
  wc: number = 0; // variable for water/cement ratio
  alpha: number = 0; // variable for degree of hydration
  results: any; // stores values resulting from tc powers formula
  userRecords: { alpha: number, wcRatio: number }[] = []; // stores records fetched from Firestore
  
  // defines the columns displayed in the table
  displayedColumns: string[] = [
    'wn', 'wg', 'vg', 'vhp', 'vc', 'vu', 'vp', 'pg', 'pc', 'x', 'wmin'
  ];

  saveToFirestore(): void {
    // Get the current authenticated user
    const user = this.auth.currentUser;
  
    if (user) {
      // Reference the collection where data will be saved
      const testCollection = collection(this.firestore, 'tcpowers');
      
      // Add a new document with the current values and the user's UID
      addDoc(testCollection, {
        wcRatio: this.wc,
        alpha: this.alpha,
        uid: user.uid,  // Include the uid of the logged-in user
        timestamp: new Date()  // Add a timestamp if needed
      }).then(() => {
        alert('Data saved successfully!');
      }).catch(error => {
        alert('Error saving data: ' + error);
      });
    } else {
      alert('No user is logged in');
    }
  }

  

  // Fetch saved records for the current user from Firestore
  fetchRecords(): void {
    const user = this.auth.currentUser;
  
    if (user) {
      // Define records as an array of TCPowersRecord
      const records: TCPowersRecord[] = [];
  
      // Reference to the collection
      const testCollection = collection(this.firestore, 'tcpowers');
      const q = query(testCollection, where('uid', '==', user.uid));
  
      // Use getDocs to fetch multiple documents
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data() as TCPowersRecord; // Ensure that data is typed as TCPowersRecord
  
          if (data) {
            records.push({
              alpha: data.alpha || 0,
              wcRatio: data.wcRatio || 0
            });
          }
        });
  
        // Assign records to your component's variable for display
        this.userRecords = records;
  
        if (this.userRecords.length === 0) {
          alert('No records found for this user.');
        }
      }).catch((error) => {
        console.error('Error fetching records: ', error);
        alert('Error fetching records: ' + error.message);
      });
  
    } else {
      alert('No user is logged in');
    }
  }

  // Populate input fields with selected record values
  populateFields(record: TCPowersRecord): void {
    this.wc = record.wcRatio; // Set wcRatio from the selected record
    this.alpha = record.alpha; // Set alpha from the selected record
    this.calculateTCPowers(this.wc, this.alpha); // Recalculate with new values
  }

  // tc powers calculation function
  calculateTCPowers(wc: number, alpha: number): void {

    // declaration of resultant variables
    let wn, wg, vg, vhp, vc, vu, vp, pg, pc, x, wmin;

    // tc powers formula implementation
    wn = 0.24 * this.alpha; // nonevaporable water
    wg = 0.18 * this.alpha; // gel pore water
    
    vhp = 0.68 * this.alpha; // total volume of hydration products
    vc = 0.32 // specific volume of cement (constant)
    vu = (1 - this.alpha) * 0.32; // volume of unhydrated cement
    vp = this.wc + 0.32; // original volume of paste
    pg = 0.26 * vhp; // volume of gel porosity
    pc = this.wc - (0.36 * this.alpha); // capillary porosity
    vg = vhp - pg; // total volume of hydration products minus the gel pores
    x = (vhp) / (vg + vc); // gel/space ratio
    wmin = wn + wg; // weight of water

  

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
