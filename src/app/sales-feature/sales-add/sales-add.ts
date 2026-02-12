import { Component, ViewChild } from '@angular/core';
import { SalesNavigation } from '../sales-navigation/sales-navigation';
import { SalesCustomerDetails } from '../sales-customer-details/sales-customer-details';
import { SalesProductAddRemove } from '../sales-product-add-remove/sales-product-add-remove';
import { SalesTotal } from '../sales-total/sales-total';
import { CdkTrapFocus } from '@angular/cdk/a11y';

@Component({
  selector: 'app-sales-add',
  standalone: true,
  imports: [SalesNavigation, SalesCustomerDetails, SalesProductAddRemove, SalesTotal, CdkTrapFocus],
  template: `
    <div cdkTrapFocus>
      <h2>Order Transaction</h2>

      <app-sales-navigation
        [showSave]="true"
        [showAdd]="false"
        [showView]="true"
        (saveSale)="saveOrder()"
      ></app-sales-navigation>

      <h4>Customer Details:</h4>
      <app-sales-customer-details></app-sales-customer-details>
      <hr />

      <h4>Enter product details:</h4>
      <app-sales-product-add-remove></app-sales-product-add-remove>
      <hr />

      <h4>Grand Total:</h4>
      <app-sales-total #total></app-sales-total>
    </div>
  `,
})
export class SalesAdd {
  @ViewChild('total') total?: SalesTotal;

  // You can expose a save() here if you want to trigger it from SalesNavigation later
  saveOrder() {
    this.total?.onSaveSale();
  }
}