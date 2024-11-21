import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

//chart stuff
import { ChartOptions, ChartType } from 'chart.js';
import { ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-tcpowers',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatTableModule, BaseChartDirective, MatSelectModule],
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


  /*
  //chart stuff below -----------------------------------------------
  numGraphOptions: number[] = [1, 2, 3, 4, 5]; 
  numGraphs = 5;

  // Initialize arrays based on the number of graphs
  graphWC: number[] = Array(this.numGraphs).fill('');
  graphDH: number[] = Array(this.numGraphs).fill('');

  graphVu: number[] = Array(this.numGraphs).fill(25);
  graphVg: number[] = Array(this.numGraphs).fill(15);
  graphPg: number[] = Array(this.numGraphs).fill(10);
  graphPc: number[] = Array(this.numGraphs).fill(50);

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };

  public barChartLabels: string[] = Array(this.numGraphs).fill('').map((_, i) => `Equation ${i + 1}`);
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataset[] = [
    { data: this.graphVu, label: 'Vu' },
    { data: this.graphVg, label: "V'g" },
    { data: this.graphPg, label: 'Pg' },
    { data: this.graphPc, label: 'Pc' }
  ];

  // Getter for dynamically creating an array for ngFor
  get graphsArray() {
    return Array.from({ length: this.numGraphs });
  }

  updateGraphData() {
    // Update the labels based on the current number of graphs
    this.barChartLabels = Array(this.numGraphs).fill('').map((_, i) => `Equation ${i + 1}`);
  
    // Ensure each dataset has the correct number of entries
    this.barChartData[0].data = Array(this.numGraphs).fill('').map((_, i) => this.graphVu[i] || 0);
    this.barChartData[1].data = Array(this.numGraphs).fill('').map((_, i) => this.graphVg[i] || 0);
    this.barChartData[2].data = Array(this.numGraphs).fill('').map((_, i) => this.graphPg[i] || 0);
    this.barChartData[3].data = Array(this.numGraphs).fill('').map((_, i) => this.graphPc[i] || 0);
  }
  onNumGraphsChange() {
    // Adjust the size of the arrays when numGraphs changes
    this.graphWC = Array(this.numGraphs).fill('');
    this.graphDH = Array(this.numGraphs).fill('');

    this.graphVu = Array(this.numGraphs).fill('');
    this.graphVg = Array(this.numGraphs).fill('');
    this.graphPg = Array(this.numGraphs).fill('');
    this.graphPc = Array(this.numGraphs).fill('');
    this.updateGraphData();
  }

  calculateTCPowerGraph(graphWC: number[], graphDH: number[]): void {

    
  }
  */
}
