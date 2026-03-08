import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalStorage } from './local-storage';

export type SaleStatus = 'paid' | 'unpaid';

export interface Sale {
  id: number;
  date: string;
  customerName: string;
  address: string;
  phone: string;
  tax: number;
  subtotal: number;
  netTotal: number;
  status: SaleStatus;
  discount?: number;
  discountMode?: 'percent' | 'amount';
  paidTotal?: number;
  lines: SaleLine[];
}

export interface SaleLine {
  productName: string;
  id: string;
  category: string;
  rate: number | null;
  quantity: number | null;
  amount: number | null;
}

export interface ReceiptVoucherLine {
  productName: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface ReceiptVoucher {
  voucherNo: string;
  saleId: number;
  date: string;
  customerName: string;
  address: string;
  phone: string;
  subTotal: number;
  tax: number;
  discount: number;
  discountMode: 'percent' | 'amount';
  totalAmount: number;
  paymentMethod: string;
  receivedBy: string;
  lines: ReceiptVoucherLine[];
}

const SALES_STORAGE_KEY = 'sales';
const RECEIPT_VOUCHER_STORAGE_KEY = 'receiptVouchers';

@Injectable({
  providedIn: 'root',
})
export class SalesService {

  customerName = '';
  address = '';
  phone = '';
  lines: SaleLine[] = [];
  _subtotal = 0;

  get subtotal(): number {
    return this._subtotal;
  }

  set subtotal(value: number) {
    this._subtotal = value;
  }

  constructor(private storage: LocalStorage) {}

  updateSaleLines(lines: SaleLine[]): void {
    this.lines = lines;
    this.subtotal = this.lines.reduce((total, line) => total + (line.amount ?? 0), 0);
  }

  getSales(): Observable<Sale[]> {
    const sales = this.storage.getItem<Sale[]>(SALES_STORAGE_KEY) ?? [];
    return of(sales);
  }

  updateSales(updatedSalesList: Sale[]): Observable<Sale[]> {
    this.storage.setItem(SALES_STORAGE_KEY, updatedSalesList);
    return of(updatedSalesList);
  }

  getReceiptVouchers(): Observable<ReceiptVoucher[]> {
    const vouchers = this.storage.getItem<ReceiptVoucher[]>(RECEIPT_VOUCHER_STORAGE_KEY) ?? [];
    return of(vouchers);
  }

  getReceiptVoucherBySaleId(saleId: number): Observable<ReceiptVoucher | null> {
    const vouchers = this.storage.getItem<ReceiptVoucher[]>(RECEIPT_VOUCHER_STORAGE_KEY) ?? [];
    const voucher = vouchers.find((item) => item.saleId === saleId) ?? null;
    return of(voucher);
  }

  saveReceiptVoucher(voucher: ReceiptVoucher): Observable<ReceiptVoucher> {
    const vouchers = this.storage.getItem<ReceiptVoucher[]>(RECEIPT_VOUCHER_STORAGE_KEY) ?? [];
    const index = vouchers.findIndex((item) => item.saleId === voucher.saleId);

    if (index === -1) {
      this.storage.setItem(RECEIPT_VOUCHER_STORAGE_KEY, [voucher, ...vouchers]);
      return of(voucher);
    }

    const updatedVouchers = [...vouchers];
    updatedVouchers[index] = voucher;
    this.storage.setItem(RECEIPT_VOUCHER_STORAGE_KEY, updatedVouchers);
    return of(voucher);
  }

  removeReceiptVoucherBySaleId(saleId: number): Observable<void> {
    const vouchers = this.storage.getItem<ReceiptVoucher[]>(RECEIPT_VOUCHER_STORAGE_KEY) ?? [];
    const updatedVouchers = vouchers.filter((item) => item.saleId !== saleId);
    this.storage.setItem(RECEIPT_VOUCHER_STORAGE_KEY, updatedVouchers);
    return of(void 0);
  }

  saveSale(sale: Omit<Sale, 'id' | 'date'>): Observable<Sale> {
    const newSale: Sale = { ...sale, id: Date.now(), date: new Date().toISOString() };
    const sales = this.storage.getItem<Sale[]>(SALES_STORAGE_KEY) ?? [];
    const updatedSales = [newSale, ...sales];
    this.storage.setItem(SALES_STORAGE_KEY, updatedSales);
    return of(newSale);
  }

  resetCurrentSale(): void {
    this._subtotal = 0;
    this.customerName = '';
    this.address = '';
    this.phone = '';
    this.lines = [];
  }

  removeSale(saleId: number): Observable<any> {
    const sales = this.storage.getItem<Sale[]>(SALES_STORAGE_KEY) ?? [];
    const updatedSales = sales.filter(s => s.id !== saleId);
    this.storage.setItem(SALES_STORAGE_KEY, updatedSales);
    return of(null);
  }
}