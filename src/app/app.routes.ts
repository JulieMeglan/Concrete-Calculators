import { Routes } from '@angular/router';
import { HomeComponent } from './main-content/home/home.component';
import { CalculatorParentComponent } from './main-content/calculator-parent/calculator-parent.component';
import { MainContentComponent } from './main-content/main-content.component';
import { MortarAndMixComponent } from './main-content/calculator-parent/mortar-and-mix/mortar-and-mix.component';

export const routes: Routes = [
    { path: '', component: MainContentComponent, 
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'calc', 
                component: CalculatorParentComponent
                ,children: [
                 { path: 'calc', component: CalculatorParentComponent },
                 { path: 'calc', component: CalculatorParentComponent },
                 { path: 'calc', component: CalculatorParentComponent },
                 { path: 'morterandmix', component: MortarAndMixComponent },
                ] 
            },
        ]
    },
    { path: '**', component: MainContentComponent },
];
