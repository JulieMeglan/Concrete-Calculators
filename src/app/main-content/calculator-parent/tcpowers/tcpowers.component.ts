import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // imports FormsModule (required)
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tcpowers',
  standalone: true,
  imports: [MatDividerModule, MatButtonModule, FormsModule],
  templateUrl: './tcpowers.component.html',
  styleUrl: './tcpowers.component.css'
})
export class TcpowersComponent {
  // variable declarations for tc powers calculations
  wc: number = 0; // variable for water/cement ratio
  alpha: number = 0; // variable for degree of hydration
  results: any; // stores values resulting from tc powers formula

  // tc powers calculation function
  calculateTCPowers(wc: number, alpha: number): void {
    // checks if any input values are equal to zero or are negative values
    if (this.wc <= 0 || this.alpha <= 0) {
      alert("All input values must be positive non-zero numbers."); // displays alert message when user provides invalid input
      return;
    }

    // declaration of resultant variables
    let wn, wg, vg, vhp, vc, vu, vp, pg, pc, x, wmin;

    // tc powers formula implementation
    wn = 0.24 * this.alpha;
    wg = 0.18 * this.alpha;
    vg = wg;
    vhp = 0.68 * this.alpha;
    vc = this.wc - (0.36 * this.alpha);
    vu = (1 - this.alpha) * 0.32;
    vp = this.wc + 0.32;
    pg = wg / vhp;;
    pc = vc / vp;
    x = (0.68 * this.alpha) / ((0.32 * this.alpha) + this.wc);
    wmin = 0.42 * this.alpha;

  

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
