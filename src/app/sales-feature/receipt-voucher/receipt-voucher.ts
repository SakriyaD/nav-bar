import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReceiptVoucher, Sale, SalesService } from '../../sales-service';

@Component({
  selector: 'app-receipt-voucher',
  imports: [DatePipe, DecimalPipe, RouterLink],
  template: `
    <section class="voucher" aria-label="Receipt voucher">
      @if (loading()) {
        <p class="voucher__empty" role="status">Loading voucher...</p>
      } @else if (displayVoucher(); as v) {
        <header class="voucher__header">
          <h1>Receipt Voucher</h1>
          <p><strong>Voucher No:</strong> {{ v.voucherNo }}</p>
        </header>

        <div class="voucher__meta">
          <p><strong>Order ID:</strong> {{ v.saleId }}</p>
          <p><strong>Date:</strong> {{ v.date | date: 'mediumDate' }}</p>
          <p><strong>Customer:</strong> {{ v.customerName }}</p>
          <p><strong>Address:</strong> {{ v.address }}</p>
          <p><strong>Phone:</strong> {{ v.phone }}</p>
          <p><strong>Payment Method:</strong> {{ v.paymentMethod }}</p>
        </div>

        @if (sale()?.status === 'unpaid') {
          <div class="voucher__payment-form" aria-label="Payment details">
            <div class="voucher__field">
              <label for="discount">Discount</label>
              <input
                id="discount"
                type="number"
                min="0"
                class="voucher__input"
                [value]="discount()"
                (input)="updateDiscount(discountInput.value)"
                #discountInput
              >
            </div>

            <div class="voucher__field">
              <label for="discountMode">Discount Type</label>
              <select
                id="discountMode"
                class="voucher__input"
                [value]="discountMode()"
                (change)="updateDiscountMode($any(discountModeSelect.value))"
                #discountModeSelect
              >
                <option value="percent">%</option>
                <option value="amount">Rs</option>
              </select>
            </div>

            <div class="voucher__field">
              <label for="paymentMethod">Payment Method</label>
              <input
                id="paymentMethod"
                type="text"
                class="voucher__input"
                [value]="paymentMethod()"
                (input)="paymentMethod.set(paymentMethodInput.value)"
                #paymentMethodInput
              >
            </div>

            <div class="voucher__field">
              <label for="receivedBy">Received By</label>
              <input
                id="receivedBy"
                type="text"
                class="voucher__input"
                [value]="receivedBy()"
                (input)="receivedBy.set(receivedByInput.value)"
                #receivedByInput
              >
            </div>
          </div>
        }

        <div class="voucher__table-wrapper">
          <table class="voucher__table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Qty</th>
                <th scope="col">Rate</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              @for (line of v.lines; track line.productName + $index) {
                <tr>
                  <td>{{ line.productName }}</td>
                  <td>{{ line.quantity }}</td>
                  <td>{{ line.rate | number: '1.2-2' }}</td>
                  <td>{{ line.amount | number: '1.2-2' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="voucher__totals" aria-label="Voucher totals">
          <p><strong>Sub Total:</strong> {{ v.subTotal | number: '1.2-2' }} Rs</p>
          <p><strong>Tax:</strong> {{ v.tax | number: '1.2-2' }} Rs</p>
          <p>
            <strong>Discount:</strong>
            {{ v.discount | number: '1.2-2' }}
            {{ v.discountMode === 'percent' ? '%' : 'Rs' }}
          </p>
          <p class="voucher__grand-total"><strong>Total:</strong> {{ v.totalAmount | number: '1.2-2' }} Rs</p>
        </div>

        <footer class="voucher__footer">
          <p><strong>Received By:</strong> {{ v.receivedBy || receivedBy() }}</p>
          <div class="voucher__actions">
            <a routerLink="/sales/list" class="voucher__back-link">Back to Orders</a>
            @if (sale()?.status === 'unpaid') {
              <button
                type="button"
                class="voucher__pay-btn"
                [disabled]="savingPayment()"
                (click)="markAsPaid()"
              >
                {{ savingPayment() ? 'Saving...' : 'Confirm Payment' }}
              </button>
            } @else {
              <button type="button" class="voucher__print-btn" (click)="printVoucher()">Print Voucher</button>
            }
          </div>
        </footer>
      } @else {
        <p class="voucher__empty" role="status">Order not found for this voucher.</p>
      }
    </section>
  `,
  styleUrl: './receipt-voucher.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptVoucherComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly salesService = inject(SalesService);

  sale = signal<Sale | null>(null);
  voucher = signal<ReceiptVoucher | null>(null);
  loading = signal(true);
  savingPayment = signal(false);

  discount = signal(0);
  discountMode = signal<'percent' | 'amount'>('percent');
  paymentMethod = signal('Cash');
  receivedBy = signal('Sales Admin');

  private sales: Sale[] = [];

  paymentTax = computed(() => this.sale()?.tax ?? 0);
  paymentSubTotal = computed(() => this.sale()?.subtotal ?? 0);
  paymentNetTotal = computed(() => this.sale()?.netTotal ?? 0);
  paymentTotal = computed(() => {
    const net = this.paymentNetTotal();
    const rawDiscount = this.discount();

    if (this.discountMode() === 'percent') {
      const boundedPercent = Math.min(Math.max(rawDiscount, 0), 100);
      return Math.max(net * (1 - boundedPercent / 100), 0);
    }

    return Math.max(net - Math.max(rawDiscount, 0), 0);
  });

  displayVoucher = computed<ReceiptVoucher | null>(() => {
    const existingVoucher = this.voucher();
    if (existingVoucher) {
      return existingVoucher;
    }

    const currentSale = this.sale();
    if (!currentSale) {
      return null;
    }

    return this.createVoucher(currentSale, {
      voucherNo: 'Draft (Generated on payment)',
      discount: this.discount(),
      discountMode: this.discountMode(),
      totalAmount: this.paymentTotal(),
      paymentMethod: this.paymentMethod(),
      receivedBy: this.receivedBy(),
      date: currentSale.date,
    });
  });

  ngOnInit(): void {
    const saleIdParam = this.route.snapshot.paramMap.get('saleId');
    const saleId = Number(saleIdParam);

    if (!saleIdParam || Number.isNaN(saleId)) {
      this.loading.set(false);
      this.voucher.set(null);
      return;
    }

    this.salesService.getSales().subscribe((sales) => {
      this.sales = sales;
      const selectedSale = sales.find((item) => item.id === saleId) ?? null;
      this.sale.set(selectedSale);

      if (!selectedSale) {
        this.loading.set(false);
        return;
      }

      this.discount.set(selectedSale.discount ?? 0);
      this.discountMode.set(selectedSale.discountMode ?? 'percent');

      this.salesService.getReceiptVoucherBySaleId(saleId).subscribe((voucher) => {
        this.voucher.set(voucher);
        this.loading.set(false);
      });
    });
  }

  updateDiscount(value: string): void {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) {
      this.discount.set(0);
      return;
    }

    if (this.discountMode() === 'percent' && parsed > 100) {
      this.discount.set(100);
      return;
    }

    this.discount.set(parsed);
  }

  updateDiscountMode(mode: 'percent' | 'amount'): void {
    this.discountMode.set(mode);
    this.updateDiscount(String(this.discount()));
  }

  markAsPaid(): void {
    const currentSale = this.sale();
    if (!currentSale || currentSale.status === 'paid' || this.savingPayment()) {
      return;
    }

    this.savingPayment.set(true);

    const updatedSale: Sale = {
      ...currentSale,
      status: 'paid',
      discount: this.discount(),
      discountMode: this.discountMode(),
      paidTotal: this.paymentTotal(),
    };

    const updatedSales = this.sales.map((sale) => (sale.id === updatedSale.id ? updatedSale : sale));
    const voucher = this.createVoucher(updatedSale, {
      paymentMethod: this.paymentMethod(),
      receivedBy: this.receivedBy(),
    });

    this.salesService.updateSales(updatedSales).subscribe({
      next: () => {
        this.salesService.saveReceiptVoucher(voucher).subscribe({
          next: () => {
            this.sales = updatedSales;
            this.sale.set(updatedSale);
            this.voucher.set(voucher);
            this.savingPayment.set(false);
          },
          error: () => {
            this.savingPayment.set(false);
          },
        });
      },
      error: () => {
        this.savingPayment.set(false);
      },
    });
  }

  private createVoucher(
    sale: Sale,
    overrides: Partial<ReceiptVoucher> = {},
  ): ReceiptVoucher {
    const now = new Date();
    const seed = now.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);

    return {
      voucherNo: overrides.voucherNo ?? `RV-${seed}-${sale.id}`,
      saleId: sale.id,
      date: overrides.date ?? now.toISOString(),
      customerName: sale.customerName,
      address: sale.address,
      phone: sale.phone,
      subTotal: sale.subtotal,
      tax: sale.tax,
      discount: overrides.discount ?? sale.discount ?? 0,
      discountMode: overrides.discountMode ?? sale.discountMode ?? 'percent',
      totalAmount: overrides.totalAmount ?? sale.paidTotal ?? sale.netTotal,
      paymentMethod: overrides.paymentMethod ?? 'Cash',
      receivedBy: overrides.receivedBy ?? 'Sales Admin',
      lines: sale.lines.map((line) => ({
        productName: line.productName,
        quantity: line.quantity ?? 0,
        rate: line.rate ?? 0,
        amount: line.amount ?? 0,
      })),
    };
  }

  printVoucher(): void {
    window.print();
  }
}
