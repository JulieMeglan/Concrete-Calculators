import { Routes } from '@angular/router';
import { HomeComponent } from './main-content/home/home.component';
import { CalculatorParentComponent } from './main-content/calculator-parent/calculator-parent.component';
import { MortarAndMixComponent } from './main-content/calculator-parent/mortar-and-mix/mortar-and-mix.component';
import { BogueComponent } from './main-content/calculator-parent/bogue/bogue.component';
import { TcpowersComponent } from './main-content/calculator-parent/tcpowers/tcpowers.component';
import { PlasticShrinkageCracksComponent } from './main-content/calculator-parent/plastic-shrinkage-cracks/plastic-shrinkage-cracks.component';
import { ConcreteMixComponent } from './main-content/calculator-parent/concrete-mix/concrete-mix.component';
import { ConcreteMixMetricComponent } from './main-content/calculator-parent/concrete-mix-metric/concrete-mix-metric.component';
import { MetricMortarAndMixComponent } from './main-content/calculator-parent/metric-mortar-and-mix/metric-mortar-and-mix.component'; // Import the new component
import { LoginComponent } from './main-content/login/login.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'calc', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'calc', 
      component: CalculatorParentComponent,
      children: [
        { path: 'plasticshrinkage', component: PlasticShrinkageCracksComponent },
        { path: 'tcpowers', component: TcpowersComponent },
        { path: 'bogue', component: BogueComponent },
        { path: 'concretemix', component: ConcreteMixComponent },
        { path: 'concretemixmetric', component: ConcreteMixMetricComponent },
        { path: 'mortarandmix', component: MortarAndMixComponent },
        { path: 'metric-mortarandmix', component: MetricMortarAndMixComponent },
      ] 
  },
  { path: '', redirectTo:'home', pathMatch: 'full'},
];
