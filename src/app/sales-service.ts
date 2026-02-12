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

const SALES_STORAGE_KEY = 'sales';

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