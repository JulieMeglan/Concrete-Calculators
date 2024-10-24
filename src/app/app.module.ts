import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RouterModule } from '@angular/router'; 
import { AppComponent } from './app.component';
import { GroceryListComponent } from './grocery-list/grocery-list.component';
import { CalculatorParentComponent } from './main-content/calculator-parent/calculator-parent.component';

@NgModule({
  declarations: [
    AppComponent,
    GroceryListComponent, // Declare your GroceryListComponent
    CalculatorParentComponent // Other components you want to declare
  ],
  imports: [
    BrowserModule,
    FormsModule, // Import FormsModule here
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent] // Bootstrap the AppComponent
})
export class AppModule { }
