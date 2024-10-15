// bogue.component.ts

// This TypeScript file defines the BogueComponent, which is responsible for handling the logic 
// and calculations related to the Bogue Calculation method in the Angular webpage. It imports 
// necessary modules and components, including FormsModule for handling input data and Material 
// modules for UI components. The calculateBogue function performs the Bogue Calculation based on 
// input values, and the results are stored in the results object for display in the HTML template.


// imports for bogue calculator
// ensure FormsModule is imported (required for input)
import { Component, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Firestore, addDoc, collection, collectionData, query, where, getDocs, orderBy, doc, deleteDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

interface BogueRecord {
  cao: number; 
  sio2: number; 
  al2o3: number; 
  fe2o3: number; 
  so3: number; 
}

// components for bogue calculator
// ensure FormsModule is in imports
@Component({
  selector: 'app-bogue',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatTableModule], // ensure FormsModule is in this line
  templateUrl: './bogue.component.html', 
  styleUrl: './bogue.component.css'
})

// class containing bogue specific variables and functions
export class BogueComponent {

  constructor(private firestore: Firestore, private auth: Auth){
  }
  
  // variable declarations for bogue calculations
  cao: number = 0; // variable for lime
  sio2: number = 0; // variable for silica
  al2o3: number = 0; // variable for alumina
  fe2o3: number = 0; // variable for ferric oxide
  so3: number = 0; // variable for sulfur trioxide
  results: any; // stores values resulting from bogue formula
  userRecords: { cao: number, sio2: number, al2o3: number, fe2o3: number, so3: number  }[] = []; // stores records fetched from Firestore
  showRecords: boolean = false;

  // defines the columns displayed in the table
  displayedColumns: string[] = ['c3s', 'c2s', 'c3a', 'c4af', 'afRatio'];

  // Add the following method in BogueComponent
  saveToFirestore(): void {
    // Get the current authenticated user
    const user = this.auth.currentUser;
  
    if (user) {
      // Reference the collection where data will be saved
      const testCollection = collection(this.firestore, 'bogue');
      
      // Add a new document with the current values and the user's UID
      addDoc(testCollection, {
        cao: this.cao,
        sio2: this.sio2,
        al2o3: this.al2o3,
        fe2o3: this.fe2o3,
        so3: this.so3,
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
    // Toggle the value of showRecords
    this.showRecords = !this.showRecords;

    // If showRecords is true, fetch the records
    if (this.showRecords) {
      const user = this.auth.currentUser;
    
      if (user) {
        const records: BogueRecord[] = [];
        const testCollection = collection(this.firestore, 'bogue');
        const q = query(
          testCollection,
          where('uid', '==', user.uid),
          orderBy('timestamp', 'desc') // This sorts records by timestamp, newest first
        );

        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data() as BogueRecord;
            if (data) {
              records.push({
                cao: data.cao || 0,
                sio2: data.sio2 || 0,
                al2o3: data.al2o3 || 0,
                fe2o3: data.fe2o3 || 0,
                so3: data.so3 || 0
              });
            }
          });
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
  }

  // Method to delete a specific record from Firestore
deleteRecord(record: BogueRecord): void {
  const user = this.auth.currentUser;

  if (user) {
    // Reference to the collection
    const testCollection = collection(this.firestore, 'bogue');
    
    // Query to find the document to delete
    const q = query(
      testCollection,
      where('uid', '==', user.uid),
      where('cao', '==', record.cao),
      where('sio2', '==', record.sio2),
      where('al2o3', '==', record.al2o3),
      where('fe2o3', '==', record.fe2o3),
      where('so3', '==', record.so3)
    );

    // Fetch the document to delete
    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id; // Get the document ID
        const docRef = doc(this.firestore, 'bogue', docId); // Reference to the document

        // Delete the document
        deleteDoc(docRef).then(() => {
          alert('Record deleted successfully!');
          this.fetchRecords(); // Refresh the records after deletion
        }).catch((error) => {
          console.error('Error deleting record: ', error);
          alert('Error deleting record: ' + error.message);
        });
      } else {
        alert('Record not found.');
      }
    }).catch((error) => {
      console.error('Error fetching records for deletion: ', error);
      alert('Error fetching records for deletion: ' + error.message);
    });
  } else {
    alert('No user is logged in');
  }
}

  // Populate input fields with selected record values
  populateFields(record: BogueRecord): void {
    this.cao = record.cao; // Set cao from the selected record
    this.sio2 = record.sio2; // Set sio2 from the selected record
    this.al2o3 = record.al2o3; // Set al2o3 from the selected record
    this.fe2o3 = record.fe2o3; // Set fe2o3 from the selected record
    this.so3 = record.so3; // Set so3 from the selected record
    this.calculateBogue(this.cao, this.sio2, this.al2o3, this.fe2o3, this.so3); // Recalculate with new values
  }


  // bogue calculation function
  calculateBogue(cao: number, sio2: number, al2o3: number, fe2o3: number, so3: number): void {


    // calculates the alumina to ferric oxide ratio
    // (necessary to determine which formula to use)
    const afRatio = this.al2o3 / this.fe2o3;

    // declaration of resultant variables
    let formulaUsed, c3s, c2s, c3a, c4af;

    // formula for if af ratio is greater than or equal to 0.64
    if (afRatio >= 0.64) {
      formulaUsed = "A/F Ratio >= 0.64";
      c3s = 4.071 * this.cao - 7.600 * this.sio2 - 6.718 * this.al2o3 - 1.430 * this.fe2o3 - 2.852 * this.so3;
      c3a = 2.650 * this.al2o3 - 1.692 * this.fe2o3;
      c4af = 3.043 * this.fe2o3;
    } else { // formula for if af ratio is less than 0.64
      formulaUsed = "A/F Ratio < 0.64";
      c3s = 4.071 * this.cao - 7.600 * this.sio2 - 4.479 * this.al2o3 - 2.859 * this.fe2o3 - 2.852 * this.so3;
      c3a = 0;
      c4af = 2.100 * this.al2o3 + 1.702 * this.fe2o3;
    }

    // this calculation is the same for both cases
    c2s = 2.867 * this.sio2 - 0.7544 * c3s;

    // gathers calculated variables to be used in bogue.component.html
    this.results = {
      formulaUsed,
      c3s,
      c2s,
      c3a,
      c4af,
      afRatio
    };
  }
}

