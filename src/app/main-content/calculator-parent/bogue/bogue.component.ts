// bogue.component.ts

// This TypeScript file defines the BogueComponent, which is responsible for handling the logic 
// and calculations related to the Bogue Calculation method in the Angular webpage. It imports 
// necessary modules and components, including FormsModule for handling input data and Material 
// modules for UI components. The calculateBogue function performs the Bogue Calculation based on 
// input values, and the results are stored in the results object for display in the HTML template.


// imports for bogue calculator
// ensure FormsModule is imported (required for input)
import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

// components for bogue calculator
// ensure FormsModule is in imports
@Component({
  selector: 'app-bogue',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatTableModule
    //, BrowserAnimationsModule
    ], // ensure FormsModule is in this line
  templateUrl: './bogue.component.html', 
  styleUrl: './bogue.component.css'
})

// class containing bogue specific variables and functions
export class BogueComponent {
  // variable declarations for bogue calculations
  cao: number = 0; // variable for lime
  sio2: number = 0; // variable for silica
  al2o3: number = 0; // variable for alumina
  fe2o3: number = 0; // variable for ferric oxide
  so3: number = 0; // variable for sulfur trioxide
  results: any; // stores values resulting from bogue formula

  // defines the columns displayed in the table
  displayedColumns: string[] = ['c3s', 'c2s', 'c3a', 'c4af', 'afRatio'];

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

