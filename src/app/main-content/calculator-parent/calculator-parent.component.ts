import { Component } from '@angular/core';
import { MortarAndMixComponent } from './mortar-and-mix/mortar-and-mix.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-calculator-parent',
  standalone: true,
  imports: [MortarAndMixComponent],
  templateUrl: './calculator-parent.component.html',
  styleUrl: './calculator-parent.component.css'
})


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
