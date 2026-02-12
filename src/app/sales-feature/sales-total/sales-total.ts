import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../sales-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-total',
  imports: [FormsModule ],
  standalone: true,
  template: `
      <div class="card mb-3">
        <div class="card-body">
          <form (ngSubmit)="onSaveSale()">
            <div class="row">
              <div class="col-12 col-md-4 mb-3">
                <label for="amount" class="form-label">Sub Total</label>
                <input
                  type="text"
                  class="form-control"
                  id="amount"
                  [value]="subtotal + ' Rs'"
                  disabled
                />
              </div>
              <div class="col-12 col-md-4 mb-3">
                <label for="tax" class="form-label">Taxed amount</label>
                <input
                  type="text"
                  class="form-control"
                  id="tax"
                  [value]="taxed.toFixed(2) + ' Rs'"
                  disabled
                />
              </div>
              <div class="col-12 col-md-4 mb-3">
                <label for="netAmount" class="form-label">Net Total</label>
                <input
                  type="text"
                  class="form-control"
                  id="netAmount"
                  [value]="netAmount.toFixed(2) + ' Rs'"
                  disabled
                />
              </div>
            </div>
          </form>
        </div>
      </div>
  `,
  styleUrl: './sales-total.css',
})
export class SalesTotal {
  constructor(private salesService: SalesService, private router: Router) {}

  get subtotal(): number {
    return this.salesService.subtotal;
  }

  get taxed(): number {
    const { subtotal } = this;
    const taxRate = 0.13;
    // return discounted * taxRate;
    return subtotal * taxRate;

  }

  //for calculating final total
  get netAmount(): number {
    const { subtotal } = this;
    return subtotal + this.taxed;

  }

  get isValid(): boolean {
    return this.subtotal > 0 && this.salesService.customerName.length > 0;
  }

  onSaveSale() {
    console.log('onSaveSale called');

    const {
      customerName,
      address,
      phone,
      lines,
    } = this.salesService;

    if (!this.isValid) {
      console.log('subtotal in onSaveSale', this.subtotal);
      console.log('customerName in service', this.salesService.customerName);
      console.log('lines in service', this.salesService.lines);
      alert(
        'Please enter at least one product and customer name before saving.'
      );
      return;
    }

    this.salesService.saveSale({
      customerName,
      address,
      phone,
      tax: this.taxed,
      subtotal: this.subtotal,
      netTotal: this.netAmount,
      lines,
      status: 'unpaid',
    }).subscribe({
      next: () => {
      alert('Sale saved successfully.');
      this.salesService.resetCurrentSale();
      this.router.navigate(['/sales']);
      },

      // Error handling, when save fails with backend issues
      error: (err) => {
        console.error('Error saving sale:', err);
        alert('Failed to save sale. Please try again.');
      }
    });
  }
}