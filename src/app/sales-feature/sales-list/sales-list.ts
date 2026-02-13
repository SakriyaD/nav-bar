import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SalesNavigation } from '../sales-navigation/sales-navigation';
import { CommonModule } from '@angular/common';
import { CdkTrapFocus } from '@angular/cdk/a11y';  
import { SalesService, Sale } from '../../sales-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sales-list',
  imports: [SalesNavigation, CommonModule, CdkTrapFocus],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
            @for (s of filteredSales; track s.id) {
            <tr>
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
                    (click)="openVoucherPage(s.id)"
                  >
                    Pay
                  </button>
                } 
                <!-- Undo button when paid -->  
                @else  {
                  <button
                    type="button"
                    class="btn btn-primary me-2"
                    (click)="openVoucherPage(s.id)"
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
            }
            @if (!loading && filteredSales.length === 0) {
            <tr>
              <td colspan="8" class="text-center">No matching sales found.</td>
            </tr>
            }
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
        next: () => {
          this.salesService.removeReceiptVoucherBySaleId(sale.id).subscribe();
          this.loadSales();
        },  // Reload after removal
        error: (error) => alert(error.message)
      });
    }
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
      this.salesService.updateSales(this.sales).subscribe({
        next: () => {
          this.salesService.removeReceiptVoucherBySaleId(sale.id).subscribe();
        },
      });
    }
  }

  openVoucherPage(saleId: number): void {
    void this.router.navigate(['/sales/voucher', saleId]);
  }

  printPage() {
    window.print();
  }

}