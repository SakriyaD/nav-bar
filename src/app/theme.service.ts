import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Single source of truth for the active theme.
  // Chart components and the navbar all read this signal,
  // so toggling the theme causes everything to update immediately.
  readonly currentTheme = signal<'light' | 'dark'>('light');

  // Updates the signal, sets Bootstrap's data-bs-theme on <html>,
  // and persists the choice to localStorage.
  applyTheme(theme: 'light' | 'dark'): void {
    this.currentTheme.set(theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Called once on app startup (in Navbar.ngOnInit).
  // Restores the saved theme, or falls back to the OS preference.
  loadSavedTheme(): void {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      this.applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark ? 'dark' : 'light');
    }
  }
}
