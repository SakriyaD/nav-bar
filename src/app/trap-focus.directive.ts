import { Directive, ElementRef, AfterViewInit, HostListener, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTrapFocus]',
  standalone: true,
})
export class TrapFocusDirective implements AfterViewInit, OnDestroy {
  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;
  private observer: MutationObserver | null = null;

  constructor(private el: ElementRef) {}

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

  @HostListener('keydown.tab', ['$event'])
  onTab(event: Event) {
  let keyboardEvent = event as KeyboardEvent;
    if (!this.lastFocusableElement || !this.firstFocusableElement) return;

    if (event.target === this.lastFocusableElement) {
      event.preventDefault();
      this.firstFocusableElement.focus();
    }
  }


}
