import { Component, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Firestore, addDoc, collection, collectionData, query, where, getDocs, orderBy, deleteDoc, doc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

interface TCPowersRecord {
  alpha: number;
  wcRatio: number;
}

//chart stuff
import { ChartOptions, ChartType } from 'chart.js';
import { ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-tcpowers',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatTableModule, BaseChartDirective, MatSelectModule],
  templateUrl: './tcpowers.component.html',
  styleUrl: './tcpowers.component.css'
})


export class TcpowersComponent {

  constructor(private firestore: Firestore, private auth: Auth){
  }
  // variable declarations for tc powers calculations
  wc: number = 0; // variable for water/cement ratio
  alpha: number = 0; // variable for degree of hydration
  showRecords: boolean = false; // This controls the visibility of the records section
  results: any; // stores values resulting from tc powers formula
  userRecords: { alpha: number, wcRatio: number }[] = []; // stores records fetched from Firestore
  
  // defines the columns displayed in the table
  displayedColumns: string[] = [
    'wn', 'wg', 'vg', 'vhp', 'vc', 'vu', 'vp', 'pg', 'pc', 'x', 'wmin'
  ];

  saveToFirestore(): void {
    // Get the current authenticated user
    const user = this.auth.currentUser;
  
    if (user && user.emailVerified) {
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
    // Toggle the visibility of the records section
    this.showRecords = !this.showRecords;

    if (this.showRecords) {
      const user = this.auth.currentUser;

      if (user && user.emailVerified) {
        // Define records as an array of TCPowersRecord
        const records: TCPowersRecord[] = [];

        // Reference to the collection
        const testCollection = collection(this.firestore, 'tcpowers');
        const q = query(
          testCollection,
          where('uid', '==', user.uid),
          orderBy('timestamp', 'desc') // This sorts records by timestamp, newest first
        );

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

          // Assign records to the component's variable for display
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

  deleteRecord(record: TCPowersRecord): void {
    const user = this.auth.currentUser;
  
    if (user && user.emailVerified) {
      // Reference to the collection
      const testCollection = collection(this.firestore, 'tcpowers');
      
      // Query to find the document to delete
      const q = query(
        testCollection,
        where('uid', '==', user.uid),
        where('wcRatio', '==', record.wcRatio),
        where('alpha', '==', record.alpha)
      );
  
      // Fetch the document to delete
      getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id; // Get the document ID
          const docRef = doc(this.firestore, 'tcpowers', docId); // Reference to the document
  
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


  /*
  //chart stuff below -----------------------------------------------
  numGraphOptions: number[] = [1, 2, 3, 4, 5]; 
  numGraphs = 5;

  // Initialize arrays based on the number of graphs
  graphWC: number[] = Array(this.numGraphs).fill('');
  graphDH: number[] = Array(this.numGraphs).fill('');

  graphVu: number[] = Array(this.numGraphs).fill(25);
  graphVg: number[] = Array(this.numGraphs).fill(15);
  graphPg: number[] = Array(this.numGraphs).fill(10);
  graphPc: number[] = Array(this.numGraphs).fill(50);

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };

  public barChartLabels: string[] = Array(this.numGraphs).fill('').map((_, i) => `Equation ${i + 1}`);
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataset[] = [
    { data: this.graphVu, label: 'Vu' },
    { data: this.graphVg, label: "V'g" },
    { data: this.graphPg, label: 'Pg' },
    { data: this.graphPc, label: 'Pc' }
  ];

  // Getter for dynamically creating an array for ngFor
  get graphsArray() {
    return Array.from({ length: this.numGraphs });
  }

  updateGraphData() {
    // Update the labels based on the current number of graphs
    this.barChartLabels = Array(this.numGraphs).fill('').map((_, i) => `Equation ${i + 1}`);
  
    // Ensure each dataset has the correct number of entries
    this.barChartData[0].data = Array(this.numGraphs).fill('').map((_, i) => this.graphVu[i] || 0);
    this.barChartData[1].data = Array(this.numGraphs).fill('').map((_, i) => this.graphVg[i] || 0);
    this.barChartData[2].data = Array(this.numGraphs).fill('').map((_, i) => this.graphPg[i] || 0);
    this.barChartData[3].data = Array(this.numGraphs).fill('').map((_, i) => this.graphPc[i] || 0);
  }
  onNumGraphsChange() {
    // Adjust the size of the arrays when numGraphs changes
    this.graphWC = Array(this.numGraphs).fill('');
    this.graphDH = Array(this.numGraphs).fill('');

    this.graphVu = Array(this.numGraphs).fill('');
    this.graphVg = Array(this.numGraphs).fill('');
    this.graphPg = Array(this.numGraphs).fill('');
    this.graphPc = Array(this.numGraphs).fill('');
    this.updateGraphData();
  }

  calculateTCPowerGraph(graphWC: number[], graphDH: number[]): void {

    
  }
  */
}
