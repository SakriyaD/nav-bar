import { AfterViewInit, ElementRef, ViewChild, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../sales-service';

@Component({
  selector: 'app-sales-customer-details',
  imports: [FormsModule],
  template: `
    <div class="card mb-3" >
      <div class="card-body">
        <form>
          <div class="row">
            <div class="col-12 col-md-4 mb-3">
              <label for="customerName" class="form-label">Customer name</label>
              <input 
                #customerInput
                type="text"
                class="form-control"
                id="customerName"
                autocomplete
                required
                [(ngModel)]="customerName"
                name="customerName"
                (ngModelChange)="onCustomerNameChange($event)"
                (keyup.enter)="focus(addressInput)" 
              >
              
            </div>
            <div class="col-12 col-md-4 mb-3">
              <label for="address" class="form-label">Address</label>
              <input
              #addressInput
                type="text"
                class="form-control"
                id="address"
                required
                [(ngModel)]="address"
                name="address"
                (ngModelChange)="onAddressChange($event)"
                (keyup.enter)="focus(phoneInput)"
              >
            </div>        
            <div class="col-12 col-md-4 mb-3">
              <label for="phone" class="form-label">Phone</label>
              <input
                #phoneInput
                type="tel"
                class="form-control"
                id="phone"
                inputmode="numeric"
                required
                [(ngModel)]="phone"
                name="phone"
                (ngModelChange)="onPhoneChange($event)"
                maxlength="10"
              >
            </div>                               
          </div>
        </form>      
      </div>
    </div>

  `,
  styleUrl: './sales-customer-details.css',
})
export class SalesCustomerDetails implements AfterViewInit {

  //for focusing on the customer input on page load
  @ViewChild('customerInput') customerInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    this.customerInput.nativeElement.focus();
  }

  customerName = '';
  address = '';
  phone = '';
  discount = 0;
  discountMode: 'percent'| 'amount' = 'percent';


  constructor(private salesService: SalesService) {}

  focus(next: HTMLInputElement){
    if (next) {
      next.focus();
    }
  }

  onCustomerNameChange(value: string) {
    this.customerName = value;
    this.salesService.customerName = value.trim();
}

  onAddressChange(value: string) {
    this.address = value;
    this.salesService.address = value.trim();
  }

  onPhoneChange(value: string) {
    this.phone = value;
    this.salesService.phone = value.trim();
  }
  // simple validation for this step
  isValid(): boolean {
    const nameOk = this.customerName.trim().length > 0;
    const addressOk = this.address.trim().length > 0;
    const phoneOk = /^\d{10}$/.test(this.phone.trim());
    return nameOk && addressOk && phoneOk;
  }
}