import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'ConcreteCalculators';
  message: string = "Welcome to Southern Illinois University Edwardsville's Concrete Calculator website";

  changeMessage(isHovering: boolean) {
    this.message = isHovering ? "Select a calculator to get started" : "Welcome to Southern Illinois University Edwardsville's\nConcrete Calculator website";
  }
}
