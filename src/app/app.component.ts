import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], 
  imports: [
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    CommonModule
  ]
})
export class AppComponent implements OnInit{
  title = 'ConcreteCalculators';

  constructor(private firestore: Firestore){
  }

  public ngOnInit(): void {
    const testCollection = collection(this.firestore, 'test');
    addDoc(testCollection, {text: "test write"});
  }
}
