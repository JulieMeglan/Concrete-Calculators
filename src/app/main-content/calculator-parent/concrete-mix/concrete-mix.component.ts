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

// Function to calculate air ftCubed
function calculateAirFtCubed(ingredients: Ingredient[]): number {
  let ftCubedTotalMinusAir = 0;
  ingredients.forEach(ingredient => {
    if (ingredient.name !== 'Air') {
      ftCubedTotalMinusAir += ingredient.ftCubed;
    }
  });
  const airFtCubed = (ftCubedTotalMinusAir / 0.94) - ftCubedTotalMinusAir;
  return parseFloat(airFtCubed.toFixed(8));
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
function calculateSSDMixAmountFtCubed(ingredients: Ingredient[], mixVolume: number): void {
  ingredients.forEach(ingredient => {
    ingredient.SSDMixAmountFtCubed = parseFloat((ingredient.oneFootCubed * mixVolume).toFixed(8));
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
function calculateStockMixAmountLbs(ingredients: Ingredient[], fineAggregateMC: number, coarseAggregateMC: number): void {
  const fineAggregate = ingredients.find(ingredient => ingredient.name === 'Fine aggregates');
  const coarseAggregate = ingredients.find(ingredient => ingredient.name === 'Coarse aggregates');
  
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
      case 'Coarse aggregates':
        ingredient.stockMixAmountLbs = parseFloat((ingredient.SSDMixAmountLbs * (1 + coarseAggregateMC / 100)).toFixed(8));
        break;
      case 'Water':
        const fineAggDifference = fineAggregate ? (fineAggregate.SSDMixAmountLbs - fineAggregate.stockMixAmountLbs) : 0;
        const coarseAggDifference = coarseAggregate ? (coarseAggregate.SSDMixAmountLbs - coarseAggregate.stockMixAmountLbs) : 0;
        ingredient.stockMixAmountLbs = parseFloat((ingredient.SSDMixAmountLbs + fineAggDifference + coarseAggDifference).toFixed(8));
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
  { name: 'Cement', lb: 1020, SG: 3.15, ftCubed: 0, oneFootCubed: 0, oneYardCubed: 0, SSDMixAmountFtCubed: 0, SSDMixAmountLbs: 0, stockMixAmountLbs: 0 },
  { name: 'Fly ash', lb: 0, SG: 2.5, ftCubed: 0, oneFootCubed: 0, oneYardCubed: 0, SSDMixAmountFtCubed: 0, SSDMixAmountLbs: 0, stockMixAmountLbs: 0 },
  { name: 'Blast furnace slag', lb: 0, SG: 2.8, ftCubed: 0, oneFootCubed: 0, oneYardCubed: 0, SSDMixAmountFtCubed: 0, SSDMixAmountLbs: 0, stockMixAmountLbs: 0 },
  { name: 'Fine aggregates', lb: 1100, SG: 2.6, ftCubed: 0, oneFootCubed: 0, oneYardCubed: 0, SSDMixAmountFtCubed: 0, SSDMixAmountLbs: 0, stockMixAmountLbs: 0 },
  { name: 'Coarse aggregates', lb: 1800, SG: 2.6, ftCubed: 0, oneFootCubed: 0, oneYardCubed: 0, SSDMixAmountFtCubed: 0, SSDMixAmountLbs: 0, stockMixAmountLbs: 0 },
  { name: 'Water', lb: 340, SG: 1.0, ftCubed: 0, oneFootCubed: 0, oneYardCubed: 0, SSDMixAmountFtCubed: 0, SSDMixAmountLbs: 0, stockMixAmountLbs: 0 },
  //water has to come after aggregates b/c of calculateStockMixAmountLbs function
];

@Component({
  selector: 'app-concrete-mix',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatTableModule, MatSlideToggleModule],
  templateUrl: './concrete-mix.component.html',
  styleUrls: ['./concrete-mix.component.css']
})
export class ConcreteMixComponent {
  isMetric: boolean = false;
  displayedColumns: string[] = ['ingredient', 'lb', 'Specific gravity', 'Feet cubed', 'One foot cubed', 'One yard cubed', 'SSDMixAmountFtCubed', 'SSDMixAmountLbs', 'stockMixAmountLbs'];
  dataSource: Ingredient[] = [];
  userVolume: number = 40;
  mixVolume: number = 0;
  fineAggregatesLb: number = 1100;
  coarseAggregatesLb: number = 1800;
  fineAggregateMC: number = 1;
  coarseAggregateMC: number = 1;
  cementLb: number = 1020;
  blastFurnanceSlagLb: number = 0;
  flyAshLb: number = 0;
  waterLb: number = 340;

  constructor(private router: Router) { // Inject the Router service
    this.initializeData();
  }

  initializeData(): void {
    this.dataSource = this.calculateIngredients(initialIngredientData);
  }

  onUnitToggleChange(event: any): void {
    this.isMetric = event.checked;
    if (this.isMetric) {
      this.router.navigate(['/calc/concretemixmetric']); // Navigate to the metric component
    } else {
      this.router.navigate(['/calc/concretemix']); // Navigate back to the imperial component
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
    this.mixVolume = this.userVolume + (0.15 * this.userVolume);
    
    // Calculate and add air ftCubed
    const airFtCubed = calculateAirFtCubed(calculatedIngredients);

   // Create and add the 'Air' ingredient
   const airIngredient: Ingredient = {
    name: 'Air',
    lb: 0,
    SG: 0,
    ftCubed: airFtCubed,
    oneFootCubed: 0,
    oneYardCubed: 0,
    SSDMixAmountFtCubed: 0,
    SSDMixAmountLbs: 0,
    stockMixAmountLbs: 0
  };
  calculatedIngredients.push(airIngredient);
   
  // Calculate total lb

   const totalLb = calculateTotalLb(calculatedIngredients);

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
    calculateSSDMixAmountFtCubed(calculatedIngredients, this.mixVolume);

    // Calculate totalSSDMixAmountFtCubed
    const totalSSDMixAmountFtCubed = calculateTotalSSDMixAmountFtCubed(calculatedIngredients);

    // Update SSDMixAmountLbs for each ingredient
    calculateSSDMixAmountLbs(calculatedIngredients);

    // Calculate totalSSDMixAmountLbs
    const totalSSDMixAmountLbs = calculateTotalSSDMixAmountLbs(calculatedIngredients);

    // Calculate stockMixAmountLbs for each ingredient
    calculateStockMixAmountLbs(calculatedIngredients, this.fineAggregateMC, this.coarseAggregateMC);

    // Calculate totalStockMixAmountLbs
    const totalStockMixAmountLbs = calculateTotalStockMixAmountLbs(calculatedIngredients);

    // Add totals row only once
    calculatedIngredients.push({
      name: 'Total',
      lb: totalLb,
      SG: 0,
      ftCubed: totalFtCubed,
      oneFootCubed: totalOneFootCubed,
      oneYardCubed: totalOneYardCubed,
      SSDMixAmountFtCubed: totalSSDMixAmountFtCubed,
      SSDMixAmountLbs: totalSSDMixAmountLbs,
      stockMixAmountLbs: totalStockMixAmountLbs
    });

    return calculatedIngredients;
  }

  onUserVolumeChange(): void {
    if (this.userVolume <= 0) {
      this.userVolume = 1;
    }
    this.mixVolume = this.userVolume + 0.15 * this.userVolume;
    calculateSSDMixAmountFtCubed(this.dataSource, this.mixVolume);
    calculateSSDMixAmountLbs(this.dataSource);
  }

  onFineAggregateMCChange(): void {
    const ingredient = this.dataSource.find(ing => ing.name === 'Fine aggregates');
    if (ingredient) {
      ingredient.lb = this.fineAggregatesLb;

      this.dataSource = this.calculateIngredients(initialIngredientData);
    }
  }

  onCoarseAggregateMCChange(): void {
    const ingredient = this.dataSource.find(ing => ing.name === 'Coarse aggregates');
    if (ingredient) {
      ingredient.lb = this.coarseAggregatesLb;
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
  
  onCoarseAggregatesLbChange() {
    const coarseAggregates = this.dataSource.find(ing => ing.name === 'Coarse aggregates');
    if (coarseAggregates) {
      coarseAggregates.lb = this.coarseAggregatesLb;
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