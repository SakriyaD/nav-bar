import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService, DashboardStats, RevenueByDay, CategoryStat, ProductStat } from './dashboard.service';
import { StatCard } from './components/stat-card/stat-card';
import { RevenueChart } from './components/revenue-chart/revenue-chart';
import { CategoryChart } from './components/category-chart/category-chart';
import { TopProductsChart } from './components/top-products-chart/top-products-chart';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, StatCard, RevenueChart, CategoryChart, TopProductsChart],
  templateUrl: 'dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly stats = signal<DashboardStats>({ totalOrders: 0, totalRevenue: 0, paidOrders: 0, unpaidOrders: 0 });
  readonly revenueByDay = signal<RevenueByDay[]>([]);
  readonly categoryStats = signal<CategoryStat[]>([]);
  readonly topProducts = signal<ProductStat[]>([]);

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe(s => this.stats.set(s));
    this.dashboardService.getRevenueByDay().subscribe(d => this.revenueByDay.set(d));
    this.dashboardService.getRevenueByCategory().subscribe(c => this.categoryStats.set(c));
    this.dashboardService.getTopProducts().subscribe(p => this.topProducts.set(p));
  }
}
