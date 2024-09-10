import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tcpowers',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatTableModule],
  templateUrl: './tcpowers.component.html',
  styleUrl: './tcpowers.component.css'
})
export class TcpowersComponent {
  // variable declarations for tc powers calculations
  wc: number = 0; // variable for water/cement ratio
  alpha: number = 0; // variable for degree of hydration
  results: any; // stores values resulting from tc powers formula
  
  // defines the columns displayed in the table
  displayedColumns: string[] = [
    'wn', 'wg', 'vg', 'vhp', 'vc', 'vu', 'vp', 'pg', 'pc', 'x', 'wmin'
  ];



  // tc powers calculation function
  calculateTCPowers(wc: number, alpha: number): void {

    // declaration of resultant variables
    let wn, wg, vg, vhp, vc, vu, vp, pg, pc, x, wmin;

    // tc powers formula implementation
    wn = 0.24 * this.alpha; // nonevaporable water
    wg = 0.18 * this.alpha; // gel pore water
    
    vhp = 0.68 * this.alpha; // total volume of hydration products
    vc = 0.32 // specific volume of cement (constant)
    vu = (1 - this.alpha) * 0.32; // volume of unhydrated cement
    vp = this.wc + 0.32; // original volume of paste
    pg = 0.26 * vhp; // volume of gel porosity
    pc = this.wc - (0.36 * this.alpha); // capillary porosity
    vg = vhp - pg; // total volume of hydration products minus the gel pores
    x = (vhp) / (vg + vc); // gel/space ratio
    wmin = wn + wg; // weight of water

  

    // gathers calculated variables to be used in tcpowers.component.html
    this.results = {
      wn,
      wg,
      vg,
      vhp,
      vc,
      vu,
      vp,
      pg,
      pc,
      x,
      wmin
    };
  }
}
