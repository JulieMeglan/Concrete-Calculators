import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://<your-firebase-app>.cloudfunctions.net/runNISTModel'; // Update with your actual Firebase function URL

  constructor(private http: HttpClient) {}

  runNISTModel(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }
}
