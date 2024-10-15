// login.component.ts

// Import necessary Angular and Firebase modules
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  // Declare variables for email and password
  email: string = '';
  password: string = '';
  confirmation: string = '';
  results: string = '';

  // Inject Firestore and Auth services
  constructor(private firestore: Firestore, private auth: Auth){
  }

  // Method to add a new user to Firestore and authenticate with Firebase
  addUser(): void {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(userCredential => {
        // Add user information to Firestore database
        const usersCollection = collection(this.firestore, 'users');
        return addDoc(usersCollection, { 
          uid: userCredential.user.uid,
          email: this.email,
          createdAt: new Date()
        });
      })
      .then(() => {
        this.results = 'User ' + this.email  + ' added successfully!';
      })
      .catch(error => {
        this.results = 'Error adding user: ' + error.message;
        alert('Error adding user: ' + error.message);
        
      });
  }

  // Method to log in the user
  login(): void {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(userCredential => {
        this.results = 'User ' + userCredential.user.email + ' logged in successfully!';
      })
      .catch(error => {
        this.results = 'Error logging in: ' + error.message;
        alert('Error logging in: ' + error.message);
        
      });
  }
}