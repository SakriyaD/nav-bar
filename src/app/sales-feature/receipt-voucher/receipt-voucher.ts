import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReceiptVoucher, SalesService } from '../../sales-service';

@Component({
  selector: 'app-receipt-voucher',
  imports: [DatePipe, DecimalPipe, RouterLink],
  template: `
    <section class="voucher" aria-label="Receipt voucher">
      @if (loading()) {
        <p class="voucher__empty" role="status">Loading voucher...</p>
      } @else if (voucher(); as v) {
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
          <p><strong>Received By:</strong> {{ v.receivedBy }}</p>
          <div class="voucher__actions">
            <a routerLink="/sales/list" class="voucher__back-link">Back to Orders</a>
            <button type="button" class="voucher__print-btn" (click)="printVoucher()">Print Voucher</button>
          </div>
        </footer>
      } @else {
        <p class="voucher__empty" role="status">No receipt voucher data available.</p>
      }
    </section>
  `,
  styleUrl: './receipt-voucher.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptVoucherComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly salesService = inject(SalesService);

  voucher = signal<ReceiptVoucher | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const saleIdParam = this.route.snapshot.paramMap.get('saleId');
    const saleId = Number(saleIdParam);

    if (!saleIdParam || Number.isNaN(saleId)) {
      this.loading.set(false);
      this.voucher.set(null);
      return;
    }

    this.salesService.getReceiptVoucherBySaleId(saleId).subscribe((voucher) => {
      this.voucher.set(voucher);
      this.loading.set(false);
    });
  }

  printVoucher(): void {
    window.print();
  }
}
