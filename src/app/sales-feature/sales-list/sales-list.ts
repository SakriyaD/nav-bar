import { Component, OnInit } from '@angular/core';
import { SalesNavigation } from '../sales-navigation/sales-navigation';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkTrapFocus } from '@angular/cdk/a11y';  
import { RouterOutlet } from '@angular/router';
import { SalesService, Sale, ReceiptVoucher } from '../../sales-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [SalesNavigation, CommonModule, FormsModule, CdkTrapFocus, RouterOutlet],
  template: `
    <div class="order-container" cdkTrapFocus>
      <h2>Order Lists</h2>

      <app-sales-navigation
        [showSave]="false"
        [showSearch]="true"
        [searchValue]="searchTerm"
        searchPlaceholder="Search by order id, customer, product, date or status"
        (searchChange)="onSearch($event)"
      ></app-sales-navigation>
      <div class="product-content">
       
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Order Id</th>
              <th scope="col">Date</th>
              <th scope="col">Customer</th>
              <th scope="col">Product(s)</th>
              <th scope="col">Total Amount</th>
              <th scope="col">Actions</th>
              <th scope="col">Status</th>
              <th scope="col">Payment</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            <tr *ngFor="let s of filteredSales; let i = index">
              <th scope="row">{{ s.id }}</th>
              <td>{{ s.date | date: 'mediumDate' }}</td>
              <td>{{ s.customerName }}</td>
              <td>{{ getProductSummary(s) }}</td>
              <td>{{ (s.paidTotal ?? s.netTotal).toFixed(2) }}</td>
              <td>
                <a href="" data-bs-toggle="modal" data-bs-target="#salelistmodal" (click)="selectedSale = s; $event.preventDefault()">
                  Details
                </a> 
                / 
                <a href="" (click)="onRemove(s); $event.preventDefault()" >Remove</a>
              </td>
              <td>
                <span
                  [class.text-success]="s.status === 'paid'"
                  [class.text-danger]="s.status === 'unpaid'"
                >
                  {{ s.status === 'paid' ? 'Paid' : 'Unpaid' }}
                </span>
              </td>
              <td>
                <!-- Pay button when unpaid -->
                @if (s.status === 'unpaid'){
                  <button 
                    type="button" 
                    class="btn btn-success" 
                    data-bs-toggle="modal" 
                    data-bs-target="#receiptModal" 
                    (click)="openReceipt(s); $event.preventDefault()"                
                  >
                  Pay
                  </button>
                } 
                <!-- Undo button when paid -->  
                @else  {
                  <button
                    type="button"
                    class="btn btn-primary me-2"
                    (click)="viewVoucher(s); $event.preventDefault()"
                  >
                    Voucher
                  </button>
                    <button
                      type="button"
                      class="btn btn-warning"
                      (click)="undoPayment(s); $event.preventDefault()"
                    >
                      Undo
                    </button>
                }           
              </td>
            </tr>
            <tr *ngIf="!loading && filteredSales.length === 0">
              <td colspan="8" class="text-center">No matching sales found.</td>
            </tr>
          </tbody>
        </table>
        <div class="product-content">
  
          @if (loading) {
            <div class="text-center my-4">
              <div class="spinner-border text-primary" role="status"></div>
              <p>Loading your orders...</p>
            </div>
          }

          @if (!loading && sales.length === 0) {
            <div class="alert alert-info">
              No sales records found.
            </div>
          }

        </div>

      </div>

      <router-outlet></router-outlet>

      <!-- modal for sale details -->

      <div class="modal fade" id="salelistmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Order Details</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" >
              <ul class="list-group list-group-flush" *ngIf="selectedSale">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Order Id:
                  <span>
                    {{ selectedSale.id}}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Date:
                  <span>
                    {{ selectedSale.date | date: 'mediumDate' }}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Customer Name:
                  <span>
                    {{ selectedSale.customerName }}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Address:
                  <span>
                    {{ selectedSale.address }}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Phone:
                  <span>
                    {{ selectedSale.phone}}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Product(s):
                  <span>
                    <ng-container *ngIf="selectedSale.lines.length; else noProducts">
                      {{ getAllProductNames(selectedSale) }}
                    </ng-container>
                    <ng-template #noProducts>
                      -
                    </ng-template>
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Tax:
                  <span>
                    {{ selectedSale.tax}}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Sub Total:
                  <span>
                    {{ selectedSale.subtotal}}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Net Total:
                  <span>
                    {{ selectedSale.netTotal.toFixed(2) }}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Status:
                  <span>
                    {{ selectedSale.status === 'paid' ? 'Paid' : 'Unpaid' }}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Discount:
                  <span>
                    {{ selectedSale.discount ?? 0 }}
                    {{ selectedSale.discountMode === 'percent' ? '%' : 'Rs' }}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Total Amount:
                  <span>
                      {{ (selectedSale.paidTotal ?? selectedSale.netTotal).toFixed(2) }} Rs
                  </span>
                </li>
              </ul>
            </div>
            <div class="modal-footer">
              <button (click)="printPage()">Print Details</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="receiptModal" tabindex="-1" aria-labelledby="receiptModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div 
            class="modal-content" 
            cdkTrapFocus>
                  
            <!-- Modal Header -->
            <div class="modal-header">
                <h5 class="modal-title" id="receiptModalLabel">Payment Receipt</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
                  
            <!-- Modal Body (Receipt Content) -->
            <div class="modal-body" >
              <div class="text-center mb-4" *ngIf="selectedSale">
                <h2>Thank you for your purchase!</h2>
                <p><strong>Order ID:</strong> {{ selectedSale.id}}</p>
              </div>

              <ul class="list-group list-group-flush" *ngIf="selectedSale">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Customer 
                  <span>{{ selectedSale.customerName }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Product(s)
                  <span>
                    @if (selectedSale.lines.length > 0) {
                      {{ getAllProductNames(selectedSale) }}
                    } 
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Sub total
                  <span>{{ paymentSubtotal.toFixed(2) }} Rs</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Tax (13%)
                  <span>{{ paymentTax.toFixed(2) }} Rs</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Net total
                  <span>{{ selectedSale.netTotal.toFixed(2) }} Rs</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Discount
                  <span>
                    <input
                    #discountInput
                    type="number"
                    class="form-control"
                    id="discount"
                    [(ngModel)]="discount"
                    name="discount"
                    (ngModelChange)="onDiscountChange($event)"
                    min="0"
                  >
                  <select
                    class="form-select form-select-sm" aria-label="Small select example"
                    [(ngModel)]="discountMode"
                    name="discountMode"
                    (ngModelChange)="onDiscountModeChange($event)"
                  >
                    <option value="percent" selected>%</option>
                    <option value="amount">Rs</option>
                  </select>
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <strong>Total Amount</strong>
                  <strong>{{ paymentTotal.toFixed(2) }} Rs</strong>
                </li>
              </ul>

              <div class="mt-4" *ngIf="selectedSale">
                <p><strong>Date:</strong> {{ selectedSale.date | date: 'mediumDate' }}</p>
              </div>

            </div>
            
            <!-- Modal Footer -->
            <div class="modal-footer">
              <!-- Pay button when unpaid -->
              <button 
                
                type="button" 
                class="btn btn-success" 
                (click)="markAsPaid()"
                data-bs-dismiss="modal"
              >
                Pay
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
    

  `,
  styleUrl: './sales-list.css',
})
export class SalesList implements OnInit {
  sales: Sale[] = [];
  filteredSales: Sale[] = [];
  loading = true;
  searchTerm = '';

  selectedSale: Sale | null = null;




  products: { id: number; name: string; category: string; rate: number }[] = [];

  //discount info
  discount= 0;
  discountMode: 'percent' | 'amount' = 'percent';

  //initializes a component’s in-memory sales and products arrays by loading previously persisted data from LocalStorage
  constructor(private salesService: SalesService, private router: Router) {}

  ngOnInit(): void {
    this.loadSales();
    
  }

  loadSales() {
    this.loading = true;
    this.salesService.getSales().subscribe((sales) => {
      this.sales = sales;
      this.applySalesFilter();
      this.loading = false;
    });
  }

  onSearch(value: string): void {
    // Live filter update as user types.
    this.searchTerm = value;
    this.applySalesFilter();
  }

  private applySalesFilter(): void {
    const query = this.searchTerm.trim().toLowerCase();

    if (!query) {
      this.filteredSales = [...this.sales];
      return;
    }

    // Linear (sequential) search with substring matching across multiple fields.
    this.filteredSales = this.sales.filter((sale) => {
      const productNames = sale.lines.map((line) => line.productName).join(' ').toLowerCase();
      const formattedDate = new Date(sale.date).toLocaleDateString().toLowerCase();

      return (
        String(sale.id).includes(query) ||
        sale.customerName.toLowerCase().includes(query) ||
        sale.status.toLowerCase().includes(query) ||
        productNames.includes(query) ||
        formattedDate.includes(query)
      );
    });
  }

  //removes a sale from the list after user confirmation
  onRemove(sale: Sale) {
    if (confirm(`Are you sure you want to remove order "${sale.id}"?`)) {
      this.salesService.removeSale(sale.id).subscribe({
        next: () => this.loadSales(),  // Reload after removal
        error: (error) => alert(error.message)
      });
    }
  }

  //resets discount field on opening receipt modal
  openReceipt(sale: Sale) {
    this.selectedSale = sale;

    // reset discount state for this payment
    this.discount = 0;
    this.discountMode = 'percent';
  }

  //trackBy for ngFor
  trackById(index: number, item: Sale): number {
    return item.id;
  }
  getProductSummary(sale: Sale): string {
    if (!sale.lines || sale.lines.length === 0) {
      return '-';
    }
    //map each line's product id to current product name (in case it was edited)
    const names = sale.lines.map(line => {
      const idNum = Number(line.id);
      const current = this.products.find(p => p.id === idNum);
      return current?.name ?? line.productName;
    });

    //dedupe and summarize
    const uniqueNames = Array.from(new Set(names));
    if (uniqueNames.length === 1) { //if only 1 product, this runs
      return uniqueNames[0];
    }
    const [first, ...rest] = uniqueNames; //if more than 1 product this runs
    return `${first} + ${rest.length} more`;
  }

  //will show all the added products, used in the details modal
  getAllProductNames(sale: Sale): string {
    if (!sale.lines || sale.lines.length === 0) {
      return '-';
    }
    return sale.lines.map(line => line.productName).join(', ');
  }

  //base subtotal for payment calculations
  get paymentSubtotal(): number {
    return this.selectedSale ? this.selectedSale.subtotal : 0;
  }

  //the net total stored for the sale (subtotal + tax)
  get paymentNetTotal(): number {
    return this.selectedSale ? this.selectedSale.netTotal : 0;
  }

  //subtotal after applying discount (percent or flat Rs)
  get discountedNetTotal(): number {
    const netTotal = this.paymentNetTotal;

    if (this.discountMode === 'percent') { //if % is selected
      const factor = 1 - this.discount / 100;
      return Math.max(netTotal * factor, 0);
    }

    //flat Rs if selected
    return Math.max(netTotal - this.discount, 0);
  }

  //tax on discounted net total (13%)
  get paymentTax(): number {
    const taxRate = 0.13;
    return this.paymentSubtotal * taxRate;
  }

  //final total: discounted net total
  get paymentTotal(): number {
    return this.discountedNetTotal;
  }

  //keep discount in range when user types
  onDiscountChange(value: string) {
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) {
      this.discount = 0;
      return;
    }
    if (this.discountMode === 'percent' && num > 100) { 
      this.discount = 100;
      return;
    }
    this.discount = num;
  }

  onDiscountModeChange(mode: 'percent' | 'amount') {
    this.discountMode = mode;
    // re-validate current discount value
    this.onDiscountChange(String(this.discount));
  }
  
  markAsPaid() {
    if (!this.selectedSale) {
      return;
    }

    this.selectedSale.status = 'paid';
    //store the discount used for this payment (0 by default if user did nothing)
    this.selectedSale.discount = this.discount;
    this.selectedSale.discountMode = this.discountMode;
    //store the final total after discount for this order
    this.selectedSale.paidTotal = this.paymentTotal;

    //persist back to localStorage
    const index = this.sales.findIndex(s => s.id === this.selectedSale!.id);
    if (index !== -1) {
      const updatedSale = { ...this.selectedSale };
      this.sales[index] = updatedSale;
      this.selectedSale = updatedSale; // Keep selectedSale in sync

      const voucher = this.createVoucher(updatedSale);

      this.salesService.updateSales(this.sales).subscribe({
        next: () => {
          this.salesService.saveReceiptVoucher(voucher).subscribe({
            next: () => {
              void this.router.navigate(['/sales/voucher', updatedSale.id]);
            },
            error: (err) => console.error('Saving voucher failed', err),
          });
        },
        error: (err) => console.error('Saving to local storage failed', err)
      });
    }

  }

  undoPayment(sale: Sale) {
    sale.status = 'unpaid';
    sale.paidTotal = undefined;
    sale.discount = undefined;
    sale.discountMode = 'percent';

    const index = this.sales.findIndex(s => s.id === sale.id);
    if (index !== -1) {
      const updatedSale = { ...sale };
      this.sales[index] = updatedSale;
      if (this.selectedSale && this.selectedSale.id === sale.id) {
        this.selectedSale = updatedSale;
      }
      this.salesService.updateSales(this.sales).subscribe();
      this.salesService.removeReceiptVoucherBySaleId(sale.id).subscribe();
    }
  }

  viewVoucher(sale: Sale): void {
    void this.router.navigate(['/sales/voucher', sale.id]);
  }

  private createVoucher(sale: Sale): ReceiptVoucher {
    const now = new Date();
    const voucherNumberSeed = now.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);

    return {
      voucherNo: `RV-${voucherNumberSeed}-${sale.id}`,
      saleId: sale.id,
      date: now.toISOString(),
      customerName: sale.customerName,
      address: sale.address,
      phone: sale.phone,
      subTotal: sale.subtotal,
      tax: sale.tax,
      discount: sale.discount ?? 0,
      discountMode: sale.discountMode ?? 'percent',
      totalAmount: sale.paidTotal ?? sale.netTotal,
      paymentMethod: 'Cash',
      receivedBy: 'Sales Admin',
      lines: sale.lines.map((line) => ({
        productName: line.productName,
        quantity: line.quantity ?? 0,
        rate: line.rate ?? 0,
        amount: line.amount ?? 0,
      })),
    };
  }

  printPage() {
    window.print();
  }

}