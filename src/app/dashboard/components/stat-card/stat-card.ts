import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stat-card" [style.--accent]="color()">
      <div class="stat-icon" [attr.aria-hidden]="true">{{ icon() }}</div>
      <div class="stat-body">
        <p class="stat-label">{{ label() }}</p>
        <p class="stat-value">{{ formattedValue() }}</p>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border-radius: 1rem;
      border-left: 4px solid var(--accent, #6366f1);
      background: var(--bs-secondary-bg);
      border-top: 1px solid var(--bs-border-color);
      border-right: 1px solid var(--bs-border-color);
      border-bottom: 1px solid var(--bs-border-color);
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    }
    .stat-icon {
      font-size: 2rem;
      line-height: 1;
    }
    .stat-label {
      margin: 0;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--bs-secondary-color);
      font-weight: 600;
    }
    .stat-value {
      margin: 0;
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--bs-emphasis-color);
    }
  `]
})
export class StatCard {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly icon = input.required<string>();
  readonly color = input('var(--bs-primary)');
  readonly isCurrency = input(false);

  readonly formattedValue = computed(() =>
    this.isCurrency()
      ? `Rs. ${this.value().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
      : this.value().toLocaleString()
  );
}
