import { ChangeDetectionStrategy, Component, input, computed, inject } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CategoryStat } from '../../dashboard.service';
import { ApexChart, ApexNonAxisChartSeries, ApexLegend, ApexTooltip, ApexDataLabels, ApexTheme } from 'ng-apexcharts';
import { ThemeService } from '../../../theme.service';

@Component({
  selector: 'app-category-chart',
  imports: [NgApexchartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-card">
      <h6 class="chart-title">Revenue by Category</h6>
      @if (data().length > 0) {
        <apx-chart
          [series]="series()"
          [labels]="labels()"
          [chart]="chartConfig"
          [legend]="legend"
          [tooltip]="tooltip"
          [dataLabels]="dataLabels"
          [theme]="apexTheme()"
        />
      } @else {
        <p class="chart-empty">No data yet.</p>
      }
    </div>
  `,
})
export class CategoryChart {
  readonly data = input.required<CategoryStat[]>();

  private readonly themeService = inject(ThemeService);

  readonly series = computed<ApexNonAxisChartSeries>(() => this.data().map(d => d.total));
  readonly labels = computed<string[]>(() => this.data().map(d => d.category));

  readonly apexTheme = computed<ApexTheme>(() => ({
    mode: this.themeService.currentTheme(),
  }));

  readonly chartConfig: ApexChart = {
    type: 'donut',
    height: 260,
    toolbar: { show: false },
    fontFamily: 'inherit',
  };

  readonly legend: ApexLegend = { position: 'bottom', fontSize: '12px' };

  readonly tooltip: ApexTooltip = {
    y: { formatter: (v: number) => `Rs. ${v.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
  };

  readonly dataLabels: ApexDataLabels = { enabled: true };
}
