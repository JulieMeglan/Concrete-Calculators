import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-about-dialog',
  template: `
    <div mat-dialog-content class="dialog-content" [innerHTML]="data"></div>
  `,
  styleUrls: ['./about-dialog.component.css'] // Add this line if you create a separate CSS file for styles
})
export class AboutDialogComponent {
  safeHtmlContent: SafeHtml;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private sanitizer: DomSanitizer
  ) {
    // Sanitize the HTML content
    this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(data);
  }

}
