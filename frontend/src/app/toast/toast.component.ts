import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast-item toast-{{ toast.type }}"
          role="alert"
        >
          <span class="toast-icon">
            @switch (toast.type) {
              @case ('success') { ✓ }
              @case ('error') { ✕ }
              @case ('warning') { ⚠ }
              @default { ℹ }
            }
          </span>
          <span class="toast-message">{{ toast.message }}</span>
          <button
            class="toast-close"
            (click)="toastService.dismiss(toast.id)"
            aria-label="Dismiss notification"
          >×</button>
        </div>
      }
    </div>
  `,
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
