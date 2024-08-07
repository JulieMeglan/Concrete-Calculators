import { Component } from '@angular/core';
import { MortarAndMixComponent } from './mortar-and-mix/mortar-and-mix.component';
import { BogueComponent } from './bogue/bogue.component';
import { TcpowersComponent } from './tcpowers/tcpowers.component';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { PlasticShrinkageCracksComponent } from './plastic-shrinkage-cracks/plastic-shrinkage-cracks.component';


@Component({
  selector: 'app-calculator-parent',
  standalone: true,
  imports: [
    MortarAndMixComponent, 
    BogueComponent, 
    TcpowersComponent, 
    PlasticShrinkageCracksComponent, 
    MatDividerModule, 
    MatButtonModule,
    RouterOutlet
  ],
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