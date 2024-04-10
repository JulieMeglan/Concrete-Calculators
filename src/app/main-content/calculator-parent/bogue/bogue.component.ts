// bogue.component.ts
// imports for bogue calculator
// ensure FormsModule is imported (required for input)

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

// components for bogue calculator
// ensure FormsModule is in imports
@Component({
  selector: 'app-bogue',
  standalone: true,
  imports: [MatDividerModule, MatButtonModule, FormsModule],
  templateUrl: './bogue.component.html',
  styleUrl: './bogue.component.css'
})

// class containing bogue specific variables and functions
export class BogueComponent {
  // variable declarations for bogue calculations
  cao: number = 0;
  sio2: number = 0;
  al2o3: number = 0;
  fe2o3: number = 0;
  so3: number = 0;
  results: any;

  // bogue calculation function
  calculateBogue(cao: number, sio2: number, al2o3: number, fe2o3: number, so3: number): void {
    // ensures no input values are zero or negative numbers, as they are not feasible and will break the calculator
    if (this.cao <= 0 || this.sio2 <= 0 || this.al2o3 <= 0 || this.fe2o3 <= 0 || this.so3 <= 0) {
      alert("All input values must be positive non-zero numbers.");
      return;
    }

    // calculated the alumina to ferric oxide ratio
    // (necessary to determine which formula to use)
    const afRatio = this.al2o3 / this.fe2o3;

    let c3s, c2s, c3a, c4af;

    // formula for if af ratio is greater than or equal to 0.64
    if (afRatio >= 0.64) {
      c3s = 4.071 * this.cao - 7.600 * this.sio2 - 6.718 * this.al2o3 - 1.430 * this.fe2o3 - 2.852 * this.so3;
      c3a = 2.650 * this.al2o3 - 1.692 * this.fe2o3;
      c4af = 3.043 * this.fe2o3;
    } else { // formula for if af ratio is less than 0.64
      c3s = 4.071 * this.cao - 7.600 * this.sio2 - 4.479 * this.al2o3 - 2.859 * this.fe2o3 - 2.852 * this.so3;
      c3a = 0;
      c4af = 2.100 * this.al2o3 + 1.702 * this.fe2o3;
    }

    // this calculation is the same for both cases
    c2s = 2.867 * this.sio2 - 0.7544 * c3s;

    // gathers calculated variables to be used in bogue.component.html
    this.results = {
      c3s,
      c2s,
      c3a,
      c4af,
      afRatio
    };
  }
}

