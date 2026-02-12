import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../sales-service';
import { LocalStorage } from '../../local-storage';

@Component({
  selector: 'app-sales-product-add-remove',
  standalone: true,
  imports: [FormsModule, CommonModule ],
  template: `

    <div class="card mb-3">
      <div class="card-body">
        <form>
          <!-- header row: labels only, rendered once -->
          <div class="row fw-semibold mb-1">
            <div class="col-12 col-md-2 mb-1">Product name</div>
            <div class="col-12 col-md-2 mb-1">Id</div>
            <div class="col-12 col-md-2 mb-1">Category</div>
            <div class="col-12 col-md-2 mb-1">Rate</div>
            <div class="col-12 col-md-2 mb-1">Quantity</div>
            <div class="col-12 col-md-2 mb-1">Amount</div>
            <div class="col-12 col-md-2 mb-1"></div>
          </div>

          <div class="sales-row" *ngFor="let line of lines; let i = index">
            <div class="line-fields">
              <div class="field">
                <select 
                  #productName
                  class="form-select" 
                  [id]="'productName-' + i"
                  [(ngModel)]="line.productName"
                  [name]="'productName-' + i"
                  (ngModelChange)="onProductSelected(i, $event, quantityInput)"
                >
                  <option value="">--Choose--</option>
                  <option *ngFor="let p of products" [value]="p.name">
                    {{ p.name }} ({{ p.category }}) - Rs. {{ p.rate }}     
                  </option>
                </select>
              </div>

              <div class="field">
                <input
                  type="text"
                  class="form-control"
                  [id]="'id-' + i"
                  [(ngModel)]="line.id"
                  [name]="'id-' + i"
                  disabled
                >
              </div>

              <div class="field">
                <input
                  type="text"
                  class="form-control"
                  [id]="'category-' + i"
                  [(ngModel)]="line.category"
                  [name]="'category-' + i"
                  disabled
                >
              </div>

              <div class="field">
                <input
                  type="number"
                  class="form-control"
                  [id]="'rate-' + i"
                  [(ngModel)]="line.rate"
                  [name]="'rate-' + i"
                  disabled
                >
              </div>

              <div class="field">
                <input
                  #quantityInput
                  type="number"
                  class="form-control"
                  [id]="'quantity-' + i"
                  [(ngModel)]="line.quantity"
                  [name]="'quantity-' + i"
                  (ngModelChange)="onQuantityChange(i)"
                  min="1"
                  (keyup.enter)="onQuantityEnter(i)"
                >
              </div>

              <div class="field">
                <input
                  type="number"
                  class="form-control"
                  [id]="'amount-' + i"
                  [(ngModel)]="line.amount"
                  [name]="'amount-' + i"
                  disabled
                >
              </div>
            </div>

            <div class="line-actions">
              <button
                *ngIf="lines.length > 1 "
                class="btn btn-sm btn-danger"
                type="button"
                (click)="removeLine(i)"
              >
                -
              </button>
              <button
                *ngIf="i === lines.length - 1"
                class="btn btn-sm btn-primary"
                type="button"
                (click)="addLine()"
              >
                +
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

  `,
  styleUrl: './sales-product-add-remove.css',
})


export class SalesProductAddRemove {
  
  //to access product details from the local storage
  products: { id: number; name: string; category: string; rate: number }[] = [];

  //simple model for one line
  lines: {
    productName: string;
    id: string;
    category: string;
    rate: number | null;
    quantity: number | null;
    amount: number | null;
  }[] = [
    {
      productName: '',
      id: '',
      category: '',
      rate: null,
      quantity: null,
      amount: null,
    },
  ];

  //loads the product details from local storage
  constructor(private salesService: SalesService, private storage: LocalStorage) {
    this.loadProducts();
  }

  private loadProducts(){
    this.products =
    this.storage.getItem<{id: number; name: string; category: string; rate: number}[]>(
      'products'
    ) ?? [];
  }
 
  addLine() {
    this.lines.push({
      productName: '',
      id: '',
      category: '',
      rate: null,
      quantity: null,
      amount: null,
    });

  }

  //for focusing product on next line, called within the quantity button
  onQuantityEnter(currentIndex: number) {
    // add a new empty line
    this.addLine();

    const nextIndex = currentIndex + 1;

    // after Angular renders the new line, focus its product select
    setTimeout(() => {
      const select = document.getElementById(`productName-${nextIndex}`) as HTMLSelectElement | null;
      if (select) {
        select.focus();
      }
    });
  }

  //removes the selected line
  removeLine(index: number) {
    this.lines.splice(index, 1);

    this.updateSubtotal();
  }

  //when a product is selected from the dropdown
  onProductSelected(index: number, productName: string, quantityInput: HTMLInputElement) {
    const line = this.lines[index];

    if (!productName) {
      // reset line if nothing selected
      line.productName = '';
      line.id = '';
      line.category = '';
      line.rate = null;
      line.amount = null;
      this.updateSubtotal();
      return;
    }

    const product = this.products.find(p => p.name === productName);
    if (!product) {
      return;
    }

    line.productName = product.name;
    line.id = String(product.id);
    line.category = product.category;
    line.rate = product.rate;

    //if quantity already present, compute amount
    if (line.quantity != null) {
      line.amount = product.rate * line.quantity;
    }

    this.updateSubtotal();

    //focus this row's quantity input
    if (quantityInput) {
      quantityInput.focus();
    }

  }  

  //recomputes amount of all of the product lines
  updateSubtotal() {
    const subtotal = this.lines.reduce((sum, line) =>  sum + (line.amount ?? 0), 0);
    this.salesService.subtotal = subtotal;
    //keep current lines in service so Save sale can access them
    this.salesService.lines = this.lines;
  }

  //if quantity is changed the amount will change too
  onQuantityChange(index: number){
    const line = this.lines[index];
    if(line.rate == null || line.quantity == null){
      line.amount = null;
      this.updateSubtotal(); //if quantity is changed, subamount changes as well
      return;
    }
    line.amount = line.rate * line.quantity;
    this.updateSubtotal();
  }

}
