

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-plastic-shrinkage-cracks',
  standalone: true,
  imports: [
    MatDividerModule, 
    MatButtonModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    CommonModule
  ],
  templateUrl: './plastic-shrinkage-cracks.component.html',
  styleUrl: './plastic-shrinkage-cracks.component.css'
})


export class PlasticShrinkageCracksComponent {

  eR: number = 0;   //evaporation rate
  cT: number =0;    //concrete temperature
  aT: number = 0;   //air temperature
  rH: number = 0;   //relative humidity
  wV: number = 0;   //wind velocity
  suggestion: string = "" //explanation

  // defines the columns displayed in the table
  displayedColumns: string[] = ['eR', 'suggestion'];

  results: any;

  calculatePlasticShrinkageCracks(cT: number, aT: number, rH: number, wV: number): void {
    let eR;
    let suggestion;

    //eR = (cT^2.5 - rH/100 * aT^2.5) (1 + .4 * wV) * 10^-6
    eR = (Math.pow(this.cT, 2.5) - (this.rH/100) * Math.pow(this.aT, 2.5))*(1 + (0.4 * this.wV)) * Math.pow(10, -6);

    // set suggestion
    if (eR > 1) {
      suggestion = "> 1, high risk";
    } else if (eR > .1) {
      suggestion = "> .1 and < 1, medium risk";
    } else (
      suggestion = "< .1, low risk"
    )
    

    // gathers calculated variables to be used in bogue.component.html
    this.results = {
      eR,
      cT,
      aT,
      rH,
      wV,
      suggestion
    };
  }
}
