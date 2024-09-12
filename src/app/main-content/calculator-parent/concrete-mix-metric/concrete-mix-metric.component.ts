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
function calculateTotalSSDMixAmountKgs(ingredients: Ingredient[]): number {
  let totalSSDMixAmountKgs = 0;
  ingredients.forEach(ingredient => {
    totalSSDMixAmountKgs += ingredient.SSDMixAmountKgs;
  });
  return parseFloat(totalSSDMixAmountKgs.toFixed(8));
}

// Function to calculate stockMixAmountKgs
function calculateStockMixAmountKgs(ingredients: Ingredient[], fineAggregateMC: number, coarseAggregateMC: number): void {
  const fineAggregate = ingredients.find(ingredient => ingredient.name === 'Fine Aggregates');
  const coarseAggregate = ingredients.find(ingredient => ingredient.name === 'Coarse Aggregates');
  
  ingredients.forEach(ingredient => {
    switch (ingredient.name) {
      case 'Cement':
      case 'Fly ash':
      case 'Blast Furnace Slag':
        ingredient.stockMixAmountKgs = ingredient.SSDMixAmountKgs;
        break;
      case 'Fine Aggregates':
        ingredient.stockMixAmountKgs = parseFloat((ingredient.SSDMixAmountKgs * (1 + fineAggregateMC / 100)).toFixed(8));
        break;
      case 'Coarse Aggregates':
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
  { name: 'Cement', kg: 680, SG: 3.15, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  { name: 'Fly ash', kg: 0, SG: 2.5, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  { name: 'Blast Furnace Slag', kg: 0, SG: 2.8, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  { name: 'Fine Aggregates', kg: 1100, SG: 2.5, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  { name: 'Coarse Aggregates', kg: 1800, SG: 2.6, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
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
  isImperial: boolean = false;
  displayedColumns: string[] = ['ingredient', 'kg', 'Specific gravity', 'Meter cubed', 'One meter cubed', 'SSDMixAmountMeterCubed', 'SSDMixAmountKgs', 'stockMixAmountKgs'];
  dataSource: Ingredient[] = [];
  userVolume: number = 40;
  mixVolume: number = 0;
  fineAggregate: number = 1100;
  coarseAggregate: number = 1800;
  fineAggregateMC: number = 1;
  coarseAggregateMC: number = 1;

  constructor(private router: Router) { 
    this.initializeData();
  }

  initializeData(): void {
    this.dataSource = this.calculateIngredients(initialIngredientData);
  }

  onUnitToggleChange(event: any): void {
    this.isImperial = event.checked;
    if (this.isImperial) {
      this.router.navigate(['/calc/concretemix']); 
    } else {
      this.router.navigate(['/calc/concretemixmetric']); 
    }
  }
  
  calculateIngredients(ingredients: Ingredient[]): Ingredient[] {
    // Calculate meterCubed for each ingredient
    let calculatedIngredients = ingredients.map(ingredient => ({
      ...ingredient,
      meterCubed: calculateMeterCubed(ingredient.kg, ingredient.SG),
      oneMeterCubed: 0,
      SSDMixAmountMeterCubed: 0,
      SSDMixAmountKgs: 0,
      stockMixAmountKgs: 0
    }));

    // Calculate mixVolume
    this.mixVolume = this.userVolume + (0.15 * this.userVolume);

    // Calculate and add air MeterCubed
    const airMeterCubed = calculateAirMeterCubed(calculatedIngredients);
    calculatedIngredients.push({ name: 'Air', kg: 0, SG: 0, meterCubed: airMeterCubed, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 });

    // Calculate total kg 
    const totalKg = calculateTotalKg(calculatedIngredients);
    
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

    // Add totals row
    calculatedIngredients.push({ name: 'Total', kg: totalKg, SG: 0, meterCubed: totalMeterCubed, oneMeterCubed: totalOneMeterCubed, SSDMixAmountMeterCubed: totalSSDMixAmountMeterCubed, SSDMixAmountKgs: totalSSDMixAmountKgs, stockMixAmountKgs: totalStockMixAmountKgs});

    return calculatedIngredients;
  }

  onUserVolumeChange(): void {
    if (this.userVolume <= 0) {
      this.userVolume = 1;
    }
    this.mixVolume = this.userVolume + 0.15 * this.userVolume;
    calculateSSDMixAmountMeterCubed(this.dataSource, this.mixVolume);
    calculateSSDMixAmountKgs(this.dataSource);
  }

  onFineAggregateMCChange(): void {
    const ingredient = this.dataSource.find(ing => ing.name === 'Fine Aggregates');
    if (ingredient) {
      ingredient.kg = this.fineAggregate;
      this.dataSource = this.calculateIngredients(initialIngredientData);
    }
  }

  onCoarseAggregateMCChange(): void {
    const ingredient = this.dataSource.find(ing => ing.name === 'Coarse Aggregates');
    if (ingredient) {
      ingredient.kg = this.coarseAggregate;
      this.dataSource = this.calculateIngredients(initialIngredientData);
    }
  }
}