import { ChangeDetectionStrategy, Component, input, computed, inject } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RevenueByDay } from '../../dashboard.service';
import {
  ApexChart, ApexAxisChartSeries, ApexXAxis, ApexStroke,
  ApexTooltip, ApexDataLabels, ApexGrid, ApexFill, ApexTheme
} from 'ng-apexcharts';
import { ThemeService } from '../../../theme.service';

@Component({
  selector: 'app-revenue-chart',
  imports: [NgApexchartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-card">
      <h6 class="chart-title">Revenue – Last 7 Days</h6>
      <apx-chart
        [series]="series()"
        [chart]="chartConfig"
        [xaxis]="xAxis()"
        [stroke]="stroke"
        [fill]="fill"
        [tooltip]="tooltip"
        [dataLabels]="dataLabels"
        [grid]="grid"
        [theme]="apexTheme()"
      />
    </div>
  `,
})
export class RevenueChart {
  readonly data = input.required<RevenueByDay[]>();

  private readonly themeService = inject(ThemeService);

  readonly series = computed<ApexAxisChartSeries>(() => [{
    name: 'Revenue',
    data: this.data().map(d => d.revenue),
  }]);

  readonly xAxis = computed<ApexXAxis>(() => ({
    categories: this.data().map(d => d.date),
    labels: { rotate: 0, style: { fontSize: '11px' } },
  }));

  readonly apexTheme = computed<ApexTheme>(() => ({
    mode: this.themeService.currentTheme(),
  }));

  readonly chartConfig: ApexChart = {
    type: 'area',
    height: 260,
    toolbar: { show: false },
    fontFamily: 'inherit',
  };

  readonly stroke: ApexStroke = { curve: 'smooth', width: 2 };

  readonly fill: ApexFill = {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 100] },
  };

  readonly tooltip: ApexTooltip = {
    y: { formatter: (v: number) => `Rs. ${v.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
  };

  readonly dataLabels: ApexDataLabels = { enabled: false };

  readonly grid: ApexGrid = { borderColor: 'var(--bs-border-color)', strokeDashArray: 4 };
}
