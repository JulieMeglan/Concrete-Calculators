
import { Component, OnInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule  } from '@angular/common/http';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, Plugin  } from 'chart.js';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// for database features
import { Firestore, addDoc, collection, collectionData, query, where, getDocs, orderBy, deleteDoc, doc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

interface PSCRecord {
  cT: number;
  aT: number;
  rH: number;
  wV: number;
  isMetric: boolean;
}

interface PSCGraphRecord {
  myCT: number;
  latitude: number;
  longitude: number;
  isMetric: boolean;
}

@Component({
  selector: 'app-plastic-shrinkage-cracks',
  standalone: true,
  imports: [
    MatDividerModule, 
    MatButtonModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    CommonModule,
    HttpClientModule,
    BaseChartDirective,
    MatSlideToggleModule
  ],
  templateUrl: './plastic-shrinkage-cracks.component.html',
  styleUrl: './plastic-shrinkage-cracks.component.css'
})



export class PlasticShrinkageCracksComponent {

  constructor(private firestore: Firestore, private auth: Auth, private http: HttpClient){
  }

  @ViewChild('myChart', { static: true }) myChart!: ElementRef<HTMLCanvasElement>;

  


  eR:         number = 0;   //evaporation rate
  cT:         number = 0;    //concrete temperature
  myCT:       number = 80;
  aT:         number = 0;   //air temperature
  rH:         number = 0;   //relative humidity
  wV:         number = 0;   //wind velocity
  suggestion: string = ""; //explanation
  time:       any;

  showRecords: boolean = false;
  showGraphRecords: boolean = false;

  isMetric: boolean = false;

  // Defines the columns displayed in the table
  displayedColumns: string[] = ['eR', 'suggestion'];
  displayedGColumns: string[] = ['eR', 'myCT', 'aT', 'rH', 'wV', 'suggestion', 'time'];

  userRecords: { cT: number, aT: number, rH: number, wV: number, isMetric: boolean  }[] = []; // stores records fetched from Firestore
  graphRecords: { myCT: number, latitude: number, longitude: number, isMetric: boolean  }[] = []; // stores graph records fetched from Firestore

  results: any;

  gResults: Array<{eR: number, myCT: number, aT: number, rH: number, wV: number, suggestion: string, time: any, long: number, lat: number}> = [];

  chart: any; // Chart.js instance
  chartLabels: string[] = [];
  chartOptions = {
    responsive: true
  };

  saveToFirestore(): void {
    // Get the current authenticated user
    const user = this.auth.currentUser;
  
    if (user && user.emailVerified) {
      // Reference the collection where data will be saved
      const testCollection = collection(this.firestore, 'psc');
      
      // Add a new document with the current values and the user's UID
      addDoc(testCollection, {
        cT: this.cT,
        aT: this.aT,
        rH: this.rH,
        wV: this.wV,
        isMetric: this.isMetric,
        uid: user.uid,  // Include the uid of the logged-in user
        timestamp: new Date()  // Add a timestamp if needed
      }).then(() => {
        alert('Data saved successfully!');
      }).catch(error => {
        alert('Error saving data: ' + error);
      });
    } else {
      alert('No user is logged in');
    }
  }

  // Fetch saved records for the current user from Firestore
  fetchRecords(): void {
    // Toggle the value of showRecords
    this.showRecords = !this.showRecords;

    // If showRecords is true, fetch the records
    if (this.showRecords) {
      const user = this.auth.currentUser;
    
      if (user && user.emailVerified) {
        const records: PSCRecord[] = [];
        const testCollection = collection(this.firestore, 'psc');
        const q = query(
          testCollection,
          where('uid', '==', user.uid),
          where('isMetric', '==', this.isMetric),  // Filter records where isMetric matches
          orderBy('timestamp', 'desc') // This sorts records by timestamp, newest first
        );

        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data() as PSCRecord;
            if (data) {
              records.push({
                cT: data.cT || 0,
                aT: data.aT || 0,
                rH: data.rH || 0,
                wV: data.wV || 0,
                isMetric: data.isMetric
              });
            }
          });
          this.userRecords = records;

          if (this.userRecords.length === 0) {
            alert('No records found for this user.');
          }
        }).catch((error) => {
          console.error('Error fetching records: ', error);
          alert('Error fetching records: ' + error.message);
        });
      } else {
        alert('No user is logged in');
      }
    }
  }

  // Method to delete a specific record from Firestore
deleteRecord(record: PSCRecord): void {
  const user = this.auth.currentUser;

  if (user && user.emailVerified) {
    // Reference to the collection
    const testCollection = collection(this.firestore, 'psc');
    
    // Query to find the document to delete
    const q = query(
      testCollection,
      where('uid', '==', user.uid),
      where('cT', '==', record.cT),
      where('aT', '==', record.aT),
      where('rH', '==', record.rH),
      where('wV', '==', record.wV),
      where('isMetric', '==', record.isMetric)
    );

    // Fetch the document to delete
    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id; // Get the document ID
        const docRef = doc(this.firestore, 'psc', docId); // Reference to the document

        // Delete the document
        deleteDoc(docRef).then(() => {
          alert('Record deleted successfully!');
          this.fetchRecords(); // Refresh the records after deletion
        }).catch((error) => {
          console.error('Error deleting record: ', error);
          alert('Error deleting record: ' + error.message);
        });
      } else {
        alert('Record not found.');
      }
    }).catch((error) => {
      console.error('Error fetching records for deletion: ', error);
      alert('Error fetching records for deletion: ' + error.message);
    });
  } else {
    alert('No user is logged in');
  }
}

  // Populate input fields with selected record values
  populateFields(record: PSCRecord): void {
    this.cT = record.cT; // Set cT from the selected record
    this.aT = record.aT; // Set aT from the selected record
    this.rH = record.rH; // Set rH from the selected record
    this.wV = record.wV; // Set wV from the selected record
    this.calculatePlasticShrinkageCracks(this.cT, this.aT, this.rH, this.wV); // Recalculate with new values
  }

  saveGraphToFirestore(): void {
    // Get the current authenticated user
    const user = this.auth.currentUser;
  
    if (user && user.emailVerified) {
      // Reference the collection where data will be saved
      const testCollection = collection(this.firestore, 'pscGraph');
      
      // Add a new document with the current values and the user's UID
      addDoc(testCollection, {
        myCT: this.myCT,
        latitude: this.latitude,
        longitude: this.longitude,
        isMetric: this.isMetric,
        uid: user.uid,  // Include the uid of the logged-in user
        timestamp: new Date()  // Add a timestamp if needed
      }).then(() => {
        alert('Data saved successfully!');
      }).catch(error => {
        alert('Error saving data: ' + error);
      });
    } else {
      alert('No user is logged in');
    }
  }

  // Fetch saved records for the current user from Firestore
  fetchGraphRecords(): void {
    // Toggle the value of showRecords
    this.showGraphRecords = !this.showGraphRecords;

    // If showGraphRecords is true, fetch the records
    if (this.showGraphRecords) {
      const user = this.auth.currentUser;
    
      if (user && user.emailVerified) {
        const records: PSCGraphRecord[] = [];
        const testCollection = collection(this.firestore, 'pscGraph');
        const q = query(
          testCollection,
          where('uid', '==', user.uid),
          where('isMetric', '==', this.isMetric),  // Filter records where isMetric matches
          orderBy('timestamp', 'desc') // This sorts records by timestamp, newest first
        );

        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data() as PSCGraphRecord;
            if (data) {
              records.push({
                myCT: data.myCT || 0,
                latitude: data.latitude || 0,
                longitude: data.longitude || 0,
                isMetric: data.isMetric
              });
            }
          });
          this.graphRecords = records;

          if (this.graphRecords.length === 0) {
            alert('No records found for this user.');
          }
        }).catch((error) => {
          console.error('Error fetching records: ', error);
          alert('Error fetching records: ' + error.message);
        });
      } else {
        alert('No user is logged in');
      }
    }
  }

  // Method to delete a specific record from Firestore
deleteGraphRecord(record: PSCGraphRecord): void {
  const user = this.auth.currentUser;

  if (user && user.emailVerified) {
    // Reference to the collection
    const testCollection = collection(this.firestore, 'pscGraph');
    
    // Query to find the document to delete
    const q = query(
      testCollection,
      where('uid', '==', user.uid),
      where('myCT', '==', record.myCT),
      where('latitude', '==', record.latitude),
      where('longitude', '==', record.longitude),
      where('isMetric', '==', record.isMetric)
    );

    // Fetch the document to delete
    getDocs(q).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id; // Get the document ID
        const docRef = doc(this.firestore, 'pscGraph', docId); // Reference to the document

        // Delete the document
        deleteDoc(docRef).then(() => {
          alert('Record deleted successfully!');
          this.fetchRecords(); // Refresh the records after deletion
        }).catch((error) => {
          console.error('Error deleting record: ', error);
          alert('Error deleting record: ' + error.message);
        });
      } else {
        alert('Record not found.');
      }
    }).catch((error) => {
      console.error('Error fetching records for deletion: ', error);
      alert('Error fetching records for deletion: ' + error.message);
    });
  } else {
    alert('No user is logged in');
  }
}

  // Populate input fields with selected record values
  populateGraphFields(record: PSCGraphRecord): void {
    this.myCT = record.myCT; // Set myCT from the selected record
    this.latitude = record.latitude; // Set latitude from the selected record
    this.longitude = record.longitude; // Set longitude from the selected record
  }

  onUnitToggleChange(event: any): void {
    this.isMetric = event.checked;
    // Update the chart to reflect the new background logic
    this.updateChart();
    this.showRecords = false;
    this.showGraphRecords = false;
  }

  ngOnInit() {
    Chart.register(...registerables, this.backgroundColorPlugin); // Register the plugin
    this.initializeChart(); // Initialize the chart
  }

  // Define the backgroundColorPlugin
  backgroundColorPlugin: Plugin = {
    id: 'backgroundColorPlugin',
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      const data = chart.data.datasets[0].data as number[];
      const minValue = Math.min(...data);
      const maxValue = Math.max(...data);

      // Define thresholds based on this.isMetric
      let thresholdLow, thresholdHigh;
      if (this.isMetric) {
        thresholdLow = 0.5;
        thresholdHigh = 1;
      } else {
        thresholdLow = 0.1;
        thresholdHigh = 0.2;
      }

      ctx.save();
      ctx.clearRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);

      // Draw green area for values < thresholdLow
      ctx.fillStyle = 'green';
      ctx.fillRect(chartArea.left, chartArea.bottom - ((thresholdLow - minValue) / (maxValue - minValue)) * (chartArea.bottom - chartArea.top),
        chartArea.right - chartArea.left, (thresholdLow - minValue) / (maxValue - minValue) * (chartArea.bottom - chartArea.top));

      // Draw yellow area for thresholdLow <= values <= thresholdHigh
      ctx.fillStyle = 'yellow';
      ctx.fillRect(chartArea.left, chartArea.bottom - ((thresholdHigh - minValue) / (maxValue - minValue)) * (chartArea.bottom - chartArea.top),
        chartArea.right - chartArea.left, ((thresholdHigh - thresholdLow) / (maxValue - minValue)) * (chartArea.bottom - chartArea.top));

      // Draw red area for values > thresholdHigh
      ctx.fillStyle = 'red';
      ctx.fillRect(chartArea.left, chartArea.top,
        chartArea.right - chartArea.left, chartArea.bottom - ((thresholdHigh - minValue) / (maxValue - minValue)) * (chartArea.bottom - chartArea.top));

      ctx.restore();
    }
  };

  convertFtC(f : number) : number {
    const c = (f-32)/1.8;
    return c;
  }

  convertMPHtKPH(mph:number) : number {
    const kph = mph * 1.609344;
    return kph;
  }

  calculatePlasticShrinkageCracks(cT: number, aT: number, rH: number, wV: number): void {
    let eR;
    let suggestion;

    //eR = (cT^2.5 - rH/100 * aT^2.5) (1 + .4 * wV) * 10^-6
    //eR = (Math.pow(this.cT, 2.5) - (this.rH/100) * Math.pow(this.aT, 2.5))*(1 + (0.4 * this.wV)) * Math.pow(10, -6);

    if (this.isMetric) {
      // metric eR = 5((cT+18)^2.5 - rH/100 * (aT+18)^2.5)(wV+4)*10^-6
      eR = 5 * (Math.pow((cT+18),2.5) - (rH/100) * Math.pow((aT+18),2.5)) * (wV+4) * Math.pow(10,-6);
    } else {
      // eR = (cT^2.5 - rH/100 * aT^2.5) (1 + .4 * wV) * 10^-6
      eR = (Math.pow(cT, 2.5) - (rH/100) * Math.pow(aT, 2.5))*(1 + (0.4 * wV)) * Math.pow(10, -6);
    }

    // set suggestion
    suggestion = this.getSuggestion(eR);
    
    // gathers calculated variables to be used in bogue.component.html
    this.results = {
      eR,
      cT,
      aT,
      rH,
      wV,
      suggestion
    };
  }

  getSuggestion(eR: number): string {
    if (this.isMetric) {
      if (eR > 1) {
        return "> 1, high risk";
      } else if (eR > .5) {
        return "> .5 and < 1, medium risk";
      } 
      return "< .5, low risk";
    } else {
      if (eR > .2) {
        return "> .2, high risk";
      } else if (eR > .1) {
        return "> .1 and < .2, medium risk";
      } 
      return "< .1, low risk";
    }
  }

  //api stuff
  private apiUrl = 'https://api.weather.gov'; // NOAA's base API URL

  getWeather(latitude: number, longitude: number): Observable<any> {
    const url = `${this.apiUrl}/points/${latitude},${longitude}`;
    return this.http.get(url);
  }
  
  getForecast(forecastUrl: string): Observable<any> {
    return this.http.get(forecastUrl);
  }

  title = 'Weather App';
  forecast: any;

  //placeholder initial plan
  latitude: number = 39.7456;
  longitude: number = -97.0892;
  
  fetchWeather(latitude: number, longitude: number) {
    //const latitude = 39.7456; // Example latitude
    //const longitude = -97.0892; // Example longitude

    // Get the weather data
    this.getWeather(latitude, longitude).subscribe(
      data => {
        console.log('Weather data:', data);
        // NOAA's API provides a URL for the forecast data, which we need to call separately
        const forecastUrl = data.properties.forecastHourly;
        this.getForecast(forecastUrl).subscribe(
          forecastData => {
            console.log('Forecast data:', forecastData);
            this.forecast = forecastData;
          },
          error => console.error('Error fetching forecast data', error)
        );
      },
      error => console.error('Error fetching weather data', error)
    );
  }


  PlasticShrinkageGrapher(lat: number, long: number, myCT: number) {
    let eR, aT, rH, wV, suggestion, time;

    // Clear previous results
    this.gResults.length = 0;
    this.chartLabels.length = 0;
  
    // Fetch weather data and analyze once it arrives
    this.fetchWeather(lat, long);
    this.getWeather(lat, long).subscribe(
      data => {
        const forecastUrl = data.properties.forecastHourly;
        this.getForecast(forecastUrl).subscribe(
          forecastData => {
            this.forecast = forecastData;
            
            // Now process the forecast data
            let entryCounter = 0; // Initialize counter to track every other entry

            // Now process the forecast data
            for (let period of this.forecast.properties.periods) {
              // percentage
              rH = period.relativeHumidity.value;

              if(this.isMetric) {
                aT = this.convertFtC(period.temperature); // convert f input to c
                wV = this.convertMPHtKPH(parseFloat(period.windSpeed)); // convert mph input to kph
                // metric eR = 5((cT+18)^2.5 - rH/100 * (aT+18)^2.5)(wV+4)*10^-6
                eR = 5* (Math.pow((myCT+18),2.5) - (rH/100) * Math.pow((aT+18),2.5)) * (wV+4) * Math.pow(10,-6);
              }
              else {
                aT = period.temperature;
                wV = parseFloat(period.windSpeed);  // Handle wind speed string conversion
                // Calculate evaporation
                eR = (Math.pow(myCT, 2.5) - (rH / 100) * Math.pow(aT, 2.5)) * (1 + 0.4 * wV) * Math.pow(10, -6);
              }

              // Calculate  suggestion
              suggestion = this.getSuggestion(eR);
              //time = period.startTime;

              // Convert period.startTime to just day and hour (e.g., "2024-09-12 12:00")
              const dateObj = new Date(period.startTime);
              const day = dateObj.toISOString().split('T')[0];  // Extract day (YYYY-MM-DD)
              const hour = dateObj.toISOString().split('T')[1].substring(0, 5);  // Extract time (HH:MM)
              time = `${day} ${hour}`;  // Combine day and hour

              // Push result to the array
              this.gResults.push({ eR, myCT, aT, rH, wV, suggestion, time, long, lat });
              this.chartLabels.push(time);

            }
            this.updateChart(); // Call updateChart after setting new data
          }
        );
      }
    );
  }

  initializeChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: 'Evaporation Rate',
          data: [],
          fill: false,
          borderColor: 'blue',
          tension: 0.1
        }]
      },
      options: {
        ...this.chartOptions,
      }
    });
  }

  updateChart(maxEntries: number = 40) {
    if (this.chart) {
      // Slice the data to only take the first 'maxEntries' elements
      const limitedLabels = this.chartLabels.slice(0, maxEntries);
      const limitedData = this.gResults.slice(0, maxEntries).map(result => result.eR);

      // Update the chart with the limited data
      this.chart.data.labels = limitedLabels;
      this.chart.data.datasets[0].data = limitedData;
      this.chart.update(); // Update the existing chart instance
    }

    
      
}

}