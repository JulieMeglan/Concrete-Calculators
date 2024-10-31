import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
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
    MatIconModule,  
    MatToolbarModule,
    CommonModule
  ]
})
export class AppComponent implements OnInit {
  title = 'ConcreteCalculators';
  sidenavOpened = false;  // Control for the sidenav state
  userEmail: string | null = null; // Store the email of the logged-in user, or null if not logged in

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    // Listen for authentication state changes
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user && user.emailVerified) {
        this.userEmail = user.email; // User is logged in, set the email
      } else {
        this.userEmail = null; // User is not logged in
      }
    });
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }



}
