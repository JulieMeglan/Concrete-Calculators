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
  lb: number;
  SG: number;
  ftCubed: number;
  oneFootCubed: number;
  oneYardCubed: number;
  SSDMixAmountFtCubed: number;
  SSDMixAmountLbs: number;
  stockMixAmountLbs: number;
}

// Function to calculate total lbs
function calculateTotalLb(ingredients: Ingredient[]): number {
  let totalLbs = 0;
  ingredients.forEach(ingredient => {
    totalLbs += ingredient.lb;
  });
  return parseFloat(totalLbs.toFixed(8));
}

// Function to calculate total SG
function calculateTotalSG(ingredients: Ingredient[]): number {
  let totalSG = 0;
  ingredients.forEach(ingredient => {
    totalSG += ingredient.SG;
  });
  return parseFloat(totalSG.toFixed(8));
}

// Function to calculate ftCubed
function calculateFtcubed(lb: number, SG: number): number {
  if (SG === 0) {
    return 0;
  }
  return parseFloat((lb / (SG * 62.4)).toFixed(8));
}

// Function to calculate totalFtCubed
function calculateTotalFtCubed(ingredients: Ingredient[]): number {
  let totalFtCubed = 0;
  ingredients.forEach(ingredient => {
    totalFtCubed += ingredient.ftCubed;
  });
  return parseFloat(totalFtCubed.toFixed(8));
}

// Function to calculate oneFootCubed
function calculateOneFootCubed(ingredient: Ingredient, totalFtCubed: number): number {
  if (totalFtCubed === 0 || isNaN(totalFtCubed)) {
    return 0; // Handle division by zero or NaN case
  }
  return parseFloat((ingredient.ftCubed / totalFtCubed).toFixed(8));
}

// Function to calculate totalOneFootCubed
function calculateTotalOneFootCubed(ingredients: Ingredient[]): number {
  let totalOneFootCubed = 0;
  ingredients.forEach(ingredient => {
    totalOneFootCubed += ingredient.oneFootCubed;
  });
  return parseFloat(totalOneFootCubed.toFixed(8));
}

// Function to calculate oneYardCubed
function calculateOneYardCubed(ingredients: Ingredient[]): void {
  ingredients.forEach(ingredient => {
    ingredient.oneYardCubed = parseFloat((ingredient.oneFootCubed * 27).toFixed(8));
  });
}

// Function to calculate totalOneYardCubed
function calculateTotalOneYardCubed(ingredients: Ingredient[]): number {
  let totalOneYardCubed = 0;
  ingredients.forEach(ingredient => {
    totalOneYardCubed += ingredient.oneYardCubed;
  });
  return parseFloat(totalOneYardCubed.toFixed(8));
}

// Function to calculate SSDMixAmountFtCubed
function calculateSSDMixAmountFtCubed(ingredients: Ingredient[], userVolume: number): void {
  ingredients.forEach(ingredient => {
    ingredient.SSDMixAmountFtCubed = parseFloat((ingredient.oneFootCubed * userVolume).toFixed(8));
  });
}

// Function to calculate totalSSDMixAmountFtCubed
function calculateTotalSSDMixAmountFtCubed(ingredients: Ingredient[]): number {
  let totalSSDMixAmountFtCubed = 0;
  ingredients.forEach(ingredient => {
    totalSSDMixAmountFtCubed += ingredient.SSDMixAmountFtCubed;
  });
  return parseFloat(totalSSDMixAmountFtCubed.toFixed(8));
}

// Function to calculate SSDMixAmountLbs
function calculateSSDMixAmountLbs(ingredients: Ingredient[]): void {
  ingredients.forEach(ingredient => {
    ingredient.SSDMixAmountLbs = parseFloat((ingredient.SG * ingredient.SSDMixAmountFtCubed * 62.4).toFixed(8));
  });
}

// Function to calculate totalSSDMixAmountLbs
function calculateTotalSSDMixAmountLbs(ingredients: Ingredient[]): number {
  let totalSSDMixAmountLbs = 0;
  ingredients.forEach(ingredient => {
    totalSSDMixAmountLbs += ingredient.SSDMixAmountLbs;
  });
  return parseFloat(totalSSDMixAmountLbs.toFixed(8));
}

// Function to calculate stockMixAmountLbs
function calculateStockMixAmountLbs(ingredients: Ingredient[], fineAggregateMC: number): void {
  const fineAggregate = ingredients.find(ingredient => ingredient.name === 'Fine aggregates');
  
  ingredients.forEach(ingredient => {
    switch (ingredient.name) {
      case 'Cement':
      case 'Fly ash':
      case 'Blast furnace slag':
        ingredient.stockMixAmountLbs = ingredient.SSDMixAmountLbs;
        break;
      case 'Fine aggregates':
        ingredient.stockMixAmountLbs = parseFloat((ingredient.SSDMixAmountLbs * (1 + fineAggregateMC / 100)).toFixed(8));
        break;
      case 'Water':
        const fineAggDifference = fineAggregate ? (fineAggregate.SSDMixAmountLbs - fineAggregate.stockMixAmountLbs) : 0;
        ingredient.stockMixAmountLbs = parseFloat((ingredient.SSDMixAmountLbs + fineAggDifference).toFixed(8));
        break;
      default:
        ingredient.stockMixAmountLbs = 0;
    }
  });
}

// Function to calculate totalStockMixAmountLbs
function calculateTotalStockMixAmountLbs(ingredients: Ingredient[]): number {
  let totalStockMixAmountLbs = 0;
  ingredients.forEach(ingredient => {
    totalStockMixAmountLbs += ingredient.stockMixAmountLbs;
  });
  return parseFloat(totalStockMixAmountLbs.toFixed(8));
}

const initialIngredientData: Ingredient[] = [
  { name: 'Cement', lb: 600, SG: 3.15, ftCubed: 0, oneFootCubed: 0, oneYardCubed: 0, SSDMixAmountFtCubed: 0, SSDMixAmountLbs: 0, stockMixAmountLbs: 0 },
  { name: 'Fly ash', lb: 50, SG: 2.5, ftCubed: 0, oneFootCubed: 0, oneYardCubed: 0, SSDMixAmountFtCubed: 0, SSDMixAmountLbs: 0, stockMixAmountLbs: 0 },
  { name: 'Blast furnace slag', lb: 50, SG: 2.8, ftCubed: 0, oneFootCubed: 0, oneYardCubed: 0, SSDMixAmountFtCubed: 0, SSDMixAmountLbs: 0, stockMixAmountLbs: 0 },
  { name: 'Fine aggregates', lb: 1100, SG: 2.6, ftCubed: 0, oneFootCubed: 0, oneYardCubed: 0, SSDMixAmountFtCubed: 0, SSDMixAmountLbs: 0, stockMixAmountLbs: 0 },
  { name: 'Water', lb: 340, SG: 1.0, ftCubed: 0, oneFootCubed: 0, oneYardCubed: 0, SSDMixAmountFtCubed: 0, SSDMixAmountLbs: 0, stockMixAmountLbs: 0 },
  //water has to come after aggregates b/c of calculateStockMixAmountLbs function
];

@Component({
  selector: 'app-mortar-and-mix',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatTableModule, MatSlideToggleModule],
  templateUrl: './mortar-and-mix.component.html',
  styleUrls: ['./mortar-and-mix.component.css']
})

export class MortarAndMixComponent {
  isMetric: boolean = false;
  displayedColumns: string[] = ['ingredient', 'lb', 'Specific gravity', 'Feet cubed', 'One foot cubed', 'One yard cubed', 'SSDMixAmountFtCubed', 'SSDMixAmountLbs', 'stockMixAmountLbs'];
  dataSource: Ingredient[] = [];
  userVolume: number = 30;
  mixVolume: number = 0;
  fineAggregatesLb: number = 1100;
  fineAggregateMC: number = 1;
  cementLb: number = 600;
  blastFurnanceSlagLb: number = 50;
  flyAshLb: number = 50;
  waterLb: number = 340;
  waterContentRatio: number = 0.41;

  constructor(private router: Router) { // Inject the Router service
    this.initializeData();
  }

  initializeData(): void {
    this.dataSource = this.calculateIngredients(initialIngredientData);
  }

  onUnitToggleChange(event: any): void {
    this.isMetric = event.checked;
    if (this.isMetric) {
      this.router.navigate(['/calc/metric-mortarandmix']); // Navigate to the metric component
    } else {
      this.router.navigate(['/calc/mortarandmix']); // Navigate back to the imperial component
    }
  }

  calculateIngredients(ingredients: Ingredient[]): Ingredient[] {
    const filteredIngredients = ingredients.filter(ingredient => ingredient.name !== 'Total' && ingredient.name !== 'Air');

    // Calculate ftCubed for each ingredient
    let calculatedIngredients = filteredIngredients.map(ingredient => ({

      ...ingredient,
      ftCubed: calculateFtcubed(ingredient.lb, ingredient.SG),
      oneFootCubed: 0,
      oneYardCubed: 0,
      SSDMixAmountFtCubed: 0,
      SSDMixAmountLbs: 0,
      stockMixAmountLbs: 0
    }));

    // Calculate mixVolume
    let cubicFeet: number;
    cubicFeet = this.userVolume / Math.pow(12, 3); 
    this.mixVolume = cubicFeet + (0.15 * cubicFeet);
   
    // Calculate total lb
    const totalLb = calculateTotalLb(calculatedIngredients);

    // Calculate total SG
    const totalSG = calculateTotalSG(calculatedIngredients);

    // Calculate total feet cubed after ftCubed values are set
    const totalFtCubed = calculateTotalFtCubed(calculatedIngredients);

    // Update oneFootCubed for each ingredient using totalFtCubed
    calculatedIngredients.forEach(ingredient => {
      ingredient.oneFootCubed = calculateOneFootCubed(ingredient, totalFtCubed);
    });

    // Calculate oneYardCubed for each ingredient
    calculateOneYardCubed(calculatedIngredients);

    // Calculate totalOneFootCubed
    const totalOneFootCubed = calculateTotalOneFootCubed(calculatedIngredients);

    // Calculate totalOneYardCubed
    const totalOneYardCubed = calculateTotalOneYardCubed(calculatedIngredients);

    // Update SSDMixAmountFtCubed for each ingredient
    calculateSSDMixAmountFtCubed(calculatedIngredients, this.userVolume);

    // Calculate totalSSDMixAmountFtCubed
    const totalSSDMixAmountFtCubed = calculateTotalSSDMixAmountFtCubed(calculatedIngredients);

    // Update SSDMixAmountLbs for each ingredient
    calculateSSDMixAmountLbs(calculatedIngredients);

    // Calculate totalSSDMixAmountLbs
    const totalSSDMixAmountLbs = calculateTotalSSDMixAmountLbs(calculatedIngredients);

    // Calculate stockMixAmountLbs for each ingredient
    calculateStockMixAmountLbs(calculatedIngredients, this.fineAggregateMC);

    // Calculate totalStockMixAmountLbs
    const totalStockMixAmountLbs = calculateTotalStockMixAmountLbs(calculatedIngredients);

    // Calculate waterContentRatio
    this.waterContentRatio = this.calculateWaterContentRatio();

    // Add totals row only once
    calculatedIngredients.push({
      name: 'Total',
      lb: totalLb,
      SG: totalSG,
      ftCubed: totalFtCubed,
      oneFootCubed: totalOneFootCubed,
      oneYardCubed: totalOneYardCubed,
      SSDMixAmountFtCubed: totalSSDMixAmountFtCubed,
      SSDMixAmountLbs: totalSSDMixAmountLbs,
      stockMixAmountLbs: totalStockMixAmountLbs
    });

    return calculatedIngredients;
  }

  calculateWaterContentRatio(): number {
    if (this.cementLb + this.flyAshLb + this.blastFurnanceSlagLb === 0) {
      return 0; // Avoid division by zero
    }
    return parseFloat((this.waterLb / (this.cementLb + this.flyAshLb + this.blastFurnanceSlagLb)).toFixed(2));
  }

  onUserVolumeChange(): void {
    if (this.userVolume <= 0) {
      this.userVolume = 1;
    }
    let cubicFeet: number;
    cubicFeet = this.userVolume / Math.pow(12, 3); 
    this.mixVolume = cubicFeet + (0.15 * cubicFeet);    
    calculateSSDMixAmountFtCubed(this.dataSource, this.userVolume);

    calculateSSDMixAmountLbs(this.dataSource);
  }

  onFineAggregateMCChange(): void {
    const ingredient = this.dataSource.find(ing => ing.name === 'Fine aggregates');
    if (ingredient) {
      ingredient.lb = this.fineAggregatesLb;

      this.dataSource = this.calculateIngredients(initialIngredientData);
    }
  }

  onCementLbChange() {
    const cement = this.dataSource.find(ing => ing.name === 'Cement');
    if (cement) {
      cement.lb = this.cementLb;
      this.dataSource = this.calculateIngredients(this.dataSource);    }
  }

  onFlyAshLbChange() {
    const flyAsh = this.dataSource.find(ing => ing.name === 'Fly ash');
    if (flyAsh) {
      flyAsh.lb = this.flyAshLb;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }
  
  onBlastFurnaceSlagLbChange() {
    const blastFurnaceSlag = this.dataSource.find(ing => ing.name === 'Blast furnace slag');
    if (blastFurnaceSlag) {
      blastFurnaceSlag.lb = this.blastFurnanceSlagLb;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }
  
  onFineAggregatesLbChange() {
    const fineAggregates = this.dataSource.find(ing => ing.name === 'Fine aggregates');
    if (fineAggregates) {
      fineAggregates.lb = this.fineAggregatesLb;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }
  
  onWaterLbChange() {
    const water = this.dataSource.find(ing => ing.name === 'Water');
    if (water) {
      water.lb = this.waterLb;
      this.dataSource = this.calculateIngredients(this.dataSource);
    }
  }
}
