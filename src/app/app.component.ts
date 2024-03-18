import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { MainContentComponent } from "./main-content/main-content.component";
import {MatToolbarModule} from '@angular/material/toolbar';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
        RouterOutlet,
        RouterModule,
        MatSidenavModule,
        MatButtonModule, 
        MainContentComponent, 
        MatToolbarModule]
})

export class AppComponent {
  title = 'ConcreteCalculators';
}