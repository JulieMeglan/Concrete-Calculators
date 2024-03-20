import { Component } from '@angular/core';
import { MortarAndMixComponent } from './mortar-and-mix/mortar-and-mix.component';
import { BogueComponent } from './bogue/bogue.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-calculator-parent',
  standalone: true,
  imports: [MortarAndMixComponent, BogueComponent, MatDividerModule, MatButtonModule],
  templateUrl: './calculator-parent.component.html',
  styleUrl: './calculator-parent.component.css'
}
)

export class CalculatorParentComponent {
public CalcName: String | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router  
  ) {}

  ngOnInit(){
    console.log(this.router.url);
    console.log("routes");
    console.log(this.route.snapshot.url);
    console.log(this.route.snapshot.url[0].path);
    const CalcName = '';
  }

}
