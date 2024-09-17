

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-plastic-shrinkage-cracks',
  standalone: true,
  imports: [MatDividerModule, MatButtonModule, FormsModule],
  templateUrl: './plastic-shrinkage-cracks.component.html',
  styleUrl: './plastic-shrinkage-cracks.component.css'
})


export class PlasticShrinkageCracksComponent {

  eR: number = 0;   //evaporation rate
  cT: number =0;    //concrete temperature
  aT: number = 0;   //air temperature
  rH: number = 0;   //relative humidity
  wV: number = 0;   //wind velocity

  results: any;

  calculatePlasticShrinkageCracks(cT: number, aT: number, rH: number, wV: number): void {
    // ensures no input values are zero or negative numbers, as they are not feasible and will break the calculator
    if (this.rH < 0 || this.wV < 0) {
      alert("Relative humidity and wind speed values must not be negative.");
      return;
    }

    let eR;

    //eR = (cT^2.5 - rH/100 * aT^2.5) (1 + .4 * wV) * 10^-6
    eR = (Math.pow(this.cT, 2.5) - (this.rH/100) * Math.pow(this.aT, 2.5))*(1 + (0.4 * this.wV)) * Math.pow(10, -6);



    // gathers calculated variables to be used in bogue.component.html
    this.results = {
      eR,
      cT,
      aT,
      rH,
      wV
    };
  }
}
