import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoaaService {
  private apiUrl = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data';
  //private token = 'YOUR_NOAA_API_TOKEN'; // Replace with your actual token
  private token = 'PnHLWKPaBemBqzofzEXbzJdeyskkeYDX'; // Replace with your actual token

  constructor(private http: HttpClient) { }

  getData(datasetId: string, locationId: string, startDate: string, endDate: string): Observable<any> {
    const headers = new HttpHeaders({
      'token': this.token
    });

    const params = {
      datasetid: datasetId,
      locationid: locationId,
      startdate: startDate,
      enddate: endDate,
      limit: '10' // Limiting to 10 records for this example
    };

    return this.http.get<any>(this.apiUrl, { headers, params });
  }
}

