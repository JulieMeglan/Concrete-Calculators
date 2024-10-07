import { MatDialog } from '@angular/material/dialog';
import { AboutDialogComponent } from '../about-dialog/about-dialog.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd, RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-calculator-parent',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './calculator-parent.component.html',  
  styleUrls: ['./calculator-parent.component.css']   
})
export class CalculatorParentComponent implements OnInit {
  public aboutText: string = 'test';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    // Subscribe to Router events and filter NavigationEnd events
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Update aboutText based on the active route after navigation ends
      const activePath = this.route.firstChild?.snapshot.url[0]?.path;
      this.updateAboutText(activePath);
    });

    // Manually call updateAboutText on initial load to set the aboutText correctly
    const initialPath = this.route.firstChild?.snapshot.url[0]?.path;
    this.updateAboutText(initialPath);
  }

  updateAboutText(activePath: string | undefined) {
    switch (activePath) {
      case 'plasticshrinkage':
          this.aboutText = `
            <p>Plastic shrinkage cracks are fine cracks that occur on the surface of concrete before initial set. Although they are not structurally detrimental, they may not be visually appealing and may impact long term durability of the concrete. Numerous studies [see ACI 305R, ACI 308R, Hover, NRMCA, and Uno] have shown that the potential for plastic shrinkage cracking to occur is a function of the ambient weather conditions, particularly the humidity level and the wind speed, as well as the concrete mix design and fresh concrete temperature.</p>
        
            <p>The computer software application here can be used to predict the potential for plastic shrinkage cracks to occur based on the formula discussed by Uno. Formulas for determining concrete temperature as a function of ambient temperature are based on those discussed by Ramey and Carden. Weather data is obtained from the U.S. National Weather Service.</p>
        
            <p>The results provided by the calculator are intended for educational and informational purposes only. Please direct inquiries about this site to awerner@siue.edu or mgrinte@siue.edu.</p>
        
            <br>
            <p><em>References</em></p>
            <ul>
              <li>ACI 305 Hot Weather Concreting, American Concrete Institute, Farmington Hills, MI, <a href="http://www.concrete.org">www.concrete.org</a>.</li>
              <br><li>ACI 308 Guide to Curing Concrete, American Concrete Institute, Farmington Hills, MI, <a href="http://www.concrete.org">www.concrete.org</a>.</li>
              <br><li>NRMCA, Concrete in Practice, CIP 5 – Plastic Shrinkage Cracking, National Ready Mixed Concrete Association, Silver Spring, MD, <a href="http://www.nrmca.org">www.nrmca.org</a>.</li>
              <br><li>Hover, K.C., “Evaporation of Water from Concrete Surfaces,” ACI Materials Journal, Sept-Oct 2006, Vol. 103, No. 5., pp. 384 – 389.</li>
              <br><li>Ramey, G.E. and Carden, A.C., “An Assessment of Concrete Bridge Deck Evaporation Rates and Curing Requirement Categories for Alabama,” HRC Research Project 2-13746, Feb 1998.</li>
              <br><li>Uno, P. J., “Plastic Shrinkage Cracking and Evaporation Formulas,” ACI Materials Journal, July - Aug 1998, Vol. 95, No. 4, pp. 365.</li>
            </ul>
          `;
          break;        
      case 'tcpowers':
          this.aboutText = `
            <p>T.C. Powers and T.L. Brownyard published a nine-part series of articles in the late 1940s titled “Studies of the Physical Properties of Hardened Portland Cement Paste.” They proposed a simple set of empirical equations that can be used to estimate the volume relationships of the various hydration phases and porosity based on the water/cement ratio (w/c) and the degree of hydration (α). (<em>Concrete</em> and Powers).</p>
              
            <br><p><em>References</em></p>
            <p><em>Concrete</em>, 2nd Edition, S. Mindess, J.F. Young, D. Darwin, Pearson, 2003.</p>
            <p>Powers, T.C. and Brownyard, T.L., “Studies of the Physical Properties of Hardened Portland Cement Paste,” Journal Proceedings, American Concrete Institute, Vol. 43, Issue 9.</p>
            `;
          break;
      case 'bogue':
          this.aboutText = `
            <p>R.H. Bogue is known as one of the first to investigate methods for predicting the phase or compound composition of Portland cement based on the oxide composition (ACI SP 249-2 and Concrete). The current versions of the Bogue calculations, the ones used here, can be found in ASTM C150-20 in Annex A1.</p>
            <br><p><em>References</em></p>
            <p>ASTM C150-20 Standard Specification for Portland Cement</p>
            <p>Concrete, 2nd Edition, S. Mindess, J.F. Young, D. Darwin, Pearson, 2003.</p>
            <p>ACI SP 249-2, “A tribute to "Calculation of the Compounds in Portland Cement" by R.H. Bogue with foreword by Paul Brown, American Concrete Institute Symposium Papers, Vol. 249, pages 45-54.</p>
          `;
          break;      
        case 'concretemix':
            this.aboutText = `
              <p>As stated in <em>Design and Control of Concrete Mixtures</em>, the goal of concrete mixture design is to create a workable fresh concrete mix that meets performance requirements including long-term durability, required strength level, and desired appearance. 
              There are several methods or approaches that can be used to design a concrete mixture and determine the relative proportions of each ingredient. One method is provided by <em>ACI PRC-211.1-91</em>. Once the design and relative proportions of each concrete ingredient are determined, the mixture proportions for a desired volume of concrete can be calculated using a spreadsheet or the calculator shown here.</p>
              
              <br><p><em>References</em></p>
              <p><em>Design and Control of Concrete Mixtures</em>, 16th Edition, by S. H. Kosmatka and M. L. Wilson, Portland Cement Association, 2016.</p>
              <p>ACI PRC-211.1-91: Standard Practice for Selecting Proportions for Normal, Heavyweight, and Mass Concrete (Reapproved 2009).</p>
            `;
            break;
      case 'concretemixmetric':
        this.aboutText = `
        <p>As stated in <em>Design and Control of Concrete Mixtures</em>, the goal of concrete mixture design is to create a workable fresh concrete mix that meets performance requirements including long-term durability, required strength level, and desired appearance. 
        There are several methods or approaches that can be used to design a concrete mixture and determine the relative proportions of each ingredient. One method is provided by ACI PRC-211.1-91. Once the design and relative proportions of each concrete ingredient are determined, the mixture proportions for a desired volume of concrete can be calculated using a spreadsheet or the calculator shown here.</p>
        
        <br><p><em>References</em></p>
        <p><em>Design and Control of Concrete Mixtures</em>, 16th Edition, by S. H. Kosmatka and M. L. Wilson, Portland Cement Association, 2016.</p>
        <p>ACI PRC-211.1-91: Standard Practice for Selecting Proportions for Normal, Heavyweight, and Mass Concrete (Reapproved 2009).</p>
      `;
        break;
      case 'mortarandmix':
        this.aboutText = 'Mortar and Mix (Imperial) is a very smart calculator';
        break;
      case 'metric-mortarandmix':
        this.aboutText = 'Mortar and Mix (Metric) is a very smart calculator';
        break;
      default:
        this.aboutText = 'About this calculator';
    }
  }
  

  openAboutDialog() {
    this.dialog.open(AboutDialogComponent, {
      data: this.aboutText,
      width: '60vw', // 80% of the viewport width
      maxWidth: '100vw' // Maximum width of the viewport
    });
  }
}
