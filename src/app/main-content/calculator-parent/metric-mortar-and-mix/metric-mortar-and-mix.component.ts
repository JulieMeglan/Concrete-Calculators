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
  const fineAggregate = ingredients.find(ingredient => ingredient.name === 'Fine aggregates');
  
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
      case 'Water':
        const fineAggDifference = fineAggregate ? (fineAggregate.SSDMixAmountKgs - fineAggregate.stockMixAmountKgs) : 0;
        ingredient.stockMixAmountKgs = parseFloat((ingredient.SSDMixAmountKgs + fineAggDifference).toFixed(8));
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
  { name: 'Cement', kg: 600, SG: 3.15, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  { name: 'Fly ash', kg: 50, SG: 2.5, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  { name: 'Blast furnace slag', kg: 50, SG: 2.8, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  { name: 'Fine aggregates', kg: 1100, SG: 2.5, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  { name: 'Water', kg: 340, SG: 1.0, meterCubed: 0, oneMeterCubed: 0, SSDMixAmountMeterCubed: 0, SSDMixAmountKgs: 0, stockMixAmountKgs: 0 },
  //water has to come after aggregates b/c of calculateStockMixAmountLbs function
];

@Component({
  selector: 'app-concrete-mix-metric',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatTableModule, MatSlideToggleModule],
  templateUrl: './metric-mortar-and-mix.component.html',
  styleUrls: ['./metric-mortar-and-mix.component.css']
})
export class MetricMortarAndMixComponent {
  isMetric: boolean = true;
  displayedColumns: string[] = ['ingredient', 'kg', 'Specific gravity', 'Meter cubed', 'One meter cubed', 'SSDMixAmountMeterCubed', 'SSDMixAmountKgs', 'stockMixAmountKgs'];
  dataSource: Ingredient[] = [];
  userVolume: number = 40;
  mixVolume: number = 0;
  fineAggregateMC: number = 1;
  coarseAggregateMC: number = 1;
  cementKg: number = 600;
  blastFurnanceSlagKg: number = 50;
  flyAshKg: number = 50;
  fineAggregatesKg: number = 1100;
  waterKg: number = 340;
  airContent: number = 6; 
  waterContentRatio: number = 0.41;

  constructor(private router: Router) { 
    this.initializeData();
  }

  initializeData(): void {
    this.dataSource = this.calculateIngredients(initialIngredientData);
  }

  onUnitToggleChange(event: any): void { 
    this.isMetric = event.checked;
    if (this.isMetric) {
      this.router.navigate(['/calc/metric-mortarandmix']); 
    } else {
      this.router.navigate(['/calc/mortarandmix']); 
    }
  }

  onAirContentChange(newAirContent: number): void {
    this.airContent = newAirContent;
    this.dataSource = this.calculateIngredients(initialIngredientData);
  }
  
  calculateIngredients(ingredients: Ingredient[]): Ingredient[] {
    // Remove any existing totals rows to prevent duplication
    const filteredIngredients = ingredients.filter(ingredient => ingredient.name !== 'Total');
  
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
    calculateSSDMixAmountMeterCubed(this.dataSource, this.mixVolume);
    calculateSSDMixAmountKgs(this.dataSource);
  }

  onFineAggregateMCChange(): void {
    const ingredient = this.dataSource.find(ing => ing.name === 'Fine aggregates');
    if (ingredient) {
      ingredient.kg = this.fineAggregatesKg;

      this.dataSource = this.calculateIngredients(initialIngredientData);
    }
  }

  onCementKgChange() {
    const cement = this.dataSource.find(ing => ing.name === 'Cement');
    if (cement) {
      cement.kg = this.cementKg;
      this.dataSource = this.calculateIngredients(this.dataSource);    }
  }

  onFlyAshKgChange() {
    const flyAsh = this.dataSource.find(ing => ing.name === 'Fly ash');
    if (flyAsh) {
      flyAsh.kg = this.flyAshKg;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }
  
  onBlastFurnaceSlagKgChange() {
    const blastFurnaceSlag = this.dataSource.find(ing => ing.name === 'Blast furnace slag');
    if (blastFurnaceSlag) {
      blastFurnaceSlag.kg = this.blastFurnanceSlagKg;
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
  
  onCoarseAggregateMCChange(): void {
    const ingredient = this.dataSource.find(ing => ing.name === 'Coarse aggregates');
    if (ingredient) {
      // ingredient.kg = this.coarseAggregatesKg;
      this.dataSource = this.calculateIngredients(initialIngredientData);
    }
  }
  
  onWaterKgChange() {
    const water = this.dataSource.find(ing => ing.name === 'Water');
    if (water) {
      water.kg = this.waterKg;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }
  
}