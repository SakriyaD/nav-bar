import { Directive, ElementRef, AfterViewInit, OnDestroy, inject } from '@angular/core';

@Directive({
  selector: '[appTrapFocus]',
  host: { '(keydown.tab)': 'onTab($event)' },
})
export class TrapFocusDirective implements AfterViewInit, OnDestroy {
  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;
  private observer: MutationObserver | null = null;

  private readonly el = inject(ElementRef);

  ngAfterViewInit() {
    this.updateFocusableElements();
    this.observer = new MutationObserver(() => {
      this.updateFocusableElements();
    });

    this.observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true,
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private updateFocusableElements() {
    const focusableElements = this.el.nativeElement.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      this.firstFocusableElement = focusableElements[0];
      this.lastFocusableElement = focusableElements[focusableElements.length - 1];
    }
  }

  onTab(event: Event): void {
    if (!this.lastFocusableElement || !this.firstFocusableElement) return;
    if (event.target === this.lastFocusableElement) {
      event.preventDefault();
      this.firstFocusableElement.focus();
    }
  }


}
