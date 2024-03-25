import { Routes } from '@angular/router';
import { HomeComponent } from './main-content/home/home.component';
import { CalculatorParentComponent } from './main-content/calculator-parent/calculator-parent.component';
import { MainContentComponent } from './main-content/main-content.component';
import { MortarAndMixComponent } from './main-content/calculator-parent/mortar-and-mix/mortar-and-mix.component';
import { BogueComponent } from './main-content/calculator-parent/bogue/bogue.component';
import { TcpowersComponent } from './main-content/calculator-parent/tcpowers/tcpowers.component';
import { PlasticShrinkageCracksComponent } from './main-content/calculator-parent/plastic-shrinkage-cracks/plastic-shrinkage-cracks.component';

export const routes: Routes = [
    { path: '', component: MainContentComponent, 
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'calc', 
                component: CalculatorParentComponent
                ,children: [
                 { path: 'plastic', component: PlasticShrinkageCracksComponent },
                 { path: 'tcpowers', component: TcpowersComponent },
                 { path: 'bogue', component: BogueComponent },
                 { path: 'morterandmix', component: MortarAndMixComponent }
                ] 
            },
        ]
    },
    { path: '**', component: MainContentComponent },
];
