
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
    BaseChartDirective
  ],
  templateUrl: './plastic-shrinkage-cracks.component.html',
  styleUrl: './plastic-shrinkage-cracks.component.css'
})



export class PlasticShrinkageCracksComponent {
  @ViewChild('myChart', { static: true }) myChart!: ElementRef<HTMLCanvasElement>;


  eR:         number = 0;   //evaporation rate
  cT:         number = 0;    //concrete temperature
  myCT:       number = 80;
  aT:         number = 0;   //air temperature
  rH:         number = 0;   //relative humidity
  wV:         number = 0;   //wind velocity
  suggestion: string = ""; //explanation
  time:       any;

  // Defines the columns displayed in the table
  displayedColumns: string[] = ['eR', 'suggestion'];
  displayedGColumns: string[] = ['eR', 'myCT', 'aT', 'rH', 'wV', 'suggestion', 'time'];

  results: any;

  gResults: Array<{eR: number, myCT: number, aT: number, rH: number, wV: number, suggestion: string, time: any, long: number, lat: number}> = [];

  chart: any; // Chart.js instance
  chartLabels: string[] = [];
  chartOptions = {
    responsive: true
  };

  // Define the backgroundColorPlugin
  backgroundColorPlugin: Plugin = {
    id: 'backgroundColorPlugin',
    beforeDraw(chart) {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      const data = chart.data.datasets[0].data as number[];
      const minValue = Math.min(...data);
      const maxValue = Math.max(...data);

      // Define thresholds
      const thresholdLow = 0.1;
      const thresholdHigh = 0.2;

      ctx.save();
      ctx.clearRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);

      // Draw green area for eR < 0.1
      ctx.fillStyle = 'green';
      ctx.fillRect(chartArea.left, chartArea.bottom - ((thresholdLow - minValue) / (maxValue - minValue)) * (chartArea.bottom - chartArea.top),
        chartArea.right - chartArea.left, (thresholdLow - minValue) / (maxValue - minValue) * (chartArea.bottom - chartArea.top));

      // Draw yellow area for 0.1 <= eR <= 0.2
      ctx.fillStyle = 'yellow';
      ctx.fillRect(chartArea.left, chartArea.bottom - ((thresholdHigh - minValue) / (maxValue - minValue)) * (chartArea.bottom - chartArea.top),
        chartArea.right - chartArea.left, ((thresholdHigh - thresholdLow) / (maxValue - minValue)) * (chartArea.bottom - chartArea.top));

      // Draw red area for eR > 0.2
      ctx.fillStyle = 'red';
      ctx.fillRect(chartArea.left, chartArea.top,
        chartArea.right - chartArea.left, chartArea.bottom - ((thresholdHigh - minValue) / (maxValue - minValue)) * (chartArea.bottom - chartArea.top));

      ctx.restore();
    }
  };
  

  ngOnInit() {
    Chart.register(...registerables, this.backgroundColorPlugin); // Register the plugin here
    this.initializeChart(); // Initialize the chart
  }


  constructor(private http: HttpClient) {}

  calculatePlasticShrinkageCracks(cT: number, aT: number, rH: number, wV: number): void {
    let eR;
    let suggestion;

    //eR = (cT^2.5 - rH/100 * aT^2.5) (1 + .4 * wV) * 10^-6
    eR = (Math.pow(this.cT, 2.5) - (this.rH/100) * Math.pow(this.aT, 2.5))*(1 + (0.4 * this.wV)) * Math.pow(10, -6);

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
    if (eR > .2) {
      return "> .2, high risk";
    } else if (eR > .1) {
      return "> .1 and < .2, medium risk";
    } 
    return "< .1, low risk";
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
              aT = period.temperature;
              rH = period.relativeHumidity.value;
              wV = parseFloat(period.windSpeed);  // Handle wind speed string conversion

              // Calculate evaporation rate and suggestion
              eR = (Math.pow(myCT, 2.5) - (rH / 100) * Math.pow(aT, 2.5)) * (1 + 0.4 * wV) * Math.pow(10, -6);
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
          label: 'Evaporation Rate (Ib/ft²/hr)',
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