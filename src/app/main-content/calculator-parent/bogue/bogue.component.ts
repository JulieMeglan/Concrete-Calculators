import { Component } from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-bogue',
  standalone: true,
  imports: [MatDividerModule, MatButtonModule],
  templateUrl: './bogue.component.html',
  styleUrl: './bogue.component.css'
})
export class BogueComponent {

}
