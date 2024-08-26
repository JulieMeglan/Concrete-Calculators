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
  public aboutText: string = '';

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
      // Get the active route path
      const activePath = this.route.snapshot.firstChild?.url[0]?.path;
      this.updateAboutText(activePath);
    });
  }

  updateAboutText(activePath: string | undefined) {
    switch (activePath) {
      case 'plasticshrinkage':
        this.aboutText = 'Plastic Shrinkage Cracks is a very smart calculator';
        break;
      case 'tcpowers':
        this.aboutText = 'TC Powers is a very smart calculator.';
        break;
      case 'bogue':
        this.aboutText = 'Bogue is a very smart calculator';
        break;
      case 'concretemix':
        this.aboutText = 'Concrete Mix (Imperial) is a very smart calculator';
        break;
      case 'concretemixmetric':
        this.aboutText = 'Concrete Mix (Metric) is a very smart calculator';
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
      width: '400px'
    });
  }
}
