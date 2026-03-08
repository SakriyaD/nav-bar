import { ChangeDetectionStrategy, Component, input, computed, inject } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ProductStat } from '../../dashboard.service';
import {
  ApexChart, ApexAxisChartSeries, ApexXAxis, ApexYAxis,
  ApexTooltip, ApexDataLabels, ApexPlotOptions, ApexTheme
} from 'ng-apexcharts';
import { ThemeService } from '../../../theme.service';

@Component({
  selector: 'app-top-products-chart',
  imports: [NgApexchartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-card">
      <h6 class="chart-title">Top 5 Products by Quantity</h6>
      @if (data().length > 0) {
        <apx-chart
          [series]="series()"
          [chart]="chartConfig"
          [xaxis]="xAxis()"
          [yaxis]="yAxis"
          [tooltip]="tooltip"
          [dataLabels]="dataLabels"
          [plotOptions]="plotOptions"
          [theme]="apexTheme()"
        />
      } @else {
        <p class="chart-empty">No data yet.</p>
      }
    </div>
  `,
})
export class TopProductsChart {
  readonly data = input.required<ProductStat[]>();

  // Inject shared theme service so the chart re-renders immediately on toggle
  private readonly themeService = inject(ThemeService);

  // Map product quantities into the bar series
  readonly series = computed<ApexAxisChartSeries>(() => [{
    name: 'Qty Sold',
    data: this.data().map(d => d.quantity),
  }]);

  // Product names become the y-axis labels (horizontal bar layout)
  readonly xAxis = computed<ApexXAxis>(() => ({
    categories: this.data().map(d => d.productName),
  }));

  // Reads the theme signal — recomputes automatically when theme changes
  readonly apexTheme = computed<ApexTheme>(() => ({
    mode: this.themeService.currentTheme(),
  }));

  readonly chartConfig: ApexChart = {
    type: 'bar',
    height: 260,
    toolbar: { show: false },
    fontFamily: 'inherit',
  };

  readonly yAxis: ApexYAxis = { labels: { formatter: (v: number) => `${v}` } };

  readonly tooltip: ApexTooltip = { y: { formatter: (v: number) => `${v} units` } };

  readonly dataLabels: ApexDataLabels = { enabled: false };

  readonly plotOptions: ApexPlotOptions = {
    bar: { horizontal: true, borderRadius: 4, barHeight: '60%' },
  };
}
