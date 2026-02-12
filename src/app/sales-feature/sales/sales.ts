import { Component, ViewChild } from '@angular/core';
import { SalesNavigation } from '../sales-navigation/sales-navigation';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { RouterOutlet } from '@angular/router';
import { SalesAdd } from '../sales-add/sales-add';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [ SalesNavigation, CdkTrapFocus, RouterOutlet ],
  template: `
  <div cdkTrapFocus>
  
    <app-sales-navigation
      [showSave]="false"
      [showAdd]="false"
      [showView]="false"
      (saveSale)="onSaveSaleClicked()"
      >
    </app-sales-navigation>

    <router-outlet></router-outlet>

  </div>

  `,
  styleUrl: 'sales.css',
})
export class Sales {  

  onSaveSaleClicked(): void {
    // No total component here anymore
  }
}
