import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SalesService, Sale } from '../sales-service';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  paidOrders: number;
  unpaidOrders: number;
}

export interface RevenueByDay {
  date: string;
  revenue: number;
}

export interface CategoryStat {
  category: string;
  total: number;
}

export interface ProductStat {
  productName: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly salesService = inject(SalesService);

  // Computes the four top-level KPI numbers shown in the stat cards.
  getStats(): Observable<DashboardStats> {
    return this.salesService.getSales().pipe(
      map(sales => ({
        totalOrders: sales.length,
        totalRevenue: sales.reduce((sum, s) => sum + (s.netTotal ?? 0), 0),
        paidOrders: sales.filter(s => s.status === 'paid').length,
        unpaidOrders: sales.filter(s => s.status === 'unpaid').length,
      }))
    );
  }

  // Builds a day-by-day revenue array for the last `days` days.
  // Pre-fills missing days with 0 so the line chart has no gaps.
  getRevenueByDay(days = 7): Observable<RevenueByDay[]> {
    return this.salesService.getSales().pipe(
      map(sales => {
        const result: Record<string, number> = {};
        const today = new Date();

        // Initialise every day in the window to 0
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = d.toLocaleDateString('en-CA'); // YYYY-MM-DD
          result[key] = 0;
        }

        // Accumulate revenue from sales that fall within the window
        for (const sale of sales) {
          const key = new Date(sale.date).toLocaleDateString('en-CA');
          if (key in result) {
            result[key] += sale.netTotal ?? 0;
          }
        }

        return Object.entries(result).map(([date, revenue]) => ({ date, revenue }));
      })
    );
  }

  // Sums revenue per category across all sale lines, sorted highest first.
  // Used by the donut chart.
  getRevenueByCategory(): Observable<CategoryStat[]> {
    return this.salesService.getSales().pipe(
      map(sales => {
        const map: Record<string, number> = {};
        for (const sale of sales) {
          for (const line of sale.lines) {
            const cat = line.category || 'Uncategorised';
            map[cat] = (map[cat] ?? 0) + (line.amount ?? 0);
          }
        }
        return Object.entries(map)
          .map(([category, total]) => ({ category, total }))
          .sort((a, b) => b.total - a.total);
      })
    );
  }

  // Aggregates total quantity sold per product and returns the top `limit` results.
  // Used by the horizontal bar chart.
  getTopProducts(limit = 5): Observable<ProductStat[]> {
    return this.salesService.getSales().pipe(
      map(sales => {
        const map: Record<string, number> = {};
        for (const sale of sales) {
          for (const line of sale.lines) {
            const name = line.productName;
            map[name] = (map[name] ?? 0) + (line.quantity ?? 0);
          }
        }
        return Object.entries(map)
          .map(([productName, quantity]) => ({ productName, quantity }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, limit);
      })
    );
  }
}
