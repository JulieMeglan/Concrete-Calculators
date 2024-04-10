// bogue.component.ts

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-bogue',
  standalone: true,
  imports: [MatDividerModule, MatButtonModule, FormsModule],
  templateUrl: './bogue.component.html',
  styleUrl: './bogue.component.css'
})
export class BogueComponent {
  cao: number = 0;
  sio2: number = 0;
  al2o3: number = 0;
  fe2o3: number = 0;
  so3: number = 0;
  results: any;

  calculateBogue(cao: number, sio2: number, al2o3: number, fe2o3: number, so3: number): void {
    if (this.cao <= 0 || this.sio2 <= 0 || this.al2o3 <= 0 || this.fe2o3 <= 0 || this.so3 <= 0) {
      alert("All input values must be positive non-zero numbers.");
      return;
    }

    const afRatio = this.al2o3 / this.fe2o3;

    let c3s, c2s, c3a, c4af;

    if (afRatio >= 0.64) {
      c3s = 4.071 * this.cao - 7.600 * this.sio2 - 6.718 * this.al2o3 - 1.430 * this.fe2o3 - 2.852 * this.so3;
      c3a = 2.650 * this.al2o3 - 1.692 * this.fe2o3;
      c4af = 3.043 * this.fe2o3;
    } else {
      c3s = 4.071 * this.cao - 7.600 * this.sio2 - 4.479 * this.al2o3 - 2.859 * this.fe2o3 - 2.852 * this.so3;
      c3a = 0;
      c4af = 2.100 * this.al2o3 + 1.702 * this.fe2o3;
    }

    c2s = 2.867 * this.sio2 - 0.7544 * c3s;

    this.results = {
      c3s,
      c2s,
      c3a,
      c4af,
      afRatio
    };
  }
}

