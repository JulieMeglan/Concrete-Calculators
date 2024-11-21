import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';

import { Firestore, addDoc, collection, collectionData, query, where, getDocs, orderBy, deleteDoc, doc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

interface MetricConcreteMixRecord {
  userVolume: number;
  fineAggregateMC: number;
  coarseAggregateMC: number;
  cementKg: number;
  cementSG: number;
  blastFurnanceSlagKg: number;
  blastFurnanceSlagSG: number; 
  flyAshKg: number;
  flyAshSG: number; 
  fineAggregatesKg: number;
  fineAggregatesSG: number;
  coarseAggregatesKg: number;
  coarseAggregatesSG: number;
  waterKg: number;
  waterSG: number;
  airContent: number; 
}

export interface Ingredient {
  name: string;
  kg: number;
  SG: number;
  meterCubed: number;
  oneMeterCubed: number;
  SSDMixAmountMeterCubed: number;
  SSDMixAmountKgs: number;
  stockMixAmountKgs: number;
}

// Function to calculate total kg
function calculateTotalKg(ingredients: Ingredient[]): number {
  let totalKg = 0;
  ingredients.forEach(ingredient => {
    totalKg += ingredient.kg;
  });
  return parseFloat(totalKg.toFixed(8));
}

// Function to calculate total SG
function calculateTotalSG(ingredients: Ingredient[]): number {
  let totalSG = 0;
  ingredients.forEach(ingredient => {
    totalSG += ingredient.SG;
  });
  return parseFloat(totalSG.toFixed(8));
}

// Function to calculate meterCubed
function calculateMeterCubed(kg: number, SG: number): number {
  if (SG === 0) {
    return 0;
  }
  return parseFloat((kg / (SG * 998)).toFixed(8));
}

// Function to calculate totalMeterCubed
function calculateTotalMeterCubed(ingredients: Ingredient[]): number {
  let totalMeterCubed = 0;
  ingredients.forEach(ingredient => {
    totalMeterCubed += ingredient.meterCubed;
  });
  return parseFloat(totalMeterCubed.toFixed(8));
}

// Function to calculate oneMeterCubed
function calculateOneMeterCubed(ingredient: Ingredient, totalMeterCubed: number): number {
  if (totalMeterCubed === 0 || isNaN(totalMeterCubed)) {
    return 0; // Handle division by zero or NaN case
  }
  return parseFloat((ingredient.meterCubed / totalMeterCubed).toFixed(8));
}

// Function to calculate airMeterCubed
function calculateAirMeterCubed(ingredients: Ingredient[]): number {
  let meterCubedTotalMinusAir = 0;
  ingredients.forEach(ingredient => {
    if (ingredient.name !== 'Air' && ingredient.name !== 'Coarse Aggregates') {
      meterCubedTotalMinusAir += ingredient.meterCubed;
    }
  });
  const airMeterCubed = (meterCubedTotalMinusAir / 0.94) - meterCubedTotalMinusAir;
  return parseFloat(airMeterCubed.toFixed(8));
}

// Function to calculate totalOneMeterCubed
function calculateTotalOneMeterCubed(ingredients: Ingredient[]): number {
  let totalOneMeterCubed = 0;
  ingredients.forEach(ingredient => {
    totalOneMeterCubed += ingredient.oneMeterCubed;
  });
  return parseFloat(totalOneMeterCubed.toFixed(8));
}

// Function to calculate SSDMixAmountMeterCubed
function calculateSSDMixAmountMeterCubed(ingredients: Ingredient[], mixVolume: number): void {
  ingredients.forEach(ingredient => {
    ingredient.SSDMixAmountMeterCubed = parseFloat((ingredient.oneMeterCubed * mixVolume).toFixed(8));
  });

  calculateTotalSSDMixAmountMeterCubed(ingredients);
}

// Function to calculate totalSSDMixAmountMeterCubed
function calculateTotalSSDMixAmountMeterCubed(ingredients: Ingredient[]): number {
  let totalSSDMixAmountMeterCubed = 0;
  ingredients.forEach(ingredient => {
    totalSSDMixAmountMeterCubed += ingredient.SSDMixAmountMeterCubed;
  });
  return parseFloat(totalSSDMixAmountMeterCubed.toFixed(8));
}

// Function to calculate SSDMixAmountKgs
function calculateSSDMixAmountKgs(ingredients: Ingredient[]): void {
  ingredients.forEach(ingredient => {
    ingredient.SSDMixAmountKgs = parseFloat((ingredient.SG * ingredient.SSDMixAmountMeterCubed * 998).toFixed(8));
  });
}

// Function to calculate totalSSDMixAmountKgs
// Function to calculate totalSSDMixAmountKgs excluding the "Total" ingredient
function calculateTotalSSDMixAmountKgs(ingredients: Ingredient[]): number {
  let totalSSDMixAmountKgs = 0;
  ingredients.forEach(ingredient => {
    if (ingredient.name !== "Total") { // Exclude the ingredient with name "Total"
      totalSSDMixAmountKgs += ingredient.SSDMixAmountKgs;
    }
  });
  return parseFloat(totalSSDMixAmountKgs.toFixed(8));
}


// Function to calculate stockMixAmountKgs
function calculateStockMixAmountKgs(ingredients: Ingredient[], fineAggregateMC: number, coarseAggregateMC: number): void {
  const fineAggregate = ingredients.find(ingredient => ingredient.name === 'Fine aggregates');
  const coarseAggregate = ingredients.find(ingredient => ingredient.name === 'Coarse aggregates');
  
  ingredients.forEach(ingredient => {
    switch (ingredient.name) {
      case 'Cement':
      case 'Fly ash':
      case 'Blast furnace slag':
        ingredient.stockMixAmountKgs = ingredient.SSDMixAmountKgs;
        break;
      case 'Fine aggregates':
        ingredient.stockMixAmountKgs = parseFloat((ingredient.SSDMixAmountKgs * (1 + fineAggregateMC / 100)).toFixed(8));
        break;
      case 'Coarse aggregates':

        ingredient.stockMixAmountKgs = parseFloat((ingredient.SSDMixAmountKgs * (1 + coarseAggregateMC / 100)).toFixed(8));
        break;
      case 'Water':
        const fineAggDifference = fineAggregate ? (fineAggregate.SSDMixAmountKgs - fineAggregate.stockMixAmountKgs) : 0;
        const coarseAggDifference = coarseAggregate ? (coarseAggregate.SSDMixAmountKgs - coarseAggregate.stockMixAmountKgs) : 0;
        ingredient.stockMixAmountKgs = parseFloat((ingredient.SSDMixAmountKgs + fineAggDifference + coarseAggDifference).toFixed(8));
        break;
      default:
        ingredient.stockMixAmountKgs = 0;
    }
  });
}

// Function to calculate totalStockMixAmountKgs
function calculateTotalStockMixAmountKgs(ingredients: Ingredient[]): number {
  let totalStockMixAmountKgs = 0;
  ingredients.forEach(ingredient => {
    totalStockMixAmountKgs += ingredient.stockMixAmountKgs;
  });
  return parseFloat(totalStockMixAmountKgs.toFixed(8));
}

const initialIngredientData: Ingredient[] = [
  { name: 'Cement', kg: 1020, SG: 3.15, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  { name: 'Fly ash', kg: 0, SG: 2.5, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  { name: 'Blast furnace slag', kg: 0, SG: 2.8, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  { name: 'Fine aggregates', kg: 1100, SG: 2.5, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  { name: 'Coarse aggregates', kg: 1800, SG: 2.6, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  { name: 'Water', kg: 340, SG: 1.0, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  //water has to come after aggregates b/c of calculateStockMixAmountLbs function
];

@Component({
  selector: 'app-concrete-mix-metric',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatTableModule, MatSlideToggleModule],
  templateUrl: './concrete-mix-metric.component.html',
  styleUrls: ['./concrete-mix-metric.component.css']
})
export class ConcreteMixMetricComponent {
  isMetric: boolean = true;
  displayedColumns: string[] = ['ingredient', 'kg', 'Specific gravity', 'Meter cubed', 'One meter cubed', 'SSDMixAmountMeterCubed', 'SSDMixAmountKgs', 'stockMixAmountKgs'];
  dataSource: Ingredient[] = [];
  userVolume: number = 40;
  mixVolume: number = 0;
  fineAggregateMC: number = 1;
  coarseAggregateMC: number = 1;
  cementKg: number = 1020;
  cementSG: number = 3.15;
  blastFurnanceSlagKg: number = 0;
  blastFurnanceSlagSG: number = 2.8; 
  flyAshKg: number = 0;
  flyAshSG: number = 2.5; 
  fineAggregatesKg: number = 1100;
  fineAggregatesSG: number = 2.6;
  coarseAggregatesKg: number = 1800;
  coarseAggregatesSG: number = 2.6;
  waterKg: number = 340;
  waterSG: number = 1;
  airContent: number = 6; 
  waterContentRatio: number = 0.41;
  userRecords: {   userVolume: number, fineAggregateMC: number, coarseAggregateMC: number, cementKg: number, cementSG: number, blastFurnanceSlagKg: number;
    blastFurnanceSlagSG: number, flyAshKg: number, flyAshSG: number, fineAggregatesKg: number, fineAggregatesSG: number, coarseAggregatesKg: number;
    coarseAggregatesSG: number, waterKg: number, waterSG: number, airContent: number   }[] = []; // stores records fetched from Firestore
  showRecords: boolean = false; // This controls the visibility of the records section

  constructor(private router: Router, private firestore: Firestore, private auth: Auth) { 
    this.initializeData();
  }

  saveToFirestore(): void {
    // Get the current authenticated user
    const user = this.auth.currentUser;
  
    if (user && user.emailVerified) {
      // Reference the collection where data will be saved
      const testCollection = collection(this.firestore, 'metricConcreteMix');
      
      // Add a new document with the current values and the user's UID
      addDoc(testCollection, {
        userVolume: this.userVolume,
        fineAggregatesKg: this.fineAggregatesKg,
        fineAggregatesSG: this.fineAggregatesSG,
        coarseAggregatesKg: this.coarseAggregatesKg,
        coarseAggregatesSg: this.coarseAggregatesSG,
        fineAggregateMC: this.fineAggregateMC,
        coarseAggregateMC: this.coarseAggregateMC,
        cementKg: this.cementKg,
        cementSG: this.cementSG,
        blastFurnanceSlagKg: this.blastFurnanceSlagKg,
        blastFurnanceSlagSG: this.blastFurnanceSlagSG,
        flyAshKg: this.flyAshKg,
        flyAshSG: this.flyAshSG,
        waterKg: this.waterKg,
        waterSG: this.waterSG,
        airContent: this.airContent,
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
        // Define records as an array of MortarMixRecord
        const records: MetricConcreteMixRecord[] = [];

        // Reference to the collection
        const testCollection = collection(this.firestore, 'metricConcreteMix');
        const q = query(
          testCollection,
          where('uid', '==', user.uid),
          orderBy('timestamp', 'desc') // This sorts records by timestamp, newest first
        );

        // Use getDocs to fetch multiple documents
        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data() as MetricConcreteMixRecord; // Ensure that data is typed as MortarMixRecord

            if (data) {
              records.push({
                userVolume: data.userVolume || 0,
                fineAggregatesKg: data.fineAggregatesKg || 0,
                fineAggregatesSG: data.fineAggregatesSG || 0,
                coarseAggregatesKg: data.coarseAggregatesKg || 0,
                coarseAggregatesSG: data.coarseAggregatesSG ||0,
                fineAggregateMC: data.fineAggregateMC || 0,
                coarseAggregateMC: data.coarseAggregateMC || 0,
                cementKg: data.cementKg || 0,
                cementSG: data.cementSG || 0,
                blastFurnanceSlagKg: data.blastFurnanceSlagKg || 0,
                blastFurnanceSlagSG: data.blastFurnanceSlagSG || 0,
                flyAshKg: data.flyAshKg || 0,
                flyAshSG: data.flyAshSG || 0,
                waterKg: data.waterKg || 0,
                waterSG: data.waterSG || 0,
                airContent: data.airContent || 0
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

  deleteRecord(record: MetricConcreteMixRecord): void {
    const user = this.auth.currentUser;
  
    if (user && user.emailVerified) {
      // Reference to the collection
      const testCollection = collection(this.firestore, 'metricConcreteMix');
      
      // Query to find the document to delete
      const q = query(
        testCollection,
        where('uid', '==', user.uid),
        where('userVolume', '==', record.userVolume),
        where('fineAggregatesKg', '==', record.fineAggregatesKg),
        where('fineAggregatesSG', '==', record.fineAggregatesSG),
        where('coarseAggregatesKg', '==', record.coarseAggregatesKg),
        where('coarseAggregatesSG', '==', record.coarseAggregatesSG),
        where('fineAggregateMC', '==', record.fineAggregateMC),
        where('coarseAggregateMC', '==', record.coarseAggregateMC),
        where('cementKg', '==', record.cementKg),
        where('cementSG', '==', record.cementSG),
        where('blastFurnanceSlagKg', '==', record.blastFurnanceSlagKg),
        where('blastFurnanceSlagSG', '==', record.blastFurnanceSlagSG),
        where('flyAshKg', '==', record.flyAshKg),
        where('flyAshSG', '==', record.flyAshSG),
        where('waterKg', '==', record.waterKg),
        where('waterSG', '==', record.waterSG),
        where('airContent', '==', record.airContent)
      );
  
      // Fetch the document to delete
      getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id; // Get the document ID
          const docRef = doc(this.firestore, 'metricConcreteMix', docId); // Reference to the document
  
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
  populateFields(record: MetricConcreteMixRecord): void {
    this.userVolume = record.userVolume;
    this.fineAggregatesKg = record.fineAggregatesKg;
    this.fineAggregatesSG = record.fineAggregatesSG;
    this.coarseAggregatesKg = record.coarseAggregatesKg;
    this.coarseAggregatesSG = record.coarseAggregatesSG;
    this.fineAggregateMC = record.fineAggregateMC;
    this.coarseAggregateMC = record.coarseAggregateMC;
    this.cementKg = record.cementKg;
    this.cementSG = record.cementSG;
    this.blastFurnanceSlagKg = record.blastFurnanceSlagKg;
    this.blastFurnanceSlagSG = record.blastFurnanceSlagSG;
    this.flyAshKg = record.flyAshKg;
    this.flyAshSG = record.flyAshSG;
    this.waterKg = record.waterKg;
    this.waterSG = record.waterSG;
    this.airContent = record.airContent;
    this.onUserVolumeChange();
    this.onFineAggregatesKgChange();
    this.onFineAggregatesSGChange();
    this.onCoarseAggregatesKgChange();
    this.onCoarseAggregatesSGChange();
    //this.onFineAggregateMCChange(); // don't call this function here
    this.onCementKgChange();
    this.onCementSGChange();
    this.onBlastFurnaceSlagKgChange();
    this.onBlastFurnaceSlagSGChange();
    this.onFlyAshKgChange();
    this.onFlyAshSGChange();
    this.onWaterKgChange();
    this.onWaterSGChange();
    this.onAirContentChange(this.airContent);
  }

  initializeData(): void {
    this.dataSource = this.calculateIngredients(initialIngredientData);
  }

  onUnitToggleChange(event: any): void {
    this.isMetric = event.checked;
    if (this.isMetric) {
      this.router.navigate(['/calc/concretemixmetric']); 
    } else {
      this.router.navigate(['/calc/concretemix']); 
    }
  }

  onAirContentChange(newAirContent: number): void {
    this.airContent = newAirContent;
    this.dataSource = this.calculateIngredients(this.dataSource);

  }
  
  calculateIngredients(ingredients: Ingredient[]): Ingredient[] {
    // Remove any existing totals and air rows to prevent duplication
    const filteredIngredients = ingredients.filter(ingredient => ingredient.name !== 'Total' && ingredient.name !== 'Air');
  
    // Calculate meterCubed for each ingredient
    let calculatedIngredients = filteredIngredients.map(ingredient => ({

      ...ingredient,
      meterCubed: calculateMeterCubed(ingredient.kg, ingredient.SG),
      oneMeterCubed: 0,
      SSDMixAmountMeterCubed: 0,
      SSDMixAmountKgs: 0,
      stockMixAmountKgs: 0
    }));
  
    // Calculate mixVolume
    this.mixVolume = this.userVolume;
  
    // Calculate air MeterCubed
    const airMeterCubed = calculateAirMeterCubed(calculatedIngredients);
    
    // Create and add the 'Air' ingredient
    const airIngredient: Ingredient = {
      name: 'Air',
      kg: 0,
      SG: 0,
      meterCubed: airMeterCubed,
      oneMeterCubed: 0,
      SSDMixAmountMeterCubed: 0,
      SSDMixAmountKgs: 0,
      stockMixAmountKgs: 0
    };
    calculatedIngredients.push(airIngredient);
  
    // Calculate total kg 
    const totalKg = calculateTotalKg(calculatedIngredients);

    // Calculate total SG
    const totalSG = calculateTotalSG(calculatedIngredients);
    
    // Calculate total meter cubed after meterCubed values are set
    const totalMeterCubed = calculateTotalMeterCubed(calculatedIngredients);

    // Update oneMeterCubed for each ingredient using totalMeterCubed
    calculatedIngredients.forEach(ingredient => {
      ingredient.oneMeterCubed = calculateOneMeterCubed(ingredient, totalMeterCubed);
    });
  
    // Calculate totalOneMeterCubed
    const totalOneMeterCubed = calculateTotalOneMeterCubed(calculatedIngredients);
  
    // Update SSDMixAmountMeterCubed for each ingredient
    calculateSSDMixAmountMeterCubed(calculatedIngredients, this.mixVolume);
  
    // Calculate totalSSDMixAmountMeterCubed
    const totalSSDMixAmountMeterCubed = calculateTotalSSDMixAmountMeterCubed(calculatedIngredients);
  
    // Update SSDMixAmountKgs for each ingredient
    calculateSSDMixAmountKgs(calculatedIngredients);
  
    // Calculate totalSSDMixAmountKgs
    const totalSSDMixAmountKgs = calculateTotalSSDMixAmountKgs(calculatedIngredients);
  
    // Calculate stockMixAmountKgs for each ingredient
    calculateStockMixAmountKgs(calculatedIngredients, this.fineAggregateMC, this.coarseAggregateMC);
  
    // Calculate totalStockMixAmountKgs
    const totalStockMixAmountKgs = calculateTotalStockMixAmountKgs(calculatedIngredients);
  
    // Calculate waterContentRatio
    this.waterContentRatio = this.calculateWaterContentRatio();

    // Add totals row only once
    calculatedIngredients.push({
      name: 'Total',
      kg: totalKg,
      SG: totalSG,
      meterCubed: totalMeterCubed,
      oneMeterCubed: totalOneMeterCubed,
      SSDMixAmountMeterCubed: totalSSDMixAmountMeterCubed,
      SSDMixAmountKgs: totalSSDMixAmountKgs,
      stockMixAmountKgs: totalStockMixAmountKgs
    });
  
    return calculatedIngredients;
  }

  calculateWaterContentRatio(): number {
    if (this.cementKg + this.flyAshKg + this.blastFurnanceSlagKg === 0) {
      return 0; // Avoid division by zero
    }
    return parseFloat((this.waterKg / (this.cementKg + this.flyAshKg + this.blastFurnanceSlagKg)).toFixed(2));
  }

  onUserVolumeChange(): void {
    if (this.userVolume <= 0) {
      this.userVolume = 1;
    }
    this.dataSource = this.calculateIngredients(this.dataSource);
  }

  onFineAggregateMCChange(): void {
    const ingredient = this.dataSource.find(ing => ing.name === 'Fine aggregates');
    if (ingredient) {
      ingredient.kg = this.fineAggregatesKg;

      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }

  onCoarseAggregateMCChange(): void {
    const ingredient = this.dataSource.find(ing => ing.name === 'Coarse aggregates');
    if (ingredient) {
      ingredient.kg = this.coarseAggregatesKg;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }

  onCementKgChange() {
    const cement = this.dataSource.find(ing => ing.name === 'Cement');
    if (cement) {
      cement.kg = this.cementKg;
      this.dataSource = this.calculateIngredients(this.dataSource);    }
  }
  
  onCementSGChange() {
    const cement = this.dataSource.find(ing => ing.name === 'Cement');
    if (cement) {
      cement.SG = this.cementSG;
      this.dataSource = this.calculateIngredients(this.dataSource);    }
  }

  onFlyAshKgChange() {
    const flyAsh = this.dataSource.find(ing => ing.name === 'Fly ash');
    if (flyAsh) {
      flyAsh.kg = this.flyAshKg;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }

  onFlyAshSGChange() {
    const flyAsh = this.dataSource.find(ing => ing.name === 'Fly ash');
    if (flyAsh) {
      flyAsh.SG = this.flyAshSG;
      this.dataSource = this.calculateIngredients(this.dataSource);    }
  }
  
  onBlastFurnaceSlagKgChange() {
    const blastFurnaceSlag = this.dataSource.find(ing => ing.name === 'Blast furnace slag');
    if (blastFurnaceSlag) {
      blastFurnaceSlag.kg = this.blastFurnanceSlagKg;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }

  onBlastFurnaceSlagSGChange() {
    const blastFurnaceSlag = this.dataSource.find(ing => ing.name === 'Blast furnace slag');
    if (blastFurnaceSlag) {
      blastFurnaceSlag.SG = this.blastFurnanceSlagSG;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }
  
  onFineAggregatesKgChange() {
    const fineAggregates = this.dataSource.find(ing => ing.name === 'Fine aggregates');
    if (fineAggregates) {
      fineAggregates.kg = this.fineAggregatesKg;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }

  onFineAggregatesSGChange() {
    const fineAggregates = this.dataSource.find(ing => ing.name === 'Fine aggregates');
    if (fineAggregates) {
      fineAggregates.SG = this.fineAggregatesSG;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }
  
  onCoarseAggregatesKgChange() {
    const coarseAggregates = this.dataSource.find(ing => ing.name === 'Coarse aggregates');
    if (coarseAggregates) {
      coarseAggregates.kg = this.coarseAggregatesKg;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }

  onCoarseAggregatesSGChange() {
    const coarseAggregates = this.dataSource.find(ing => ing.name === 'Coarse aggregates');
    if (coarseAggregates) {
      coarseAggregates.SG = this.coarseAggregatesSG;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }
  
  onWaterKgChange() {
    const water = this.dataSource.find(ing => ing.name === 'Water');
    if (water) {
      water.kg = this.waterKg;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }

  onWaterSGChange() {
    const water = this.dataSource.find(ing => ing.name === 'Water');
    if (water) {
      water.SG = this.waterSG;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }
  
}