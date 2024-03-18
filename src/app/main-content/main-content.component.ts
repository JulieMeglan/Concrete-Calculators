import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalculatorParentComponent } from './calculator-parent/calculator-parent.component';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    CalculatorParentComponent, 
    HomeComponent,
    RouterOutlet],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {

}
