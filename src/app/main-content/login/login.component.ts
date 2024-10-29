// login.component.ts

// Import necessary Angular and Firebase modules
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signOut } from '@angular/fire/auth';

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
export class LoginComponent implements OnInit{

  // Declare variables for email and password
  email: string = '';
  password: string = '';
  confirmation: string = '';
  results: string = '';
  currentUser: any = null;

  // Inject Firestore and Auth services
  constructor(private firestore: Firestore, private auth: Auth){
  }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user && user.emailVerified) {
        this.currentUser = user;
        this.results = 'Welcome, ' + user.email + '!';
      } else {
        this.currentUser = null;
      }
    });
  }

  // Method to add a new user to Firestore and authenticate with Firebase
  addUser(): void {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(userCredential => {
        sendEmailVerification(userCredential.user)
          .then(() => {
            this.results = 'Verification email sent! Please verify before proceeding.';
          })
          .catch(error => {
            this.results = 'Error sending verification email: ' + error.message;
            alert(this.results);
          });
      })
      .catch(error => {
        this.results = 'Error creating user: ' + error.message;
        alert(this.results);
      });
  }

  checkEmailVerification(): void {
    if (this.auth.currentUser && this.auth.currentUser.emailVerified) {
      const user = this.auth.currentUser;
      const usersCollection = collection(this.firestore, 'users');
      addDoc(usersCollection, {
        uid: user.uid,
        email: user.email,
        createdAt: new Date()
      }).then(() => {
        this.results = 'User ' + this.email + ' added to Firestore successfully!';
      }).catch(error => {
        this.results = 'Error adding user to Firestore: ' + error.message;
        alert(this.results);
      });
    } else {
      alert('Please verify your email before proceeding.');
    }
  }

  // Method to log in the user
  login(): void {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(userCredential => {
        if (userCredential.user.emailVerified) {
          this.results = 'User ' + userCredential.user.email + ' logged in successfully!';
        } else {
          this.results = 'Please verify your email before logging in.';
          alert(this.results);
        }
      })
      .catch(error => {
        this.results = 'Error logging in: ' + error.message;
        alert(this.results);
      });
  }

  logout(): void {
    signOut(this.auth).then(() => {
      this.results = 'Logged out successfully.';
      this.currentUser = null;
    }).catch(error => {
      this.results = 'Error logging out: ' + error.message;
      alert('Error logging out: ' + error.message);
    });
  }

}
