import { Component } from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';



@Component({
  selector: 'app-mortar-and-mix',
  standalone: true,
  imports: [MatDividerModule, MatButtonModule],
  templateUrl: './mortar-and-mix.component.html',
  styleUrl: './mortar-and-mix.component.css'
})
export class MortarAndMixComponent {

}
